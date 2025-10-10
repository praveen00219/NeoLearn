'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  BookOpen, 
  FileText, 
  MessageSquare, 
  BarChart3, 
  Upload,
  Plus,
  Brain
} from 'lucide-react'
import { PDFUploader } from '@/components/PDFUploader'
import { PDFList } from '@/components/PDFList'
import { ProgressDashboard } from '@/components/ProgressDashboard'
import { RecentQuizzes } from '@/components/RecentQuizzes'

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<'pdfs' | 'progress' | 'quizzes'>('pdfs')
  const [showUploader, setShowUploader] = useState(false)

  const tabs = [
    { id: 'pdfs', label: 'My PDFs', icon: FileText },
    { id: 'progress', label: 'Progress', icon: BarChart3 },
    { id: 'quizzes', label: 'Recent Quizzes', icon: Brain },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-semibold text-gray-900">BeyondChats</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowUploader(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload PDF
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome to BeyondChats
          </h2>
          <p className="text-gray-600 text-lg">
            Your AI-powered learning companion. Upload PDFs, generate quizzes, and track your progress.
          </p>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        >
          <div className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Upload PDFs</h3>
                <p className="text-sm text-gray-500">Add your coursebooks</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Brain className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Generate Quiz</h3>
                <p className="text-sm text-gray-500">Create practice questions</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Chat Assistant</h3>
                <p className="text-sm text-gray-500">Ask questions about your PDFs</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Tab Navigation */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                    activeTab === tab.id
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              )
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'pdfs' && <PDFList />}
          {activeTab === 'progress' && <ProgressDashboard />}
          {activeTab === 'quizzes' && <RecentQuizzes />}
        </motion.div>
      </main>

      {/* PDF Uploader Modal */}
      {showUploader && (
        <PDFUploader
          isOpen={showUploader}
          onClose={() => setShowUploader(false)}
        />
      )}
    </div>
  )
}

