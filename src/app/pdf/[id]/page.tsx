'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { 
  ArrowLeft, 
  MessageSquare, 
  Brain, 
  Download,
  Share,
  Eye,
  EyeOff
} from 'lucide-react'
import { PDFViewer } from '@/components/PDFViewer'
import { ChatInterface } from '@/components/ChatInterface'
import { useQuery } from 'react-query'
import Link from 'next/link'

interface PDF {
  id: string
  title: string
  filename: string
  fileSize: number
  uploadDate: string
}

export default function PDFPage() {
  const params = useParams()
  const pdfId = params.id as string
  
  const [showChat, setShowChat] = useState(true)
  const [chatId, setChatId] = useState<string | null>(null)

  const { data: pdf, isLoading } = useQuery<PDF>(
    ['pdf', pdfId],
    async () => {
      const response = await fetch(`/api/pdf/${pdfId}`)
      if (!response.ok) throw new Error('Failed to fetch PDF')
      return response.json()
    },
    {
      enabled: !!pdfId
    }
  )

  const handleStartChat = async () => {
    if (chatId) {
      setShowChat(true)
      return
    }

    try {
      const response = await fetch('/api/chat/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: `Chat about ${pdf?.title}`,
          pdfId: pdfId,
        }),
      })

      if (!response.ok) throw new Error('Failed to create chat')

      const result = await response.json()
      setChatId(result.chat.id)
      setShowChat(true)
    } catch (error) {
      console.error('Error creating chat:', error)
    }
  }

  const handleGenerateQuiz = () => {
    window.open(`/quiz/generate/${pdfId}`, '_blank')
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading PDF...</p>
        </div>
      </div>
    )
  }

  if (!pdf) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">PDF Not Found</h1>
          <p className="text-gray-600 mb-6">The requested PDF could not be found.</p>
          <Link
            href="/dashboard"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link
                href="/dashboard"
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-lg font-semibold text-gray-900 truncate max-w-md">
                  {pdf.title}
                </h1>
                <p className="text-sm text-gray-500">
                  {pdf.filename}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowChat(!showChat)}
                className={`inline-flex items-center px-3 py-2 border text-sm font-medium rounded-md transition-colors ${
                  showChat
                    ? 'border-primary-300 text-primary-700 bg-primary-50'
                    : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'
                }`}
              >
                {showChat ? (
                  <>
                    <EyeOff className="w-4 h-4 mr-2" />
                    Hide Chat
                  </>
                ) : (
                  <>
                    <Eye className="w-4 h-4 mr-2" />
                    Show Chat
                  </>
                )}
              </button>

              <button
                onClick={handleStartChat}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                Chat
              </button>

              <button
                onClick={handleGenerateQuiz}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                <Brain className="w-4 h-4 mr-2" />
                Generate Quiz
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex h-[calc(100vh-4rem)]">
        {/* PDF Viewer */}
        <div className={`transition-all duration-300 ${showChat ? 'w-1/2' : 'w-full'}`}>
          <PDFViewer pdfId={pdfId} />
        </div>

        {/* Chat Interface */}
        {showChat && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            className="w-1/2 border-l border-gray-200 bg-white"
          >
            <ChatInterface 
              chatId={chatId}
              onChatCreated={setChatId}
              pdfId={pdfId}
              pdfTitle={pdf.title}
            />
          </motion.div>
        )}
      </div>
    </div>
  )
}


