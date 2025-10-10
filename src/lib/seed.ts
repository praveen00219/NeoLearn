import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function seedDatabase() {
  try {
    console.log('🌱 Seeding database...')

    // Create demo user
    const demoUser = await prisma.user.upsert({
      where: { id: 'demo-user-1' },
      update: {},
      create: {
        id: 'demo-user-1',
        email: 'demo@beyondchats.com',
        name: 'Demo User',
      }
    })

    console.log('✅ Demo user created:', demoUser.email)

    // Create sample PDFs
    const samplePDFs = [
      {
        id: 'pdf-1',
        title: 'NCERT Class XI Physics - Chapter 1: Physical World',
        filename: 'ncert_physics_ch1.pdf',
        filePath: './uploads/sample_physics_ch1.pdf',
        fileSize: 2048576, // 2MB
        userId: demoUser.id,
      },
      {
        id: 'pdf-2', 
        title: 'NCERT Class XI Physics - Chapter 2: Units and Measurements',
        filename: 'ncert_physics_ch2.pdf',
        filePath: './uploads/sample_physics_ch2.pdf',
        fileSize: 1536000, // 1.5MB
        userId: demoUser.id,
      }
    ]

    for (const pdfData of samplePDFs) {
      const pdf = await prisma.pDF.upsert({
        where: { id: pdfData.id },
        update: {},
        create: pdfData
      })
      console.log('✅ Sample PDF created:', pdf.title)
    }

    // Create sample PDF chunks for demo
    const sampleChunks = [
      {
        id: 'chunk-1',
        content: 'Physics is the study of matter, energy, and their interactions. It is a fundamental science that helps us understand the natural world around us. The word "physics" comes from the Greek word "physis" meaning nature.',
        pageNumber: 1,
        pdfId: 'pdf-1',
      },
      {
        id: 'chunk-2',
        content: 'The scientific method is a systematic approach to understanding natural phenomena. It involves observation, hypothesis formation, experimentation, and analysis of results. This method has led to many important discoveries in physics.',
        pageNumber: 2,
        pdfId: 'pdf-1',
      },
      {
        id: 'chunk-3',
        content: 'Measurement is the process of comparing an unknown quantity with a known standard. In physics, we need precise measurements to understand natural phenomena. The International System of Units (SI) provides standard units for measurement.',
        pageNumber: 1,
        pdfId: 'pdf-2',
      }
    ]

    for (const chunkData of sampleChunks) {
      await prisma.pDFChunk.upsert({
        where: { id: chunkData.id },
        update: {},
        create: chunkData
      })
    }

    console.log('✅ Sample PDF chunks created')

    // Create sample quizzes
    const sampleQuizzes = [
      {
        id: 'quiz-1',
        title: 'Physics Fundamentals Quiz',
        type: 'MCQ',
        questions: JSON.stringify([
          {
            id: 'q1',
            question: 'What is physics the study of?',
            options: {
              A: 'Only matter',
              B: 'Only energy', 
              C: 'Matter, energy, and their interactions',
              D: 'Only natural phenomena'
            },
            correctAnswer: 'C',
            explanation: 'Physics is the study of matter, energy, and their interactions.',
            difficulty: 'Easy'
          },
          {
            id: 'q2',
            question: 'What does the Greek word "physis" mean?',
            options: {
              A: 'Energy',
              B: 'Matter',
              C: 'Nature',
              D: 'Science'
            },
            correctAnswer: 'C',
            explanation: 'The word "physics" comes from the Greek word "physis" meaning nature.',
            difficulty: 'Easy'
          }
        ]),
        answers: JSON.stringify([
          { id: 'q1', correctAnswer: 'C', explanation: 'Physics is the study of matter, energy, and their interactions.' },
          { id: 'q2', correctAnswer: 'C', explanation: 'The word "physics" comes from the Greek word "physis" meaning nature.' }
        ]),
        userId: demoUser.id,
        pdfId: 'pdf-1',
      }
    ]

    for (const quizData of sampleQuizzes) {
      const quiz = await prisma.quiz.upsert({
        where: { id: quizData.id },
        update: {},
        create: quizData
      })
      console.log('✅ Sample quiz created:', quiz.title)
    }

    // Create sample quiz attempts
    const sampleAttempts = [
      {
        id: 'attempt-1',
        userAnswers: JSON.stringify({ q1: 'C', q2: 'C' }),
        score: 100,
        totalQuestions: 2,
        quizId: 'quiz-1',
        userId: demoUser.id,
      },
      {
        id: 'attempt-2', 
        userAnswers: JSON.stringify({ q1: 'A', q2: 'C' }),
        score: 50,
        totalQuestions: 2,
        quizId: 'quiz-1',
        userId: demoUser.id,
      }
    ]

    for (const attemptData of sampleAttempts) {
      await prisma.quizAttempt.upsert({
        where: { id: attemptData.id },
        update: {},
        create: attemptData
      })
    }

    console.log('✅ Sample quiz attempts created')

    // Create sample chats
    const sampleChats = [
      {
        id: 'chat-1',
        title: 'Physics Discussion',
        userId: demoUser.id,
        pdfId: 'pdf-1',
      }
    ]

    for (const chatData of sampleChats) {
      const chat = await prisma.chat.upsert({
        where: { id: chatData.id },
        update: {},
        create: chatData
      })
      console.log('✅ Sample chat created:', chat.title)
    }

    // Create sample chat messages
    const sampleMessages = [
      {
        id: 'msg-1',
        content: 'Hello! I\'m here to help you learn from your PDF. You can ask me questions about the content, request explanations, or discuss any topics from the document. What would you like to know?',
        role: 'ASSISTANT',
        chatId: 'chat-1',
      },
      {
        id: 'msg-2',
        content: 'What is physics?',
        role: 'USER',
        chatId: 'chat-1',
      },
      {
        id: 'msg-3',
        content: 'According to page 1: "Physics is the study of matter, energy, and their interactions." Physics is a fundamental science that helps us understand the natural world around us. The word "physics" comes from the Greek word "physis" meaning nature.',
        role: 'ASSISTANT',
        chatId: 'chat-1',
      }
    ]

    for (const messageData of sampleMessages) {
      await prisma.chatMessage.upsert({
        where: { id: messageData.id },
        update: {},
        create: messageData
      })
    }

    console.log('✅ Sample chat messages created')

    // Create sample progress
    await prisma.progress.upsert({
      where: { id: 'progress-1' },
      update: {},
      create: {
        id: 'progress-1',
        subject: 'Physics',
        totalQuizzes: 1,
        completedQuizzes: 2,
        averageScore: 75,
        strengths: JSON.stringify(['Physics Fundamentals', 'Basic Concepts']),
        weaknesses: JSON.stringify(['Advanced Mechanics']),
        userId: demoUser.id,
      }
    })

    console.log('✅ Sample progress created')

    console.log('🎉 Database seeding completed successfully!')

  } catch (error) {
    console.error('❌ Error seeding database:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}


