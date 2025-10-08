import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const pdfId = params.id

    const pdf = await prisma.pDF.findUnique({
      where: { id: pdfId },
      select: {
        id: true,
        title: true,
        filename: true,
        fileSize: true,
        uploadDate: true,
      },
    })

    if (!pdf) {
      return NextResponse.json(
        { error: 'PDF not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(pdf)

  } catch (error) {
    console.error('Error fetching PDF:', error)
    return NextResponse.json(
      { error: 'Failed to fetch PDF' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const pdfId = params.id

    // Check if PDF exists
    const pdf = await prisma.pDF.findUnique({
      where: { id: pdfId },
    })

    if (!pdf) {
      return NextResponse.json(
        { error: 'PDF not found' },
        { status: 404 }
      )
    }

    // Delete PDF and all related data
    await prisma.pDF.delete({
      where: { id: pdfId },
    })

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Error deleting PDF:', error)
    return NextResponse.json(
      { error: 'Failed to delete PDF' },
      { status: 500 }
    )
  }
}
