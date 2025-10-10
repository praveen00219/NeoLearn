import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const quizId = params.id

    const quiz = await prisma.quiz.findUnique({
      where: { id: quizId },
      include: {
        pdf: {
          select: {
            title: true,
          },
        },
      },
    })

    if (!quiz) {
      return NextResponse.json(
        { error: 'Quiz not found' },
        { status: 404 }
      )
    }

    // Parse questions from JSON string
    const questions = JSON.parse(quiz.questions)

    return NextResponse.json({
      id: quiz.id,
      title: quiz.title,
      type: quiz.type,
      questions: questions,
      totalQuestions: questions.length,
      pdf: quiz.pdf,
    })

  } catch (error) {
    console.error('Error fetching quiz:', error)
    return NextResponse.json(
      { error: 'Failed to fetch quiz' },
      { status: 500 }
    )
  }
}


