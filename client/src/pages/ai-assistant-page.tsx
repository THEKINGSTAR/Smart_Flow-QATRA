"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { useAuth } from "@/hooks/use-auth"
import Header from "@/components/layout/Header"
import MobileNavigation from "@/components/layout/MobileNavigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { OfflineStorageProvider } from "@/hooks/use-offline-storage"
import { ReportsProvider, useReports } from "@/hooks/use-reports"
import { useToast } from "@/hooks/use-toast"
import { Send, ImageIcon, Loader2, HelpCircle, Droplet, MapPin, AlertTriangle, Info } from "lucide-react"
import ReportModal from "@/components/reports/ReportModal"
import type { InsertReport } from "@shared/schema"

// Mock AI responses for demonstration
const mockResponses = {
  greeting:
    "Hello! I'm your SmartFlow AI assistant. How can I help you today? You can ask me about water conservation, leak reporting, or how to use the app.",
  leakHelp:
    "To report a water leak, tap the '+' button at the bottom of the screen or use the 'Report a Leak' button on the map page. You can upload photos, provide a description, and mark the location of the leak.",
  waterConservation:
    "Here are some water conservation tips:\n\n• Fix leaky faucets and toilets promptly\n• Take shorter showers\n• Use water-efficient appliances\n• Water plants during cooler parts of the day\n• Collect rainwater for garden use",
  appHelp:
    "The SmartFlow app allows you to:\n\n• Report water leaks in your community\n• Track the status of your reports\n• View leaks on an interactive map\n• Learn about water conservation\n• Earn achievements for your contributions",
}

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
  isProcessing?: boolean
}

