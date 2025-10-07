# BeyondChats - AI-Powered Learning Platform

A fully functional, responsive web application that helps school students revise from their coursebooks using AI-powered quizzes and chat assistance.

## 🚀 Features

### Must-Have Features (Implemented)
- ✅ **Source Selector**: Upload and select PDFs for study
- ✅ **PDF Viewer**: Split-view layout with chat interface
- ✅ **Quiz Generator Engine**: Generate MCQs, SAQs, and LAQs from PDFs
- ✅ **Progress Tracking**: Learning analytics and performance dashboard
- ✅ **Responsive Design**: Mobile-friendly interface

### Nice-to-Have Features (Planned)
- 🔄 **Chat UI**: ChatGPT-inspired interface with RAG
- 🔄 **Citations**: Page references and quote snippets
- 🔄 **YouTube Recommender**: Educational video suggestions

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: SQLite (development) / PostgreSQL (production)
- **AI Integration**: OpenAI GPT-4 for quiz generation and chat
- **PDF Processing**: PDF.js for viewing, OpenAI for content extraction
- **Deployment**: Vercel

## 📦 Installation & Setup

### Prerequisites
- Node.js 18+ 
- npm or yarn
- OpenAI API key

### 1. Clone and Install Dependencies
```bash
git clone <repository-url>
cd beyondchats-app
npm install
```

### 2. Environment Configuration
Copy the environment example file and configure your variables:
```bash
cp env.example .env.local
```

Update `.env.local` with your actual values:
```env
OPENAI_API_KEY=your_openai_api_key_here
DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET=your_nextauth_secret_here
NEXTAUTH_URL=http://localhost:3000
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Database Setup
```bash
# Generate Prisma client
npm run db:generate

# Push database schema
npm run db:push
```

### 4. Run Development Server
```bash
npm run dev
```

Visit `http://localhost:3000` to see the application.

## 🏗️ Project Structure

```
beyondchats-app/
├── src/
│   ├── app/                    # Next.js 14 App Router
│   │   ├── api/               # API routes
│   │   │   ├── pdf/           # PDF management
│   │   │   ├── quiz/          # Quiz generation
│   │   │   ├── chat/          # Chat functionality
│   │   │   └── progress/      # Progress tracking
│   │   ├── dashboard/         # Main dashboard
│   │   ├── pdf/               # PDF viewer
│   │   ├── quiz/              # Quiz interface
│   │   └── chat/              # Chat interface
│   ├── components/            # Reusable components
│   │   ├── PDFUploader.tsx
│   │   ├── PDFList.tsx
│   │   ├── ProgressDashboard.tsx
│   │   └── RecentQuizzes.tsx
│   └── lib/                   # Utility functions
├── prisma/
│   └── schema.prisma          # Database schema
├── uploads/                   # PDF file storage
└── public/                    # Static assets
```

## 🎯 How It Works

### 1. PDF Upload & Processing
- Users upload PDF files through the dashboard
- Files are stored locally and metadata saved to database
- PDF content is extracted and chunked for AI processing

### 2. Quiz Generation
- OpenAI analyzes PDF content to generate relevant questions
- Supports Multiple Choice (MCQ), Short Answer (SAQ), and Long Answer (LAQ) questions
- Questions are stored with correct answers and explanations

### 3. Progress Tracking
- User performance is tracked across all quiz attempts
- Analytics show strengths, weaknesses, and learning progress
- Dashboard provides visual insights into study patterns

### 4. Chat Interface
- RAG (Retrieval Augmented Generation) system for PDF-based conversations
- Citations include page numbers and relevant text snippets
- Context-aware responses based on uploaded materials

## 🔧 Development

### Available Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run db:push      # Push database schema changes
npm run db:studio    # Open Prisma Studio
npm run db:generate  # Generate Prisma client
```

### Database Management
```bash
# View database in Prisma Studio
npm run db:studio

