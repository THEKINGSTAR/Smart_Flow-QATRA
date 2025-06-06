"use client"

import { createContext, useState, type ReactNode } from "react"
import { useToast } from "@/hooks/use-toast"

// Types for AI analysis results
export interface ImageAnalysisResult {
  severity: "critical" | "high" | "medium" | "low" | null
  leakType: string | null
  confidence: number
  description: string | null
  isAnalyzing: boolean
}

export interface TextGenerationResult {
  text: string | null
  isGenerating: boolean
}

// Context type
interface AiContextType {
  analyzeImage: (imageUrl: string) => Promise<ImageAnalysisResult>
  generateText: (prompt: string) => Promise<string>
  lastImageAnalysis: ImageAnalysisResult | null
  lastTextGeneration: TextGenerationResult | null
  isProcessing: boolean
}

// Create context
const AiContext = createContext<AiContextType | null>(null)

// Mock data for demonstration
const mockLeakTypes = [
  "pipe burst",
  "joint leak",
  "valve leak",
  "hydrant leak",
  "meter leak",
  "surface water",
  "underground leak",
]

const mockDescriptions = [
  "Water actively spraying from a broken pipe connection.",
  "Slow drip from a corroded joint in the water line.",
  "Standing water pooling around a valve box, indicating a possible underground leak.",
  "Water seeping through cracks in the pavement, suggesting a subsurface leak.",
  "Fire hydrant with visible water leakage around the base.",
  "Wet area with unusual vegetation growth, typical sign of a persistent leak.",
  "Water meter showing continuous flow despite all fixtures being turned off.",
]

// Provider component
export function AiProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast()
  const [lastImageAnalysis, setLastImageAnalysis] = useState<ImageAnalysisResult | null>(null)
  const [lastTextGeneration, setLastTextGeneration] = useState<TextGenerationResult | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)

  // Mock image analysis function
  const analyzeImage = async (imageUrl: string): Promise<ImageAnalysisResult> => {
    setIsProcessing(true)
    setLastImageAnalysis({ severity: null, leakType: null, confidence: 0, description: null, isAnalyzing: true })

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 2000))

    try {
      // In a real implementation, this would call an actual AI service
      // For demo purposes, we'll generate random results
      const severityOptions = ["critical", "high", "medium", "low"] as const
      const randomSeverity = severityOptions[Math.floor(Math.random() * severityOptions.length)]
      const randomLeakType = mockLeakTypes[Math.floor(Math.random() * mockLeakTypes.length)]
      const randomConfidence = Math.floor(Math.random() * 30) + 70 // 70-99%
      const randomDescription = mockDescriptions[Math.floor(Math.random() * mockDescriptions.length)]

      const result: ImageAnalysisResult = {
        severity: randomSeverity,
        leakType: randomLeakType,
        confidence: randomConfidence,
        description: randomDescription,
        isAnalyzing: false,
      }

      setLastImageAnalysis(result)
      setIsProcessing(false)
      return result
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred"
      toast({
        title: "Image analysis failed",
        description: errorMessage,
        variant: "destructive",
      })
      
      const errorResult: ImageAnalysisResult = {
        severity: null,
        leakType: null,
        confidence: 0,
        description: null,
        isAnalyzing: false,
      }
      
      setLastImageAnalysis(errorResult)
      setIsProcessing(false)
      return errorResult
    }
  }

  // Mock text generation function
  const generateText = async (prompt: string): Promise<string> => {
    setIsProcessing(true)
    setLastTextGeneration({ text: null, isGenerating: true })

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1500))

    try {
      // In a real implementation, this would call an actual AI service
      // For demo purposes, we'll generate predefined responses based on prompt keywords
      let generatedText = ""

      if (prompt.toLowerCase().includes("leak")) {
        generatedText = "I can see a water leak in this image. It appears to be coming from a pipe connection. The severity seems moderate, and it should be addressed within the next few days to prevent water waste and potential damage."
      } else if (prompt.toLowerCase().includes("describe")) {
        generatedText = "The image shows water accumulating near what appears to be a utility access point. There's visible moisture on the surrounding concrete, suggesting an ongoing leak. The water is clear without visible contaminants."
      } else if (prompt.toLowerCase().includes("suggest") || prompt.toLowerCase().includes("recommend")) {
        generatedText = "Based on what I can see, I recommend reporting this as a moderate severity leak. It's not an emergency but should be addressed soon. Include in your report that it's located near a utility access point and appears to be clean water."
      } else {
        generatedText = "This appears to be a water leak situation. The water is accumulating on a hard surface, suggesting it's coming from a nearby pipe or connection. Consider reporting this to your local water utility for proper assessment and repair."
      }

      setLastTextGeneration({ text: generatedText, isGenerating: false })
      setIsProcessing(false)
      return generatedText
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred"
      toast({
        title: "Text generation failed",
        description: errorMessage,
        variant: "destructive",
      })
      
      setLastTextGeneration({ text: null, isGenerating: false })
      setIs
