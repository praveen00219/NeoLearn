import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const quizId = params.id

    // For demo purposes, use mock user ID
    const mockUserId = 'demo-user-1'

    // Get the most recent attempt for this quiz
    const attempt = await prisma.quizAttempt.findFirst({
      where: {
        quizId: quizId,
        userId: mockUserId,
      },
      orderBy: {
        completedAt: 'desc',
      },
    })

    if (!attempt) {
      return NextResponse.json(
        { error: 'No quiz attempts found' },
        { status: 404 }
      )
    }

    // Get quiz details to reconstruct the results
    const quiz = await prisma.quiz.findUnique({
      where: { id: quizId },
    })

    if (!quiz) {
      return NextResponse.json(
        { error: 'Quiz not found' },
        { status: 404 }
      )
    }

    const questions = JSON.parse(quiz.questions)
    const answers = JSON.parse(quiz.answers || '[]')
    const userAnswers = JSON.parse(attempt.userAnswers)

    // Create detailed results
    const detailedResults = questions.map((question: any) => {
      const userAnswer = userAnswers[question.id]
      const correctAnswer = answers.find((a: any) => a.id === question.id)
      const isCorrect = userAnswer === correctAnswer?.correctAnswer

      return {
        questionId: question.id,
        userAnswer: userAnswer || '',
        correctAnswer: correctAnswer?.correctAnswer || '',
        isCorrect: isCorrect,
        explanation: correctAnswer?.explanation || ''
      }
    })

    return NextResponse.json({
      id: attempt.id,
      score: attempt.score,
      totalQuestions: attempt.totalQuestions,
      correctCount: Math.round((attempt.score / 100) * attempt.totalQuestions),
      completedAt: attempt.completedAt.toISOString(),
      detailedResults: detailedResults,
    })

  } catch (error) {
    console.error('Error fetching quiz results:', error)
    return NextResponse.json(
      { error: 'Failed to fetch quiz results' },
      { status: 500 }
    )
  }
}
