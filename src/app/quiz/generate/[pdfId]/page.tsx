'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { 
  ArrowLeft, 
  Brain, 
  CheckCircle,
  Clock,
  FileText,
  Loader2
} from 'lucide-react'
import { useQuery } from 'react-query'
import toast from 'react-hot-toast'
import Link from 'next/link'

interface PDF {
  id: string
  title: string
  filename: string
}

const QUIZ_TYPES = [
  {
    id: 'MCQ',
    name: 'Multiple Choice Questions',
    description: 'Perfect for testing knowledge and concepts',
    icon: CheckCircle,
    color: 'bg-blue-500',
    count: '5 questions'
  },
  {
    id: 'SAQ',
    name: 'Short Answer Questions',
    description: 'Great for testing understanding and application',
    icon: FileText,
    color: 'bg-green-500',
    count: '3 questions'
  },
  {
    id: 'LAQ',
    name: 'Long Answer Questions',
    description: 'Ideal for deep analysis and comprehensive answers',
    icon: Brain,
    color: 'bg-purple-500',
    count: '2 questions'
  },
  {
    id: 'MIXED',
    name: 'Mixed Quiz',
    description: 'Combination of all question types for comprehensive testing',
    icon: Clock,
    color: 'bg-orange-500',
    count: '6 questions'
  }
]

export default function QuizGeneratePage() {
  const params = useParams()
  const router = useRouter()
  const pdfId = params.pdfId as string
  
  const [selectedType, setSelectedType] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)

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

  const handleGenerateQuiz = async () => {
    if (!selectedType || !pdf) return

    setIsGenerating(true)
    try {
      const response = await fetch('/api/quiz/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          pdfId: pdfId,
          quizType: selectedType,
          title: `${selectedType} Quiz - ${pdf.title}`,
        }),
      })

      if (!response.ok) throw new Error('Failed to generate quiz')

      const result = await response.json()
      toast.success('Quiz generated successfully!')
      
      // Redirect to quiz page
      router.push(`/quiz/${result.quiz.id}`)
      
    } catch (error) {
      console.error('Error generating quiz:', error)
      toast.error('Failed to generate quiz. Please try again.')
    } finally {
      setIsGenerating(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading PDF information...</p>
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
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link
                href="/dashboard"
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-lg font-semibold text-gray-900">
                  Generate Quiz
                </h1>
                <p className="text-sm text-gray-500">
                  From: {pdf.title}
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Brain className="w-8 h-8 text-primary-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Choose Quiz Type
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Select the type of quiz you'd like to generate from your PDF. 
            Our AI will create questions based on the content to help you study effectively.
          </p>
        </motion.div>

        {/* Quiz Type Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {QUIZ_TYPES.map((type, index) => {
            const Icon = type.icon
            return (
              <motion.div
                key={type.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => setSelectedType(type.id)}
                className={`relative cursor-pointer rounded-lg border-2 p-6 transition-all ${
                  selectedType === type.id
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-md'
                }`}
              >
                {selectedType === type.id && (
                  <div className="absolute top-4 right-4">
                    <div className="w-6 h-6 bg-primary-600 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-4 h-4 text-white" />
                    </div>
                  </div>
                )}
                
                <div className="flex items-start space-x-4">
                  <div className={`w-12 h-12 ${type.color} rounded-lg flex items-center justify-center flex-shrink-0`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {type.name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">
                      {type.description}
                    </p>
                    <span className="inline-block px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                      {type.count}
                    </span>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Generate Button */}
        <div className="text-center">
          <button
            onClick={handleGenerateQuiz}
            disabled={!selectedType || isGenerating}
            className={`inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white transition-colors ${
              selectedType && !isGenerating
                ? 'bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500'
                : 'bg-gray-400 cursor-not-allowed'
            }`}
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Generating Quiz...
              </>
            ) : (
              <>
                <Brain className="w-5 h-5 mr-2" />
                Generate Quiz
              </>
            )}
          </button>
          
          {selectedType && (
            <p className="text-sm text-gray-500 mt-3">
              This will generate a {QUIZ_TYPES.find(t => t.id === selectedType)?.name.toLowerCase()} 
              {' '}from your PDF using AI.
            </p>
          )}
        </div>
      </main>
    </div>
  )
}


