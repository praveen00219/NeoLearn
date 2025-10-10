'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  FileText, 
  Calendar, 
  HardDrive, 
  Eye, 
  MessageSquare, 
  Brain,
  MoreVertical,
  Trash2
} from 'lucide-react'
import { useQuery } from 'react-query'
import toast from 'react-hot-toast'

interface PDF {
  id: string
  title: string
  filename: string
  fileSize: number
  uploadDate: string
}

export function PDFList() {
  const [selectedPDF, setSelectedPDF] = useState<string | null>(null)

  const { data: pdfs, isLoading, error } = useQuery<PDF[]>(
    'pdfs',
    async () => {
      const response = await fetch('/api/pdf/list')
      if (!response.ok) throw new Error('Failed to fetch PDFs')
      return response.json()
    }
  )

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const handleViewPDF = (pdfId: string) => {
    window.open(`/pdf/${pdfId}`, '_blank')
  }

  const handleStartChat = (pdfId: string) => {
    window.open(`/chat/${pdfId}`, '_blank')
  }

  const handleGenerateQuiz = (pdfId: string) => {
    window.open(`/quiz/generate/${pdfId}`, '_blank')
  }

  const handleDeletePDF = async (pdfId: string) => {
    if (!confirm('Are you sure you want to delete this PDF?')) return

    try {
      const response = await fetch(`/api/pdf/${pdfId}`, {
        method: 'DELETE'
      })

      if (!response.ok) throw new Error('Failed to delete PDF')

      toast.success('PDF deleted successfully')
      // Refetch the list
      window.location.reload()
    } catch (error) {
      console.error('Delete error:', error)
      toast.error('Failed to delete PDF')
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow-sm border p-6 animate-pulse">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gray-200 rounded-lg" />
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-1/3 mb-2" />
                <div className="h-3 bg-gray-200 rounded w-1/4" />
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Failed to load PDFs
        </h3>
        <p className="text-gray-500 mb-4">
          There was an error loading your PDFs. Please try again.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
        >
          Retry
        </button>
      </div>
    )
  }

  if (!pdfs || pdfs.length === 0) {
    return (
      <div className="text-center py-12">
        <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No PDFs uploaded yet
        </h3>
        <p className="text-gray-500 mb-6">
          Upload your first PDF to get started with AI-powered learning.
        </p>
        <div className="space-y-2 text-sm text-gray-500">
          <p>• Upload NCERT Class XI Physics PDFs for testing</p>
          <p>• Generate quizzes from your coursebooks</p>
          <p>• Chat with AI about your study materials</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {pdfs.map((pdf, index) => (
        <motion.div
          key={pdf.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow"
        >
          <div className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4 flex-1">
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FileText className="w-6 h-6 text-red-600" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-medium text-gray-900 truncate">
                    {pdf.title}
                  </h3>
                  <p className="text-sm text-gray-500 truncate">
                    {pdf.filename}
                  </p>
                  
                  <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(pdf.uploadDate)}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <HardDrive className="w-4 h-4" />
                      <span>{formatFileSize(pdf.fileSize)}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2 ml-4">
                <button
                  onClick={() => handleViewPDF(pdf.id)}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  <Eye className="w-4 h-4 mr-1" />
                  View
                </button>
                
                <button
                  onClick={() => handleStartChat(pdf.id)}
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  <MessageSquare className="w-4 h-4 mr-1" />
                  Chat
                </button>
                
                <button
                  onClick={() => handleGenerateQuiz(pdf.id)}
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  <Brain className="w-4 h-4 mr-1" />
                  Quiz
                </button>

                <div className="relative">
                  <button
                    onClick={() => setSelectedPDF(selectedPDF === pdf.id ? null : pdf.id)}
                    className="p-2 text-gray-400 hover:text-gray-600 rounded-md hover:bg-gray-100"
                  >
                    <MoreVertical className="w-4 h-4" />
                  </button>
                  
                  {selectedPDF === pdf.id && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border">
                      <div className="py-1">
                        <button
                          onClick={() => handleDeletePDF(pdf.id)}
                          className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete PDF
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  )
}

