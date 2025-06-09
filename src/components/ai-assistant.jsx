"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Loader2, Send, Bot, User, Sparkles, MessageSquare, Download, ExternalLink, CheckCircle } from "lucide-react"
import { useRouter } from "next/navigation"

export function AIAssistant() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: 'assistant',
      content: 'Hello! I\'m your GT Management AI assistant. I can help you with product management, sales, inventory, reports, and any questions about your business operations. I can also generate and download reports for you!\n\n💡 Try saying: "Generate sales report" or "Download inventory analysis"',
      timestamp: new Date()
    }
  ])
  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isProcessingAction, setIsProcessingAction] = useState(false)
  const scrollAreaRef = useRef(null)
  const messagesEndRef = useRef(null)
  const router = useRouter()
  // Execute actions detected in AI response
  const executeActions = async (actions) => {
    if (!actions || actions.length === 0) return;

    setIsProcessingAction(true);

    for (const action of actions) {
      try {
        if (action.type === 'GENERATE_REPORT') {
          await downloadReport(action.reportType);
          
          // Add success message
          const successMessage = {
            id: Date.now() + Math.random(),
            role: 'assistant',
            content: `✅ ${action.description} completed successfully! The file has been downloaded to your device.`,
            timestamp: new Date(),
            isAction: true,
            actionType: 'report_success'
          };
          setMessages(prev => [...prev, successMessage]);
          
        } else if (action.type === 'NAVIGATE') {
          // Add navigation message
          const navMessage = {
            id: Date.now() + Math.random(),
            role: 'assistant',
            content: `🔄 ${action.description}...`,
            timestamp: new Date(),
            isAction: true,
            actionType: 'navigation',
            actionData: action
          };
          setMessages(prev => [...prev, navMessage]);
          
          // Navigate after a short delay
          setTimeout(() => {
            router.push(action.path);
          }, 1500);
        }
      } catch (error) {
        console.error('Action execution error:', error);
        const errorMessage = {
          id: Date.now() + Math.random(),
          role: 'assistant',
          content: `❌ Failed to ${action.description.toLowerCase()}: ${error.message}`,
          timestamp: new Date(),
          isAction: true,
          actionType: 'error'
        };
        setMessages(prev => [...prev, errorMessage]);
      }
    }

    setIsProcessingAction(false);
  };

  // Download report function
  const downloadReport = async (reportType) => {
    try {
      const response = await fetch('/api/reports/download', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          reportType: reportType,
          format: 'csv'
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate report');
      }

      // Get filename from response headers
      const contentDisposition = response.headers.get('content-disposition');
      const filename = contentDisposition
        ? contentDisposition.split('filename=')[1].replace(/"/g, '')
        : `${reportType}-report.csv`;

      // Download the file
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

    } catch (error) {
      console.error('Download error:', error);
      throw error;
    }
  };
  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages])

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return

    const userMessage = {
      id: Date.now(),
      role: 'user',
      content: inputMessage,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: inputMessage,
          context: 'GT Management Dashboard'
        }),
      })

      const data = await response.json()
      
      if (response.ok) {
        const assistantMessage = {
          id: Date.now() + 1,
          role: 'assistant',
          content: data.response,
          timestamp: new Date(),
          source: data.source || 'unknown',
          actions: data.actions || []
        }
        setMessages(prev => [...prev, assistantMessage])
        
        // Execute any actions if present
        if (data.actions && data.actions.length > 0) {
          await executeActions(data.actions);
        }
      } else {
        throw new Error(data.error || 'Failed to get response')
      }
    } catch (error) {
      console.error('Error sending message:', error)
      const errorMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }
  const suggestionPrompts = [
    "Generate sales report",
    "Download inventory report", 
    "Show me expense analytics",
    "Create complete business report"
  ]

  const handleSuggestionClick = (prompt) => {
    setInputMessage(prompt)
  }

  return (
    <div className="w-full h-full flex flex-col">
      <Card className="h-full flex flex-col border-0 shadow-none">
        <CardHeader className="pb-3 border-b flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg">AI Assistant</CardTitle>
              <CardDescription>
                Your business management helper
              </CardDescription>
            </div>
            <Badge variant="secondary" className="ml-auto">
              <Bot className="h-3 w-3 mr-1" />
              Online
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="flex-1 flex flex-col p-4 pt-4 min-h-0">
          <ScrollArea ref={scrollAreaRef} className="flex-1 pr-3 mb-4 h-0">
            <div className="space-y-4 pb-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex items-start gap-3 ${
                    message.role === 'user' ? 'flex-row-reverse' : ''
                  }`}
                >
                  <Avatar className="w-8 h-8 flex-shrink-0">
                    <AvatarFallback className={
                      message.role === 'user' 
                        ? 'bg-blue-100 text-blue-600' 
                        : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                    }>
                      {message.role === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                    </AvatarFallback>
                  </Avatar>
                    <div className={`flex-1 max-w-[80%] ${message.role === 'user' ? 'text-right' : ''}`}>
                    <div
                      className={`inline-block px-3 py-2 rounded-lg text-sm whitespace-pre-wrap ${
                        message.role === 'user'
                          ? 'bg-blue-500 text-white rounded-br-sm'
                          : message.isAction
                          ? message.actionType === 'report_success'
                            ? 'bg-green-100 text-green-900 rounded-bl-sm border border-green-200'
                            : message.actionType === 'error'
                            ? 'bg-red-100 text-red-900 rounded-bl-sm border border-red-200'
                            : 'bg-blue-100 text-blue-900 rounded-bl-sm border border-blue-200'
                          : 'bg-gray-100 text-gray-900 rounded-bl-sm border'
                      }`}
                    >
                      {message.content}
                    </div>
                    
                    {/* Action indicators */}
                    {message.actions && message.actions.length > 0 && (
                      <div className="mt-2 space-y-1">
                        {message.actions.map((action, actionIndex) => (
                          <div key={actionIndex} className="flex items-center gap-2 text-xs text-gray-600">
                            {action.type === 'GENERATE_REPORT' ? (
                              <>
                                <Download className="h-3 w-3" />
                                <span>Preparing {action.description.toLowerCase()}...</span>
                              </>
                            ) : action.type === 'NAVIGATE' ? (
                              <>
                                <ExternalLink className="h-3 w-3" />
                                <span>{action.description}</span>
                              </>
                            ) : null}
                          </div>
                        ))}
                      </div>
                    )}
                    
                    <div className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                      {message.timestamp.toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                      
                      {message.isAction && message.actionType === 'report_success' && (
                        <Badge variant="outline" className="text-xs px-1 py-0 bg-green-50 text-green-700">
                          <CheckCircle className="h-2 w-2 mr-1" />
                          Downloaded
                        </Badge>
                      )}
                      
                      {message.role === 'assistant' && message.source === 'fallback' && (
                        <Badge variant="outline" className="text-xs px-1 py-0">
                          Demo
                        </Badge>
                      )}
                      {message.role === 'assistant' && message.source === 'gemini' && (
                        <Badge variant="outline" className="text-xs px-1 py-0 bg-blue-50 text-blue-700">
                          Gemini
                        </Badge>
                      )}
                      {message.role === 'assistant' && message.source === 'anthropic' && (
                        <Badge variant="outline" className="text-xs px-1 py-0 bg-green-50 text-green-700">
                          Claude
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              ))}
                {(isLoading || isProcessingAction) && (
                <div className="flex items-start gap-3">
                  <Avatar className="w-8 h-8 flex-shrink-0">
                    <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                      <Bot className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="inline-block px-3 py-2 rounded-lg bg-gray-100 border rounded-bl-sm">
                      <div className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span className="text-sm text-gray-600">
                          {isProcessingAction ? 'Processing your request...' : 'Thinking...'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          {messages.length === 1 && (
            <div className="mb-4 flex-shrink-0">
              <p className="text-sm text-gray-600 mb-2">Try asking:</p>
              <div className="flex flex-wrap gap-2">
                {suggestionPrompts.map((prompt, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => handleSuggestionClick(prompt)}
                    className="text-xs"
                  >
                    <MessageSquare className="h-3 w-3 mr-1" />
                    {prompt}
                  </Button>
                ))}
              </div>
            </div>
          )}          <div className="flex gap-2 flex-shrink-0">
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me anything about your business..."
              disabled={isLoading || isProcessingAction}
              className="flex-1"
            />
            <Button 
              onClick={sendMessage} 
              disabled={!inputMessage.trim() || isLoading || isProcessingAction}
              size="icon"
            >
              {isLoading || isProcessingAction ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
