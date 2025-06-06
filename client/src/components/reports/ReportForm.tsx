"use client"

import { useState, useEffect, type ChangeEvent } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import type { InsertReport } from "@shared/schema"
import { reportFormSchema } from "@/hooks/use-reports"
import { useGeolocation } from "@/hooks/use-geolocation"
import { useAuth } from "@/hooks/use-auth"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import AiImageAnalysis from "@/components/reports/AiImageAnalysis"

interface ReportFormProps {
  onSubmit: (data: InsertReport) => void
  onCancel: () => void
  loading: boolean
}

export default function ReportForm({ onSubmit, onCancel, loading }: ReportFormProps) {
  const { position, address, getPosition, loading: geoLoading } = useGeolocation()
  const { user } = useAuth()
  const [step, setStep] = useState(1)
  const [photos, setPhotos] = useState<string[]>([])
  const [isRecording, setIsRecording] = useState(false)
  const [voiceNote, setVoiceNote] = useState<string | null>(null)
  const [useAiAnalysis, setUseAiAnalysis] = useState(false)

  // Define form with validation
  const form = useForm<InsertReport>({
    resolver: zodResolver(reportFormSchema),
    defaultValues: {
      title: "",
      description: "",
      address: address || "",
      latitude: position ? position.latitude.toString() : "",
      longitude: position ? position.longitude.toString() : "",
      severity: "moderate",
      status: "pending",
      photos: [],
      anonymous: false,
    },
  })

  // Update form when geolocation changes
  useEffect(() => {
    if (position && address) {
      form.setValue("latitude", position.latitude.toString())
      form.setValue("longitude", position.longitude.toString())
      form.setValue("address", address)
    }
  }, [position, address, form])

  const handleRefreshLocation = async () => {
    try {
      await getPosition()
    } catch (error) {
      console.error("Failed to get position:", error)
    }
  }

  const handlePhotoUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newPhotos: string[] = []

      Array.from(e.target.files).forEach((file) => {
        // In a real app, we would upload to a server
        // For now, we'll create object URLs for preview
        const reader = new FileReader()
        reader.onload = () => {
          if (reader.result) {
            newPhotos.push(reader.result.toString())
            if (newPhotos.length === e.target.files!.length) {
              setPhotos((prev) => [...prev, ...newPhotos])
              form.setValue("photos", [...photos, ...newPhotos])
            }
          }
        }
        reader.readAsDataURL(file)
      })
    }
  }

  const handleRemovePhoto = (index: number) => {
    const updatedPhotos = photos.filter((_, i) => i !== index)
    setPhotos(updatedPhotos)
    form.setValue("photos", updatedPhotos)
  }

  const toggleVoiceRecording = () => {
    // In a real app, this would use the MediaRecorder API
    // For this demo, we'll simulate recording
    setIsRecording(!isRecording)

    if (isRecording) {
      // Simulated voice recording result
      setVoiceNote("voice_recording_simulation.mp3")
      form.setValue("voiceNote", "voice_recording_simulation.mp3")
    }
  }

  const handleAiAnalysisComplete = (results: {
    severity: string
    confidence: number
    leakType: string
    description: string
  }) => {
    // Update form with AI analysis results
    form.setValue("severity", results.severity)
    form.setValue("title", results.leakType)
    form.setValue("description", results.description)
  }

  const handleContinue = () => {
    if (step === 1) {
      // Validate first step (location)
      const locationFields = ["latitude", "longitude", "address", "severity"]
      const hasLocationErrors = locationFields.some((field) => !!form.formState.errors[field as keyof InsertReport])

      if (hasLocationErrors) {
        return
      }

      setStep(2)
    } else if (step === 2) {
      // Validate second step (media & description)
      const contentFields = ["title", "description"]
      const hasContentErrors = contentFields.some((field) => !!form.formState.errors[field as keyof InsertReport])

      if (hasContentErrors) {
        return
      }

      setStep(3)
    } else {
      // Submit the form
      form.handleSubmit((data) => onSubmit(data))()
    }
  }

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1)
    } else {
      onCancel()
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit((data) => onSubmit(data))}>
        {/* Step Indicator */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div
                className={`flex items-center justify-center w-6 h-6 ${step >= 1 ? "bg-primary-600" : "bg-neutral-300"} rounded-full text-white`}
              >
                <span className="text-xs">1</span>
              </div>
              <div className={`h-1 w-8 ${step >= 2 ? "bg-primary-600" : "bg-neutral-300"}`}></div>
              <div
                className={`flex items-center justify-center w-6 h-6 ${step >= 2 ? "bg-primary-600" : "bg-neutral-300"} rounded-full text-white`}
              >
                <span className="text-xs">2</span>
              </div>
              <div className={`h-1 w-8 ${step >= 3 ? "bg-primary-600" : "bg-neutral-300"}`}></div>
              <div
                className={`flex items-center justify-center w-6 h-6 ${step >= 3 ? "bg-primary-600" : "bg-neutral-300"} rounded-full ${step >= 3 ? "text-white" : "text-neutral-600"}`}
              >
                <span className="text-xs">3</span>
              </div>
            </div>
            <span className="text-sm text-neutral-500">Step {step} of 3</span>
          </div>
        </div>

        {/* Step 1: Location Details */}
        {step === 1 && (
          <div className="space-y-4">
            <h4 className="text-base font-medium font-heading text-neutral-800">Location Details</h4>

            {/* Location Map Preview */}
            <div className="mb-4 relative rounded-lg overflow-hidden border border-neutral-300 h-40 bg-neutral-100">
              {position ? (
                <iframe
                  title="Location Preview"
                  width="100%"
                  height="100%"
                  frameBorder="0"
                  src={`https://www.openstreetmap.org/export/embed.html?bbox=${position.longitude - 0.01},${position.latitude - 0.01},${position.longitude + 0.01},${position.latitude + 0.01}&marker=${position.latitude},${position.longitude}`}
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <Button variant="outline" onClick={handleRefreshLocation} disabled={geoLoading}>
                    {geoLoading ? <span>Locating...</span> : <span>Get My Location</span>}
                  </Button>
                </div>
              )}

              {position && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="p-1 rounded-full bg-primary-600">
                    <div className="h-8 w-8 rounded-full border-4 border-white bg-primary-600 text-white flex items-center justify-center">
                      <i className="ri-map-pin-2-fill"></i>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Address Field */}
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <div className="flex">
                    <FormControl>
                      <Input {...field} placeholder="Location address" className={position ? "bg-neutral-50" : ""} />
                    </FormControl>
                    <Button
                      type="button"
                      variant="outline"
                      className="ml-2"
                      onClick={handleRefreshLocation}
                      disabled={geoLoading}
                    >
                      <i className="ri-refresh-line"></i>
                    </Button>
                  </div>
                  <p className="text-xs text-neutral-500">
                    {position
                      ? "Using your current location. Edit if needed."
                      : "Please allow location access or enter address manually."}
                  </p>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Hidden Latitude/Longitude Fields */}
            <FormField
              control={form.control}
              name="latitude"
              render={({ field }) => (
                <FormItem className="hidden">
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="longitude"
              render={({ field }) => (
                <FormItem className="hidden">
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Severity Radio Buttons */}
            <FormField
              control={form.control}
              name="severity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Severity</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex items-center space-x-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="minor" id="minor" />
                        <Label htmlFor="minor">Minor</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="moderate" id="moderate" />
                        <Label htmlFor="moderate">Moderate</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="critical" id="critical" />
                        <Label htmlFor="critical">Critical</Label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        )}

        {/* Step 2: Media & Description */}
        {step === 2 && (
          <div className="space-y-4">
            <h4 className="text-base font-medium font-heading text-neutral-800">Media</h4>

            {/* AI Analysis Toggle */}
            <div className="flex items-center justify-between rounded-lg border p-3 mb-4">
              <div className="space-y-0.5">
                <Label className="text-base">Use AI Analysis</Label>
                <p className="text-sm text-muted-foreground">Let AI analyze your leak photo to provide details</p>
              </div>
              <Switch checked={useAiAnalysis} onCheckedChange={setUseAiAnalysis} />
            </div>

            {useAiAnalysis ? (
              <AiImageAnalysis onAnalysisComplete={handleAiAnalysisComplete} />
            ) : (
              <>
                {/* Photo Upload */}
                <div className="mb-4">
                  <Label className="block text-sm font-medium mb-2">Photos (Optional)</Label>
                  <div className="flex flex-wrap gap-2">
                    {/* Uploaded Photos */}
                    {photos.map((photo, index) => (
                      <div key={index} className="relative h-20 w-20 rounded-md overflow-hidden border border-neutral-300">
                        <img src={photo || "/placeholder.svg"} alt={`Uploaded leak photo ${index + 1}`} className="h-full w-full object-cover" />
                        <button
                          type="button"
                          onClick={() => handleRemovePhoto(index)}
                          className="absolute top-0 right-0 bg-neutral-800 bg-opacity-60 text-white p-1 rounded-bl-md"
                        >
                          <i className="ri-delete-bin-line text-xs"></i>
                        </button>
                      </div>
                    ))}

                    {/* Add Photo Button */}
                    <label className="h-20 w-20 rounded-md border-2 border-dashed border-neutral-300 flex items-center justify-center text-neutral-500 hover:text-neutral-700 hover:border-neutral-400 cursor-pointer">
                      <i className="ri-add-line text-xl"></i>
                      <Input
                        type="file"
                        accept="image/*"
                        multiple
                        className="hidden"
                        onChange={handlePhotoUpload}
                        disabled={photos.length >= 5}
                      />
                    </label>
                  </div>
                  <p className="mt-1 text-xs text-neutral-500">Add up to 5 photos. Each photo must be under 5MB.</p>
                </div>

                {/* Voice Note */}
                <div>
                  <Label className="block text-sm font-medium mb-2">Voice Note (Optional)</Label>
                  <Button type="button" variant="outline" className="w-full py-3 h-auto" onClick={toggleVoiceRecording}>
                    <div className="flex items-center justify-center">
                      <i className={`ri-mic-line text-xl text-primary-600 mr-2 ${isRecording ? "animate-pulse" : ""}`}></i>
                      <span>
                        {isRecording
                          ? "Stop Recording"
                          : voiceNote
                            ? "Re-record Voice Description"
                            : "Record Voice Description"}
                      </span>
                    </div>
                  </Button>
                  {voiceNote && !isRecording && (
                    <p className="mt-1 text-xs text-neutral-500">Voice note recorded successfully</p>
                  )}
                </div>
              </>
            )}

            {/* Title Field */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Brief title for the leak (e.g. 'Broken Main Pipe')" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Description Field */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea {...field} placeholder="Describe what you're seeing..." rows={3} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        )}

        {/* Step 3: Submit & Preferences */}
        {step === 3 && (
          <div className="space-y-4">
            <h4 className="text-base font-medium font-heading text-neutral-800">Review & Submit</h4>

            <div className="bg-neutral-50 p-4 rounded-lg">
              <h5 className="font-medium">{form.getValues("title")}</h5>
              <div className="text-sm mt-2">
                <p>
                  <span className="font-medium">Location:</span> {form.getValues("address")}
                </p>
                <p>
                  <span className="font-medium">Severity:</span> {form.getValues("severity")}
                </p>
                <p>
                  <span className="font-medium">Description:</span> {form.getValues("description")}
                </p>
                <p>
                  <span className="font-medium">Photos:</span> {photos.length} attached
                </p>
                {voiceNote && (
                  <p>
                    <span className="font-medium">Voice Note:</span> Included
                  </p>
                )}
                {useAiAnalysis && (
                  <p>
                    <span className="font-medium">AI Analysis:</span> Used for assessment
                  </p>
                )}
              </div>
            </div>

            {/* Anonymous Reporting Option */}
            {user && (
              <FormField
                control={form.control}
                name="anonymous"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                    <div className="space-y-0.5">
                      <FormLabel>Report Anonymously</FormLabel>
                      <p className="text-sm text-muted-foreground">Your name won't be associated with this report</p>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />
            )}

            <div className="!mt-6">
              <p className="text-sm text-neutral-500 mb-2">
                {user ? (
                  <>Submitting as {form.getValues("anonymous") ? "anonymous" : user.username}</>
                ) : (
                  <>
                    You are submitting this report anonymously.
                    <a href="/auth" className="text-primary-600 ml-1">
                      Sign in
                    </a>{" "}
                    to track your reports.
                  </>
                )}
              </p>
            </div>
          </div>
        )}

        {/* Form Navigation */}
        <div className="flex justify-between mt-6">
          <Button type="button" variant="outline" onClick={handleBack}>
            {step === 1 ? "Cancel" : "Back"}
          </Button>

          <Button type="button" onClick={handleContinue} disabled={loading}>
            {loading ? (
              <span className="flex items-center">
                <i className="ri-loader-4-line animate-spin mr-2"></i>
                Submitting...
              </span>
            ) : (
              <span>{step === 3 ? "Submit Report" : "Continue"}</span>
            )}
          </Button>
        </div>
      </form>
    </Form>
  )
}
