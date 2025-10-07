import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  try {
    // For demo purposes, use mock user ID
    const mockUserId = 'demo-user-1'

    const quizzes = await prisma.quiz.findMany({
      where: {
        userId: mockUserId,
      },
      include: {
        pdf: {
          select: {
            title: true,
          },
        },
        attempts: {
          orderBy: {
            completedAt: 'desc',
          },
          select: {
            id: true,
            score: true,
            completedAt: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 10,
    })

    // Transform the data
    const transformedQuizzes = quizzes.map(quiz => {
      const questions = JSON.parse(quiz.questions)
      return {
        id: quiz.id,
        title: quiz.title,
        type: quiz.type,
        totalQuestions: questions.length,
        createdAt: quiz.createdAt.toISOString(),
        attempts: quiz.attempts,
        pdf: quiz.pdf,
      }
    })

    return NextResponse.json(transformedQuizzes)

  } catch (error) {
    console.error('Error fetching recent quizzes:', error)
    return NextResponse.json(
      { error: 'Failed to fetch recent quizzes' },
      { status: 500 }
    )
  }
}