function AiAssistantContent() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: mockResponses.greeting,
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [isReportModalOpen, setIsReportModalOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("chat")
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { submitReportMutation } = useReports()

  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSendMessage = async () => {
    if (!input.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    }

    const processingMessage: Message = {
      id: `processing-${Date.now()}`,
      role: "assistant",
      content: "",
      timestamp: new Date(),
      isProcessing: true,
    }

    setMessages((prev) => [...prev, userMessage, processingMessage])
    setInput("")
    setIsProcessing(true)

    // Simulate AI processing
    setTimeout(() => {
      setIsProcessing(false)
      setMessages((prev) => {
        const newMessages = [...prev]
        const processingIndex = newMessages.findIndex((m) => m.id === processingMessage.id)

        let responseContent = ""
        const lowerInput = input.toLowerCase()

        if (lowerInput.includes("report") || lowerInput.includes("leak")) {
          responseContent = mockResponses.leakHelp
        } else if (lowerInput.includes("conservation") || lowerInput.includes("save water")) {
          responseContent = mockResponses.waterConservation
        } else if (lowerInput.includes("app") || lowerInput.includes("help") || lowerInput.includes("how")) {
          responseContent = mockResponses.appHelp
        } else {
          responseContent =
            "I'm not sure how to help with that specific query. You can ask me about water conservation, leak reporting, or how to use the app."
        }

        if (processingIndex !== -1) {
          newMessages[processingIndex] = {
            id: `response-${Date.now()}`,
            role: "assistant",
            content: responseContent,
            timestamp: new Date(),
          }
        }

        return newMessages
      })
    }, 1500)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleAddReport = () => {
    setIsReportModalOpen(true)
  }

  const handleSubmitReport = (data: InsertReport) => {
    submitReportMutation.mutate(data, {
      onSuccess: () => {
        setIsReportModalOpen(false)
        toast({
          title: "Report submitted",
          description: "Your leak report has been submitted successfully.",
        })
      },
    })
  }

  const suggestedQuestions = [
    "How do I report a water leak?",
    "What are some water conservation tips?",
    "How does the SmartFlow app work?",
    "What should I do if I find a major leak?",
  ]

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-grow py-6 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold font-heading text-neutral-900">AI Assistant</h1>
          <p className="text-neutral-600 mt-2">
            Get help with reporting leaks, water conservation tips, and using the app
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-4 grid grid-cols-2">
            <TabsTrigger value="chat">Chat Assistant</TabsTrigger>
            <TabsTrigger value="help">Help Topics</TabsTrigger>
          </TabsList>

          <TabsContent value="chat" className="space-y-4">
            <Card className="border-primary-100">
              <CardHeader className="pb-2">
                <div className="flex items-center">
                  <Avatar className="h-8 w-8 mr-2">
                    <AvatarImage src="/placeholder.svg?height=32&width=32" />
                    <AvatarFallback className="bg-primary-100 text-primary-700">AI</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg">SmartFlow AI Assistant</CardTitle>
                    <CardDescription>Ask questions about water leaks and conservation</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 max-h-[400px] overflow-y-auto p-1">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-lg p-3 ${
                          message.role === "user" ? "bg-primary-600 text-white" : "bg-neutral-100 text-neutral-800"
                        }`}
                      >
                        {message.isProcessing ? (
                          <div className="flex items-center justify-center h-6">
                            <Loader2 className="h-4 w-4 animate-spin" />
                          </div>
                        ) : (
                          <div className="whitespace-pre-wrap">{message.content}</div>
                        )}
                        <div
                          className={`text-xs mt-1 ${
                            message.role === "user" ? "text-primary-100" : "text-neutral-500"
                          }`}
                        >
                          {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </div>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>

                {!isProcessing && (
                  <div className="mt-4">
                    <p className="text-sm text-neutral-500 mb-2">Suggested questions:</p>
                    <div className="flex flex-wrap gap-2">
                      {suggestedQuestions.map((question, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="cursor-pointer hover:bg-primary-50"
                          onClick={() => setInput(question)}
                        >
                          {question}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <div className="flex w-full items-center space-x-2">
                  <Button variant="outline" size="icon" className="shrink-0" onClick={() => setIsReportModalOpen(true)}>
                    <ImageIcon className="h-4 w-4" />
                  </Button>
                  <Textarea
                    placeholder="Type your message..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="min-h-10 flex-1"
                    disabled={isProcessing}
                  />
                  <Button
                    className="shrink-0"
                    size="icon"
                    onClick={handleSendMessage}
                    disabled={!input.trim() || isProcessing}
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </CardFooter>
            </Card>

            <div className="text-center">
              <Button variant="outline" onClick={handleAddReport} className="gap-2">
                <Droplet className="h-4 w-4" />
                <span>Report a Leak Now</span>
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="help">
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Droplet className="h-5 w-5 mr-2 text-primary-600" />
                    Reporting Water Leaks
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <h3 className="font-medium">How to Report a Leak</h3>
                    <p className="text-sm text-neutral-600">
                      Tap the '+' button at the bottom of the screen or use the 'Report a Leak' button on the map page.
                      You can upload photos, provide a description, and mark the location of the leak.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-medium">What Information to Include</h3>
                    <ul className="list-disc list-inside text-sm text-neutral-600 space-y-1">
                      <li>Clear photos of the leak</li>
                      <li>Precise location (use the map marker)</li>
                      <li>Severity of the leak (minor, moderate, critical)</li>
                      <li>How long the leak has been occurring (if known)</li>
                      <li>Any potential hazards or damage caused</li>
                    </ul>
                  </div>

                  <Button variant="outline" onClick={handleAddReport} className="w-full gap-2">
                    <Droplet className="h-4 w-4" />
                    <span>Report a Leak Now</span>
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <MapPin className="h-5 w-5 mr-2 text-primary-600" />
                    Using the Map
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-neutral-600">
                    The interactive map shows reported leaks in your area. You can:
                  </p>
                  <ul className="list-disc list-inside text-sm text-neutral-600 space-y-1">
                    <li>View all reported leaks with color-coded severity markers</li>
                    <li>Tap on a marker to see details about the leak</li>
                    <li>Filter leaks by status or severity</li>
                    <li>Add a new leak report directly from the map</li>
                    <li>See your current location to report nearby leaks accurately</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <AlertTriangle className="h-5 w-5 mr-2 text-amber-500" />
                    Emergency Situations
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-amber-50 border border-amber-200 rounded-md p-3">
                    <p className="text-sm text-amber-800">
                      <strong>Important:</strong> For major water main breaks or emergency situations that pose
                      immediate danger, please contact your local water utility emergency line directly.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-medium">Signs of Emergency Water Situations:</h3>
                    <ul className="list-disc list-inside text-sm text-neutral-600 space-y-1">
                      <li>Gushing water from broken pipes</li>
                      <li>Flooding that threatens property or safety</li>
                      <li>Water contamination</li>
                      <li>Complete loss of water pressure in your neighborhood</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Info className="h-5 w-5 mr-2 text-primary-600" />
                    Additional Resources
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Button variant="outline" className="justify-start">
                      <HelpCircle className="h-4 w-4 mr-2" />
                      Water Conservation Tips
                    </Button>
                    <Button variant="outline" className="justify-start">
                      <HelpCircle className="h-4 w-4 mr-2" />
                      Leak Identification Guide
                    </Button>
                    <Button variant="outline" className="justify-start">
                      <HelpCircle className="h-4 w-4 mr-2" />
                      FAQ
                    </Button>
                    <Button variant="outline" className="justify-start">
                      <HelpCircle className="h-4 w-4 mr-2" />
                      Contact Support
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>

      <MobileNavigation onAddReport={handleAddReport} />

      <ReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        onSubmit={handleSubmitReport}
        loading={submitReportMutation.isPending}
      />
    </div>
  )
}

export default function AiAssistantPage() {
  return (
    <OfflineStorageProvider>
      <ReportsProvider>
        <AiAssistantContent />
      </ReportsProvider>
    </OfflineStorageProvider>
  )
}
