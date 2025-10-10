import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  try {
    // For demo purposes, use mock user ID
    // In production, you'd get this from authentication
    const mockUserId = 'demo-user-1'

    const pdfs = await prisma.pDF.findMany({
      where: {
        userId: mockUserId,
      },
      orderBy: {
        uploadDate: 'desc',
      },
      select: {
        id: true,
        title: true,
        filename: true,
        fileSize: true,
        uploadDate: true,
      },
    })

    return NextResponse.json(pdfs)

  } catch (error) {
    console.error('Error fetching PDFs:', error)
    return NextResponse.json(
      { error: 'Failed to fetch PDFs' },
      { status: 500 }
    )
  }
}

