'use client'

import { motion } from 'framer-motion'
import { 
  TrendingUp, 
  Target, 
  Award, 
  BookOpen, 
  Brain,
  CheckCircle,
  XCircle,
  Clock
} from 'lucide-react'
import { useQuery } from 'react-query'

interface ProgressData {
  totalQuizzes: number
  completedQuizzes: number
  averageScore: number
  totalStudyTime: number
  strengths: string[]
  weaknesses: string[]
  recentActivity: {
    id: string
    type: 'quiz' | 'chat' | 'upload'
    title: string
    score?: number
    timestamp: string
  }[]
}

export function ProgressDashboard() {
  const { data: progress, isLoading } = useQuery<ProgressData>(
    'progress',
    async () => {
      const response = await fetch('/api/progress')
      if (!response.ok) throw new Error('Failed to fetch progress')
      return response.json()
    }
  )

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow-sm border p-6 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-2" />
              <div className="h-8 bg-gray-200 rounded w-1/3" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  const completionRate = progress ? (progress.completedQuizzes / Math.max(progress.totalQuizzes, 1)) * 100 : 0

  const stats = [
    {
      title: 'Total Quizzes',
      value: progress?.totalQuizzes || 0,
      icon: Brain,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      title: 'Average Score',
      value: `${Math.round(progress?.averageScore || 0)}%`,
      icon: Target,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      title: 'Completion Rate',
      value: `${Math.round(completionRate)}%`,
      icon: CheckCircle,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      title: 'Study Time',
      value: `${Math.round((progress?.totalStudyTime || 0) / 60)}h`,
      icon: Clock,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    }
  ]

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-lg shadow-sm border p-6"
            >
              <div className="flex items-center">
                <div className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Progress Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Learning Progress */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-lg shadow-sm border p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-primary-600" />
            Learning Progress
          </h3>
          
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Quiz Completion</span>
                <span className="text-gray-900 font-medium">
                  {progress?.completedQuizzes || 0} / {progress?.totalQuizzes || 0}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-primary-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${completionRate}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Average Score</span>
                <span className="text-gray-900 font-medium">
                  {Math.round(progress?.averageScore || 0)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${progress?.averageScore || 0}%` }}
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Strengths & Weaknesses */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-lg shadow-sm border p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Award className="w-5 h-5 mr-2 text-primary-600" />
            Learning Analysis
          </h3>
          
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium text-green-700 mb-2 flex items-center">
                <CheckCircle className="w-4 h-4 mr-1" />
                Strengths
              </h4>
              <div className="space-y-1">
                {progress?.strengths && progress.strengths.length > 0 ? (
                  progress.strengths.map((strength, index) => (
                    <span
                      key={index}
                      className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full mr-1 mb-1"
                    >
                      {strength}
                    </span>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">Complete more quizzes to identify strengths</p>
                )}
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium text-red-700 mb-2 flex items-center">
                <XCircle className="w-4 h-4 mr-1" />
                Areas to Improve
              </h4>
              <div className="space-y-1">
                {progress?.weaknesses && progress.weaknesses.length > 0 ? (
                  progress.weaknesses.map((weakness, index) => (
                    <span
                      key={index}
                      className="inline-block bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full mr-1 mb-1"
                    >
                      {weakness}
                    </span>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">Complete more quizzes to identify areas for improvement</p>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-lg shadow-sm border p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <BookOpen className="w-5 h-5 mr-2 text-primary-600" />
          Recent Activity
        </h3>
        
        <div className="space-y-3">
          {progress?.recentActivity && progress.recentActivity.length > 0 ? (
            progress.recentActivity.map((activity, index) => (
              <div key={activity.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    activity.type === 'quiz' ? 'bg-blue-100' :
                    activity.type === 'chat' ? 'bg-green-100' : 'bg-purple-100'
                  }`}>
                    {activity.type === 'quiz' ? (
                      <Brain className="w-4 h-4 text-blue-600" />
                    ) : activity.type === 'chat' ? (
                      <BookOpen className="w-4 h-4 text-green-600" />
                    ) : (
                      <Award className="w-4 h-4 text-purple-600" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(activity.timestamp).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                {activity.score && (
                  <span className="text-sm font-medium text-gray-900">
                    {activity.score}%
                  </span>
                )}
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500 text-center py-4">
              No recent activity. Start by uploading a PDF or taking a quiz!
            </p>
          )}
        </div>
      </motion.div>
    </div>
  )
}

