import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { openai, QUIZ_PROMPTS } from '@/lib/openai'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    const { pdfId, quizType, title } = await request.json()

    if (!pdfId || !quizType) {
      return NextResponse.json(
        { error: 'PDF ID and quiz type are required' },
        { status: 400 }
      )
    }

    // Get PDF information
    const pdf = await prisma.pDF.findUnique({
      where: { id: pdfId },
      include: {
        chunks: {
          orderBy: { pageNumber: 'asc' }
        }
      }
    })

    if (!pdf) {
      return NextResponse.json(
        { error: 'PDF not found' },
        { status: 404 }
      )
    }

    // Combine PDF chunks for content
    const content = pdf.chunks.map(chunk => 
      `Page ${chunk.pageNumber}: ${chunk.content}`
    ).join('\n\n')

    if (!content.trim()) {
      return NextResponse.json(
        { error: 'PDF content not available for quiz generation' },
        { status: 400 }
      )
    }

    // Get appropriate prompt for quiz type
    const prompt = QUIZ_PROMPTS[quizType as keyof typeof QUIZ_PROMPTS]
    if (!prompt) {
      return NextResponse.json(
        { error: 'Invalid quiz type' },
        { status: 400 }
      )
    }

    // Generate quiz using OpenAI
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: prompt
        },
        {
          role: "user",
          content: `Please generate a ${quizType} quiz from the following PDF content:\n\n${content}`
        }
      ],
      temperature: 0.7,
      max_tokens: 2000,
    })

    const response = completion.choices[0]?.message?.content
    if (!response) {
      throw new Error('No response from OpenAI')
    }

    // Parse the JSON response
    let quizData
    try {
      quizData = JSON.parse(response)
    } catch (error) {
      console.error('Failed to parse OpenAI response:', response)
      throw new Error('Invalid response format from OpenAI')
    }

    // For demo purposes, use mock user ID
    const mockUserId = 'demo-user-1'

    // Save quiz to database
    const quiz = await prisma.quiz.create({
      data: {
        title: title || `${quizType} Quiz - ${pdf.title}`,
        type: quizType,
        questions: JSON.stringify(quizData.questions),
        answers: JSON.stringify(quizData.questions.map((q: any) => ({
          id: q.id,
          correctAnswer: q.correctAnswer,
          explanation: q.explanation
        }))),
        userId: mockUserId,
        pdfId: pdfId,
      }
    })

    return NextResponse.json({
      success: true,
      quiz: {
        id: quiz.id,
        title: quiz.title,
        type: quiz.type,
        questions: quizData.questions,
        totalQuestions: quizData.questions.length
      }
    })

  } catch (error) {
    console.error('Quiz generation error:', error)
    return NextResponse.json(
      { error: 'Failed to generate quiz' },
      { status: 500 }
    )
  }
}


