"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useQuery } from "@tanstack/react-query"

// Inline type definition instead of importing from @shared/schema
interface Tip {
  id: number
  title: string
  content: string
  category?: string
  createdAt: Date
}

export default function EducationalTip() {
  const [showTip, setShowTip] = useState(true)
  const [currentTipIndex, setCurrentTipIndex] = useState(0)

  // Get tips from API
  const { data: tips = [] } = useQuery<Tip[]>({
    queryKey: ["/api/tips"],
  })

  // Auto-hide tip after 10 seconds
  useEffect(() => {
    if (showTip) {
      const timer = setTimeout(() => {
        setShowTip(false)
      }, 10000)

      return () => clearTimeout(timer)
    }
  }, [showTip, currentTipIndex])

  // If no tips are available, don't show anything
  if (tips.length === 0) {
    return null
  }

  const currentTip = tips[currentTipIndex]

  const handleNextTip = () => {
    const nextIndex = (currentTipIndex + 1) % tips.length
    setCurrentTipIndex(nextIndex)
  }

  if (!showTip) {
    return (
      <Button
        variant="outline"
        size="sm"
        className="fixed bottom-24 md:bottom-24 right-4 z-10 bg-white"
        onClick={() => setShowTip(true)}
      >
        <i className="ri-lightbulb-line mr-2"></i>
        Water Tip
      </Button>
    )
  }

  return (
    <Card className="fixed bottom-24 md:bottom-24 left-4 right-4 md:left-auto md:right-6 md:w-80 z-10 shadow-lg border border-neutral-200">
      <CardHeader className="py-3 px-4 bg-primary-50">
        <div className="flex justify-between items-center">
          <h4 className="font-heading font-medium text-primary-700 flex items-center">
            <i className="ri-lightbulb-line mr-2"></i> Water Saving Tip
          </h4>
          <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => setShowTip(false)}>
            <i className="ri-close-line"></i>
          </Button>
        </div>
      </CardHeader>

      <CardContent className="p-4">
        <p className="text-sm text-neutral-700">{currentTip.content}</p>
      </CardContent>

      <CardFooter className="py-2 px-4 flex justify-between">
        <span className="text-xs text-neutral-500">
          Tip {currentTipIndex + 1} of {tips.length}
        </span>
        <Button
          variant="link"
          size="sm"
          className="text-xs text-primary-600 hover:text-primary-700 p-0"
          onClick={handleNextTip}
        >
          Next Tip
        </Button>
      </CardFooter>
    </Card>
  )
}
