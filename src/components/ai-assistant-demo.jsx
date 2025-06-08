"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Bot, Sparkles, MessageSquare, ArrowRight } from "lucide-react"
import Link from "next/link"

export function AIAssistantDemo() {
  return (
    <Card className="border-dashed border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-purple-50">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full">
              <Bot className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg">AI Assistant Ready!</CardTitle>
              <CardDescription>
                Your intelligent business helper is now available
              </CardDescription>
            </div>
          </div>
          <Badge variant="secondary" className="bg-white">
            <Sparkles className="h-3 w-3 mr-1" />
            New Feature
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Get instant help with inventory management, sales analysis, customer relations, 
            and business operations. Ask questions in plain English and receive intelligent, 
            context-aware responses.
          </p>
          
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="text-xs">
              <MessageSquare className="h-3 w-3 mr-1" />
              Natural Language
            </Badge>
            <Badge variant="outline" className="text-xs">
              Real-time Responses
            </Badge>
            <Badge variant="outline" className="text-xs">
              Business Focused
            </Badge>
          </div>

          <div className="flex gap-3 pt-2">
            <Link href="/dashboard/ai-assistant">
              <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                Open AI Assistant
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
            <p className="text-xs text-gray-500 self-center">
              Or use the floating button (bottom right)
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
