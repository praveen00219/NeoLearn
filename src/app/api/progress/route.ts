import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  try {
    // For demo purposes, use mock user ID
    const mockUserId = 'demo-user-1'

    // Get user's quiz attempts
    const quizAttempts = await prisma.quizAttempt.findMany({
      where: {
        userId: mockUserId,
      },
      include: {
        quiz: {
          include: {
            pdf: true,
          },
        },
      },
      orderBy: {
        completedAt: 'desc',
      },
    })

    // Calculate statistics
    const totalQuizzes = await prisma.quiz.count({
      where: {
        userId: mockUserId,
      },
    })

    const completedQuizzes = quizAttempts.length
    const averageScore = completedQuizzes > 0 
      ? quizAttempts.reduce((sum, attempt) => sum + attempt.score, 0) / completedQuizzes
      : 0

    // Mock data for demo
    const mockProgress = {
      totalQuizzes,
      completedQuizzes,
      averageScore,
      totalStudyTime: completedQuizzes * 15, // 15 minutes per quiz
      strengths: ['Physics Fundamentals', 'Mathematical Concepts'],
      weaknesses: ['Advanced Mechanics', 'Thermodynamics'],
      recentActivity: quizAttempts.slice(0, 5).map(attempt => ({
        id: attempt.id,
        type: 'quiz' as const,
        title: attempt.quiz.title,
        score: attempt.score,
        timestamp: attempt.completedAt.toISOString(),
      })),
    }

    return NextResponse.json(mockProgress)

  } catch (error) {
    console.error('Error fetching progress:', error)
    return NextResponse.json(
      { error: 'Failed to fetch progress' },
      { status: 500 }
    )
  }
}