# Reset database (development only)
npx prisma db push --force-reset
```

## 🚀 Deployment

### Vercel Deployment
1. Push code to GitHub repository
2. Connect repository to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy automatically on push

### Environment Variables for Production
```env
OPENAI_API_KEY=your_production_openai_key
DATABASE_URL=your_production_database_url
NEXTAUTH_SECRET=your_production_secret
NEXTAUTH_URL=https://your-domain.vercel.app
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
```

## 📊 Database Schema

### Key Models
- **User**: User accounts and authentication
- **PDF**: Uploaded PDF files and metadata
- **PDFChunk**: Text chunks for RAG processing
- **Quiz**: Generated quizzes with questions
- **QuizAttempt**: User quiz attempts and scores
- **Progress**: Learning analytics and tracking
- **Chat**: Chat conversations
- **ChatMessage**: Individual chat messages

## 🤖 AI Integration

### OpenAI Usage
- **Quiz Generation**: GPT-4 analyzes PDF content to create educational questions
- **Chat Responses**: RAG system provides context-aware answers
- **Content Analysis**: PDF text extraction and summarization

### Prompt Engineering
- Structured prompts for consistent quiz generation
- Context-aware chat responses with citations
- Educational focus with appropriate difficulty levels

## 🎨 UI/UX Design

### Design Principles
- **Clean & Modern**: Minimalist interface inspired by ChatGPT
- **Educational Focus**: Colors and typography optimized for learning
- **Mobile-First**: Responsive design for all devices
- **Accessibility**: WCAG 2.1 compliance

### Color Scheme
- Primary: Blue (#3b82f6) - Trust and learning
- Secondary: Green (#22c55e) - Success and progress
- Accent: Purple (#8b5cf6) - Creativity and innovation

## 📈 Performance Optimizations

- **Code Splitting**: Dynamic imports for better loading
- **Image Optimization**: Next.js Image component
- **Caching**: React Query for API response caching
- **Bundle Analysis**: Optimized bundle sizes

## 🔒 Security Considerations

- **File Upload Validation**: PDF type and size restrictions
- **API Rate Limiting**: Prevent abuse of OpenAI API
- **Input Sanitization**: XSS protection for user inputs
- **Environment Variables**: Secure API key management

## 🧪 Testing

### Manual Testing Checklist
- [ ] PDF upload functionality
- [ ] Quiz generation from different PDF types
- [ ] Progress tracking accuracy
- [ ] Mobile responsiveness
- [ ] Chat interface with citations
- [ ] Error handling and edge cases

## 📝 Development Journey

### Phase 1: Foundation ✅
- Project setup with Next.js 14 + TypeScript
- Database schema design with Prisma
- Basic UI framework with Tailwind CSS
- OpenAI API integration

### Phase 2: Core Features 🔄
- PDF upload and storage system
- PDF viewer with split-view layout
- Quiz generation engine with OpenAI
- Progress tracking and analytics

### Phase 3: Enhancement 🔄
- ChatGPT-inspired chat interface
- RAG implementation with citations
- Mobile responsiveness optimization
- Performance improvements

### Phase 4: Polish & Deploy 🔄
- Testing and bug fixes
- Documentation completion
- Production deployment
- Live URL setup

## 🎯 Trade-offs & Decisions

### Technical Decisions
1. **Next.js 14 App Router**: Modern React patterns with server components
2. **SQLite for Development**: Easy setup, PostgreSQL for production
3. **Local File Storage**: Simple for MVP, cloud storage for scale
4. **OpenAI GPT-4**: Best quality for educational content generation

### Scope Adjustments
- **Authentication**: Simplified for demo (mock user)
- **File Storage**: Local storage for MVP
- **Real-time Features**: Basic implementation, WebSocket for future
- **Advanced Analytics**: Basic progress tracking, detailed analytics for future

## 🚀 Future Enhancements

- **User Authentication**: JWT-based auth with user accounts
- **Cloud Storage**: AWS S3 or similar for PDF storage
- **Real-time Chat**: WebSocket implementation
- **Advanced Analytics**: Detailed learning insights
- **Mobile App**: React Native version
- **Collaborative Features**: Study groups and sharing

## 📞 Support

For questions or issues:
- Check the documentation above
- Review the code comments
- Test with the provided sample PDFs

## 📄 License

This project is created for the BeyondChats assignment. All code is original work.

---

**Built with ❤️ for educational excellence**