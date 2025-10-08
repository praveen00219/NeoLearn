'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { 
  ArrowLeft, 
  CheckCircle, 
  XCircle, 
  RotateCcw,
  BarChart3,
  Trophy,
  Brain,
  BookOpen,
  Download,
  Share
} from 'lucide-react'
import { useQuery } from 'react-query'
import Link from 'next/link'

interface QuizResult {
  id: string
  score: number
  totalQuestions: number
  correctCount: number
  completedAt: string
  detailedResults: Array<{
    questionId: string
    userAnswer: string
    correctAnswer: string
    isCorrect: boolean
    explanation: string
  }>
}

interface Quiz {
  id: string
  title: string
  type: string
  questions: Array<{
    id: string
    question: string
    type?: string
    options?: { [key: string]: string }
    correctAnswer?: string
    explanation?: string
    difficulty?: string
  }>
  pdf: {
    title: string
  }
}

export default function QuizResultsPage() {
  const params = useParams()
  const quizId = params.id as string
  
  const [selectedQuestionIndex, setSelectedQuestionIndex] = useState(0)

  const { data: quiz, isLoading: quizLoading } = useQuery<Quiz>(
    ['quiz', quizId],
    async () => {
      const response = await fetch(`/api/quiz/${quizId}`)
      if (!response.ok) throw new Error('Failed to fetch quiz')
      return response.json()
    },
    {
      enabled: !!quizId
    }
  )

  const { data: results, isLoading: resultsLoading } = useQuery<QuizResult>(
    ['quiz-results', quizId],
    async () => {
      const response = await fetch(`/api/quiz/${quizId}/results`)
      if (!response.ok) throw new Error('Failed to fetch results')
      return response.json()
    },
    {
      enabled: !!quizId
    }
  )

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-100'
    if (score >= 60) return 'text-yellow-600 bg-yellow-100'
    return 'text-red-600 bg-red-100'
  }

  const getScoreMessage = (score: number) => {
    if (score >= 90) return 'Excellent work! You have a strong understanding of the material.'
    if (score >= 80) return 'Great job! You understand the concepts well.'
    if (score >= 60) return 'Good effort! Consider reviewing the material to improve.'
    return 'Keep studying! Review the explanations to better understand the concepts.'
  }

  if (quizLoading || resultsLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading results...</p>
        </div>
      </div>
    )
  }

  if (!quiz || !results) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Results Not Found</h1>
          <p className="text-gray-600 mb-6">The quiz results could not be found.</p>
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

  const selectedQuestion = quiz.questions[selectedQuestionIndex]
  const selectedResult = results.detailedResults[selectedQuestionIndex]

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
                <h1 className="text-lg font-semibold text-gray-900">
                  Quiz Results
                </h1>
                <p className="text-sm text-gray-500">
                  {quiz.title} • {quiz.pdf.title}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button className="p-2 text-gray-400 hover:text-gray-600">
                <Share className="w-5 h-5" />
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-600">
                <Download className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Results Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
              <div className="text-center">
                <div className={`w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center ${getScoreColor(results.score)}`}>
                  <Trophy className="w-10 h-10" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  {results.score}%
                </h2>
                <p className="text-gray-600 mb-4">
                  {results.correctCount} out of {results.totalQuestions} correct
                </p>
                <p className="text-sm text-gray-500 mb-6">
                  {getScoreMessage(results.score)}
                </p>
                
                <div className="space-y-2">
                  <Link
                    href={`/quiz/${quizId}`}
                    className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Retake Quiz
                  </Link>
                  <Link
                    href="/dashboard"
                    className="w-full inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                  >
                    Back to Dashboard
                  </Link>
                </div>
              </div>
            </div>

            {/* Performance Stats */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <BarChart3 className="w-5 h-5 mr-2 text-primary-600" />
                Performance
              </h3>
              
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Accuracy</span>
                    <span className="text-gray-900 font-medium">{results.score}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-500 ${
                        results.score >= 80 ? 'bg-green-500' :
                        results.score >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${results.score}%` }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="p-3 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      {results.correctCount}
                    </div>
                    <div className="text-sm text-green-700">Correct</div>
                  </div>
                  <div className="p-3 bg-red-50 rounded-lg">
                    <div className="text-2xl font-bold text-red-600">
                      {results.totalQuestions - results.correctCount}
                    </div>
                    <div className="text-sm text-red-700">Incorrect</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Question Review */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Question Review
              </h3>
              
              {/* Question Navigation */}
              <div className="grid grid-cols-10 gap-2 mb-6">
                {quiz.questions.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedQuestionIndex(index)}
                    className={`w-8 h-8 rounded-md text-sm font-medium transition-colors ${
                      index === selectedQuestionIndex
                        ? 'bg-primary-600 text-white'
                        : results.detailedResults[index].isCorrect
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>

              {/* Selected Question */}
              <div className="border-t pt-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-medium text-gray-900">
                    Question {selectedQuestionIndex + 1}
                  </h4>
                  <div className="flex items-center space-x-2">
                    {selectedResult.isCorrect ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-600" />
                    )}
                    <span className={`text-sm font-medium ${
                      selectedResult.isCorrect ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {selectedResult.isCorrect ? 'Correct' : 'Incorrect'}
                    </span>
                  </div>
                </div>

                <div className="mb-6">
                  <p className="text-gray-900 mb-4">{selectedQuestion.question}</p>
                  
                  {selectedQuestion.options && (
                    <div className="space-y-2">
                      {Object.entries(selectedQuestion.options).map(([key, option]) => (
                        <div
                          key={key}
                          className={`p-3 rounded-lg border-2 ${
                            key === selectedResult.correctAnswer
                              ? 'border-green-500 bg-green-50'
                              : key === selectedResult.userAnswer && !selectedResult.isCorrect
                              ? 'border-red-500 bg-red-50'
                              : 'border-gray-200'
                          }`}
                        >
                          <span className="font-medium">{key}. {option}</span>
                          {key === selectedResult.correctAnswer && (
                            <span className="ml-2 text-green-600 text-sm">✓ Correct Answer</span>
                          )}
                          {key === selectedResult.userAnswer && !selectedResult.isCorrect && (
                            <span className="ml-2 text-red-600 text-sm">✗ Your Answer</span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {!selectedQuestion.options && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Your Answer:
                        </label>
                        <div className="p-3 bg-gray-50 rounded-lg border">
                          {selectedResult.userAnswer || 'No answer provided'}
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Correct Answer:
                        </label>
                        <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                          {selectedResult.correctAnswer}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Explanation */}
                {selectedResult.explanation && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h5 className="font-medium text-blue-900 mb-2 flex items-center">
                      <Brain className="w-4 h-4 mr-2" />
                      Explanation
                    </h5>
                    <p className="text-blue-800">{selectedResult.explanation}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
