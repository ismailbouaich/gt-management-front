"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Bot, Sparkles, MessageCircle } from "lucide-react"
import { AIAssistant } from "@/components/ai-assistant"

export function FloatingAIButton() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <TooltipProvider>
      <Tooltip>
        <Sheet open={isOpen} onOpenChange={setIsOpen}>          <TooltipTrigger asChild>
            <SheetTrigger asChild>
              <Button
                size="lg"
                className="fixed bottom-20 right-4 h-14 w-14 rounded-full shadow-lg z-40 group"
              >
                <div className="relative">
                  <Bot className="h-6 w-6  transition-transform group-hover:scale-110" />
                 
                </div>
              </Button>
            </SheetTrigger>
          </TooltipTrigger>
          
          <TooltipContent side="left" className="mr-2">
            <p>Ask AI Assistant</p>
          </TooltipContent>
          
          <SheetContent className="w-[400px] sm:w-[500px] p-0 flex flex-col">
            <SheetHeader className="p-6 pb-4 border-b flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-full">
                  <Bot className="h-5 w-5" />
                </div>
                <div>
                  <SheetTitle className="text-xl">AI Assistant</SheetTitle>
                  <SheetDescription>
                    Your intelligent business management helper
                  </SheetDescription>
                </div>
                <Badge variant="secondary" className="ml-auto">
                  <MessageCircle className="h-3 w-3 mr-1" />
                  Ready
                </Badge>
              </div>
            </SheetHeader>
            
            <div className="flex-1 min-h-0">
              <AIAssistant />
            </div>
          </SheetContent>
        </Sheet>
      </Tooltip>
    </TooltipProvider>
  )
}
