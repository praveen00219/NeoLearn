import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    const { quizId, userAnswers } = await request.json()

    if (!quizId || !userAnswers) {
      return NextResponse.json(
        { error: 'Quiz ID and user answers are required' },
        { status: 400 }
      )
    }

    // Get quiz with correct answers
    const quiz = await prisma.quiz.findUnique({
      where: { id: quizId },
      include: {
        attempts: true
      }
    })

    if (!quiz) {
      return NextResponse.json(
        { error: 'Quiz not found' },
        { status: 404 }
      )
    }

    // Parse correct answers
    const correctAnswers = JSON.parse(quiz.answers || '[]')
    const questions = JSON.parse(quiz.questions)

    // Calculate score
    let correctCount = 0
    const totalQuestions = questions.length

    const detailedResults = questions.map((question: any, index: number) => {
      const userAnswer = userAnswers[question.id]
      const correctAnswer = correctAnswers.find((ca: any) => ca.id === question.id)
      const isCorrect = userAnswer === correctAnswer?.correctAnswer
      
      if (isCorrect) {
        correctCount++
      }

      return {
        questionId: question.id,
        userAnswer,
        correctAnswer: correctAnswer?.correctAnswer,
        isCorrect,
        explanation: correctAnswer?.explanation || ''
      }
    })

    const score = Math.round((correctCount / totalQuestions) * 100)

    // For demo purposes, use mock user ID
    const mockUserId = 'demo-user-1'

    // Save quiz attempt
    const attempt = await prisma.quizAttempt.create({
      data: {
        userAnswers: JSON.stringify(userAnswers),
        score: score,
        totalQuestions: totalQuestions,
        quizId: quizId,
        userId: mockUserId,
      }
    })

    return NextResponse.json({
      success: true,
      attempt: {
        id: attempt.id,
        score: score,
        totalQuestions: totalQuestions,
        correctCount: correctCount,
        completedAt: attempt.completedAt,
        detailedResults: detailedResults
      }
    })

  } catch (error) {
    console.error('Quiz attempt error:', error)
    return NextResponse.json(
      { error: 'Failed to submit quiz attempt' },
      { status: 500 }
    )
  }
}


