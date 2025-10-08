'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Send, 
  Bot, 
  User, 
  Plus,
  MessageSquare,
  Loader2
} from 'lucide-react'
import { useQuery } from 'react-query'
import toast from 'react-hot-toast'

interface ChatMessage {
  id: string
  content: string
  role: 'USER' | 'ASSISTANT' | 'SYSTEM'
  createdAt: string
}

interface ChatInterfaceProps {
  chatId: string | null
  onChatCreated: (chatId: string) => void
  pdfId: string
  pdfTitle: string
}

export function ChatInterface({ chatId, onChatCreated, pdfId, pdfTitle }: ChatInterfaceProps) {
  const [message, setMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Fetch chat messages
  const { data: messages = [], refetch } = useQuery<ChatMessage[]>(
    ['chat-messages', chatId],
    async () => {
      if (!chatId) return []
      
      const response = await fetch(`/api/chat/${chatId}/messages`)
      if (!response.ok) throw new Error('Failed to fetch messages')
      return response.json()
    },
    {
      enabled: !!chatId,
      refetchInterval: 2000, // Poll for new messages
    }
  )

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!message.trim() || isLoading) return

    const userMessage = message.trim()
    setMessage('')
    setIsLoading(true)

    try {
      // If no chat exists, create one first
      let currentChatId = chatId
      if (!currentChatId) {
        const chatResponse = await fetch('/api/chat/create', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            title: `Chat about ${pdfTitle}`,
            pdfId: pdfId,
          }),
        })

        if (!chatResponse.ok) throw new Error('Failed to create chat')

        const chatResult = await chatResponse.json()
        currentChatId = chatResult.chat.id
        onChatCreated(currentChatId)
      }

      // Send message
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage,
          chatId: currentChatId,
          pdfId: pdfId,
        }),
      })

      if (!response.ok) throw new Error('Failed to send message')

      // Refetch messages to get the new ones
      await refetch()

    } catch (error) {
      console.error('Error sending message:', error)
      toast.error('Failed to send message. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleNewChat = async () => {
    try {
      const response = await fetch('/api/chat/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: `New Chat about ${pdfTitle}`,
          pdfId: pdfId,
        }),
      })

      if (!response.ok) throw new Error('Failed to create new chat')

      const result = await response.json()
      onChatCreated(result.chat.id)
      toast.success('New chat started!')
    } catch (error) {
      console.error('Error creating new chat:', error)
      toast.error('Failed to create new chat')
    }
  }

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Chat Header */}
      <div className="border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <MessageSquare className="w-5 h-5 text-primary-600" />
            <h3 className="text-sm font-medium text-gray-900">AI Assistant</h3>
          </div>
          <button
            onClick={handleNewChat}
            className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
            title="Start new chat"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          Ask questions about: {pdfTitle}
        </p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        <AnimatePresence>
          {messages.map((msg, index) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`flex ${msg.role === 'USER' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`flex items-start space-x-2 max-w-xs lg:max-w-md ${
                  msg.role === 'USER' ? 'flex-row-reverse space-x-reverse' : ''
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    msg.role === 'USER'
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {msg.role === 'USER' ? (
                    <User className="w-4 h-4" />
                  ) : (
                    <Bot className="w-4 h-4" />
                  )}
                </div>
                
                <div
                  className={`px-3 py-2 rounded-lg ${
                    msg.role === 'USER'
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                  <p
                    className={`text-xs mt-1 ${
                      msg.role === 'USER' ? 'text-primary-200' : 'text-gray-500'
                    }`}
                  >
                    {new Date(msg.createdAt).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Loading indicator */}
        {isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-start"
          >
            <div className="flex items-start space-x-2 max-w-xs lg:max-w-md">
              <div className="w-8 h-8 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center flex-shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <div className="px-3 py-2 rounded-lg bg-gray-100">
                <div className="flex items-center space-x-1">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-sm text-gray-600">Thinking...</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="border-t border-gray-200 px-4 py-3">
        <form onSubmit={handleSendMessage} className="flex space-x-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Ask a question about the PDF..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!message.trim() || isLoading}
            className="px-3 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
        
        <p className="text-xs text-gray-500 mt-2">
          The AI can answer questions based on the PDF content and provide citations.
        </p>
      </div>
    </div>
  )
}
