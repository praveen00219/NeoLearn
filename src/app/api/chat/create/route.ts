import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    const { title, pdfId } = await request.json()

    if (!title) {
      return NextResponse.json(
        { error: 'Chat title is required' },
        { status: 400 }
      )
    }

    // For demo purposes, use mock user ID
    const mockUserId = 'demo-user-1'

    // Create new chat
    const chat = await prisma.chat.create({
      data: {
        title: title,
        userId: mockUserId,
        pdfId: pdfId || null,
      }
    })

    // Add welcome message
    await prisma.chatMessage.create({
      data: {
        content: pdfId 
          ? `Hello! I'm here to help you learn from your PDF. You can ask me questions about the content, request explanations, or discuss any topics from the document. What would you like to know?`
          : `Hello! I'm here to help you learn. You can ask me questions about any topic, request explanations, or discuss concepts you're studying. What would you like to know?`,
        role: 'ASSISTANT',
        chatId: chat.id,
      }
    })

    return NextResponse.json({
      success: true,
      chat: {
        id: chat.id,
        title: chat.title,
        pdfId: chat.pdfId,
        createdAt: chat.createdAt
      }
    })

  } catch (error) {
    console.error('Chat creation error:', error)
    return NextResponse.json(
      { error: 'Failed to create chat' },
      { status: 500 }
    )
  }
}


