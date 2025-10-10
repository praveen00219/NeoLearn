import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { v4 as uuidv4 } from 'uuid'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const title = formData.get('title') as string

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
    }

    if (file.type !== 'application/pdf') {
      return NextResponse.json({ error: 'File must be a PDF' }, { status: 400 })
    }

    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      return NextResponse.json({ error: 'File size must be less than 10MB' }, { status: 400 })
    }

    // Create uploads directory if it doesn't exist
    const uploadsDir = join(process.cwd(), 'uploads')
    try {
      await mkdir(uploadsDir, { recursive: true })
    } catch (error) {
      // Directory already exists
    }

    // Generate unique filename
    const fileExtension = file.name.split('.').pop()
    const uniqueFilename = `${uuidv4()}.${fileExtension}`
    const filePath = join(uploadsDir, uniqueFilename)

    // Save file to disk
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    await writeFile(filePath, buffer)

    // For demo purposes, create a mock user
    // In production, you'd get this from authentication
    const mockUserId = 'demo-user-1'

    // Save PDF record to database
    const pdf = await prisma.pDF.create({
      data: {
        title: title || file.name.replace('.pdf', ''),
        filename: file.name,
        filePath: filePath,
        fileSize: file.size,
        userId: mockUserId,
      },
    })

    // TODO: Process PDF content and create chunks for RAG
    // This would involve:
    // 1. Extract text from PDF
    // 2. Split into chunks
    // 3. Generate embeddings
    // 4. Store in database

    return NextResponse.json({
      success: true,
      pdf: {
        id: pdf.id,
        title: pdf.title,
        filename: pdf.filename,
        fileSize: pdf.fileSize,
        uploadDate: pdf.uploadDate,
      },
    })

  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: 'Failed to upload PDF' },
      { status: 500 }
    )
  }
}

