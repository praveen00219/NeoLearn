import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { openai, CHAT_PROMPTS } from '@/lib/openai'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    const { message, chatId, pdfId } = await request.json()

    if (!message || !chatId) {
      return NextResponse.json(
        { error: 'Message and chat ID are required' },
        { status: 400 }
      )
    }

    // Get chat and PDF information
    const chat = await prisma.chat.findUnique({
      where: { id: chatId },
      include: {
        pdf: {
          include: {
            chunks: {
              orderBy: { pageNumber: 'asc' }
            }
          }
        },
        messages: {
          orderBy: { createdAt: 'asc' },
          take: 10 // Last 10 messages for context
        }
      }
    })

    if (!chat) {
      return NextResponse.json(
        { error: 'Chat not found' },
        { status: 404 }
      )
    }

    // Save user message
    await prisma.chatMessage.create({
      data: {
        content: message,
        role: 'USER',
        chatId: chatId,
      }
    })

    // Prepare PDF content for context
    let pdfContent = ''
    if (chat.pdf && chat.pdf.chunks.length > 0) {
      pdfContent = chat.pdf.chunks.map(chunk => 
        `Page ${chunk.pageNumber}: ${chunk.content}`
      ).join('\n\n')
    }

    // Prepare conversation history
    const conversationHistory = chat.messages.map(msg => ({
      role: msg.role.toLowerCase() as 'user' | 'assistant' | 'system',
      content: msg.content
    }))

    // Generate response using OpenAI
    const messages = [
      {
        role: 'system' as const,
        content: CHAT_PROMPTS.SYSTEM
      },
      ...conversationHistory,
      {
        role: 'user' as const,
        content: CHAT_PROMPTS.QUESTION
        .replace('{content}', pdfContent || 'No PDF content available')
        .replace('{question}', message)
      }
    ]

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: messages,
      temperature: 0.7,
      max_tokens: 1000,
    })

    const response = completion.choices[0]?.message?.content
    if (!response) {
      throw new Error('No response from OpenAI')
    }

    // Save assistant response
    const assistantMessage = await prisma.chatMessage.create({
      data: {
        content: response,
        role: 'ASSISTANT',
        chatId: chatId,
      }
    })

    // Update chat timestamp
    await prisma.chat.update({
      where: { id: chatId },
      data: { updatedAt: new Date() }
    })

    return NextResponse.json({
      success: true,
      message: {
        id: assistantMessage.id,
        content: response,
        role: 'ASSISTANT',
        createdAt: assistantMessage.createdAt
      }
    })

  } catch (error) {
    console.error('Chat error:', error)
    return NextResponse.json(
      { error: 'Failed to process chat message' },
      { status: 500 }
    )
  }
}
