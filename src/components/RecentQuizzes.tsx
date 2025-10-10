'use client'

import { motion } from 'framer-motion'
import { 
  Brain, 
  Calendar, 
  Target, 
  Play,
  Eye,
  TrendingUp,
  Clock
} from 'lucide-react'
import { useQuery } from 'react-query'

interface Quiz {
  id: string
  title: string
  type: 'MCQ' | 'SAQ' | 'LAQ' | 'MIXED'
  totalQuestions: number
  createdAt: string
  attempts: {
    id: string
    score: number
    completedAt: string
  }[]
  pdf: {
    title: string
  }
}

export function RecentQuizzes() {
  const { data: quizzes, isLoading } = useQuery<Quiz[]>(
    'recent-quizzes',
    async () => {
      const response = await fetch('/api/quiz/recent')
      if (!response.ok) throw new Error('Failed to fetch quizzes')
      return response.json()
    }
  )

  const getQuizTypeColor = (type: string) => {
    switch (type) {
      case 'MCQ': return 'bg-blue-100 text-blue-800'
      case 'SAQ': return 'bg-green-100 text-green-800'
      case 'LAQ': return 'bg-purple-100 text-purple-800'
      case 'MIXED': return 'bg-orange-100 text-orange-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const handleTakeQuiz = (quizId: string) => {
    window.open(`/quiz/${quizId}`, '_blank')
  }

  const handleViewResults = (quizId: string) => {
    window.open(`/quiz/${quizId}/results`, '_blank')
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

  if (!quizzes || quizzes.length === 0) {
    return (
      <div className="text-center py-12">
        <Brain className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No quizzes created yet
        </h3>
        <p className="text-gray-500 mb-6">
          Generate your first quiz from a PDF to start practicing.
        </p>
        <div className="space-y-2 text-sm text-gray-500">
          <p>• Upload a PDF and generate MCQs, SAQs, or LAQs</p>
          <p>• Track your progress and identify weak areas</p>
          <p>• Get detailed explanations for better understanding</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {quizzes.map((quiz, index) => {
        const bestScore = Math.max(...quiz.attempts.map(a => a.score), 0)
        const latestAttempt = quiz.attempts[0]
        
        return (
          <motion.div
            key={quiz.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow"
          >
            <div className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4 flex-1">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Brain className="w-6 h-6 text-blue-600" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="text-lg font-medium text-gray-900 truncate">
                        {quiz.title}
                      </h3>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getQuizTypeColor(quiz.type)}`}>
                        {quiz.type}
                      </span>
                    </div>
                    
                    <p className="text-sm text-gray-500 mb-2">
                      From: {quiz.pdf.title}
                    </p>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Target className="w-4 h-4" />
                        <span>{quiz.totalQuestions} questions</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(quiz.createdAt)}</span>
                      </div>
                      {quiz.attempts.length > 0 && (
                        <div className="flex items-center space-x-1">
                          <TrendingUp className="w-4 h-4" />
                          <span className={getScoreColor(bestScore)}>
                            Best: {bestScore}%
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2 ml-4">
                  {quiz.attempts.length === 0 ? (
                    <button
                      onClick={() => handleTakeQuiz(quiz.id)}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Take Quiz
                    </button>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleTakeQuiz(quiz.id)}
                        className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                      >
                        <Play className="w-4 h-4 mr-1" />
                        Retake
                      </button>
                      
                      <button
                        onClick={() => handleViewResults(quiz.id)}
                        className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        Results
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Attempt History */}
              {quiz.attempts.length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Recent Attempts</h4>
                  <div className="space-y-2">
                    {quiz.attempts.slice(0, 3).map((attempt) => (
                      <div key={attempt.id} className="flex items-center justify-between text-sm">
                        <div className="flex items-center space-x-2">
                          <Clock className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-600">
                            {formatDate(attempt.completedAt)}
                          </span>
                        </div>
                        <span className={`font-medium ${getScoreColor(attempt.score)}`}>
                          {attempt.score}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}

