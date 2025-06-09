"use client"

import { AIAssistant } from "@/components/ai-assistant"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Bot, Sparkles, MessageSquare, Zap, Shield, Clock } from "lucide-react"

export default function AIAssistantPage() {
  const features = [
    {
      icon: MessageSquare,
      title: "Natural Conversations",
      description: "Ask questions in plain English about your business operations"
    },
    {
      icon: Zap,
      title: "Instant Responses",
      description: "Get immediate answers to help you make quick decisions"
    },
    {
      icon: Shield,
      title: "Business Focused",
      description: "Specialized knowledge about management and operations"
    },
    {
      icon: Clock,
      title: "24/7 Available",
      description: "Always ready to help whenever you need assistance"
    }
  ]

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex items-center justify-center w-12 h-12 rounded-full">
            <Bot className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">AI Assistant</h1>
            <p className="text-gray-600">
              Your intelligent business management companion
            </p>
          </div>          <Badge variant="secondary" className="ml-auto">
            <Sparkles className="h-3 w-3 mr-1" />
            Powered by AI
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main AI Chat Interface */}
        <div className="lg:col-span-2">
          <Card className="h-[600px]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Chat Interface
              </CardTitle>
              <CardDescription>
                Start a conversation with your AI assistant
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[calc(100%-120px)]">
              <AIAssistant />
            </CardContent>
          </Card>
        </div>

        {/* Features and Information */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Features</CardTitle>
              <CardDescription>
                What your AI assistant can help you with
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {features.map((feature, index) => (
                <div key={index} className="flex gap-3">
                  <div className="flex items-center justify-center w-8 h-8 bg-blue-50 rounded-lg flex-shrink-0">
                    <feature.icon className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-sm">{feature.title}</h4>
                    <p className="text-xs text-gray-600">{feature.description}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Common Questions</CardTitle>
              <CardDescription>
                Try asking about these topics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm font-medium">Inventory Management</p>
                  <p className="text-xs text-gray-600">"How do I track low stock items?"</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm font-medium">Sales Analysis</p>
                  <p className="text-xs text-gray-600">"Show me my best selling products"</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm font-medium">Customer Relations</p>
                  <p className="text-xs text-gray-600">"How to improve customer retention?"</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm font-medium">Financial Reports</p>
                  <p className="text-xs text-gray-600">"Explain my profit margins"</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Access</CardTitle>
              <CardDescription>
                AI Assistant is always available
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Floating button on all pages</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>Sidebar navigation link</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span>Context-aware responses</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
