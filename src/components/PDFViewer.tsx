'use client'

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { 
  ChevronLeft, 
  ChevronRight, 
  ZoomIn, 
  ZoomOut, 
  RotateCw,
  Download,
  Search,
  BookOpen
} from 'lucide-react'

interface PDFViewerProps {
  pdfId: string
}

export function PDFViewer({ pdfId }: PDFViewerProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [scale, setScale] = useState(1.0)
  const [rotation, setRotation] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Mock PDF data for demo - in production, this would load actual PDF
  useEffect(() => {
    const loadPDF = async () => {
      try {
        setIsLoading(true)
        setError(null)
        
        // Simulate PDF loading
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // Mock data
        setTotalPages(10)
        setIsLoading(false)
        
        // In production, you would use PDF.js to load and render the actual PDF
        // For now, we'll create a mock PDF page
        renderMockPage()
        
      } catch (err) {
        setError('Failed to load PDF')
        setIsLoading(false)
      }
    }

    loadPDF()
  }, [pdfId])

  const renderMockPage = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Set background
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Add border
    ctx.strokeStyle = '#e5e7eb'
    ctx.lineWidth = 2
    ctx.strokeRect(1, 1, canvas.width - 2, canvas.height - 2)

    // Add mock content
    ctx.fillStyle = '#374151'
    ctx.font = '24px Arial'
    ctx.textAlign = 'center'
    ctx.fillText('Sample PDF Content', canvas.width / 2, 100)

    ctx.font = '16px Arial'
    ctx.textAlign = 'left'
    
    const lines = [
      'This is a mock PDF viewer for demonstration purposes.',
      '',
      'In a real implementation, this would display:',
      '• Actual PDF content using PDF.js',
      '• Interactive text selection',
      '• Search functionality',
      '• Annotations and highlights',
      '',
      `Page ${currentPage} of ${totalPages}`,
      '',
      'Features that would be available:',
      '• Zoom in/out',
      '• Page navigation',
      '• Text search',
      '• Print and download',
      '',
      'The PDF content would be extracted and processed',
      'for AI-powered quiz generation and chat assistance.'
    ]

    let y = 150
    lines.forEach(line => {
      ctx.fillText(line, 50, y)
      y += 25
    })

    // Add page number
    ctx.fillStyle = '#6b7280'
    ctx.font = '14px Arial'
    ctx.textAlign = 'center'
    ctx.fillText(`Page ${currentPage}`, canvas.width / 2, canvas.height - 30)
  }

  useEffect(() => {
    renderMockPage()
  }, [currentPage, totalPages])

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1)
    }
  }

  const handleZoomIn = () => {
    setScale(Math.min(scale + 0.25, 3.0))
  }

  const handleZoomOut = () => {
    setScale(Math.max(scale - 0.25, 0.5))
  }

  const handleRotate = () => {
    setRotation((rotation + 90) % 360)
  }

  const handleDownload = () => {
    // In production, this would download the actual PDF file
    alert('Download functionality would be implemented here')
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading PDF...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <BookOpen className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading PDF</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full bg-gray-100">
      {/* Toolbar */}
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <button
              onClick={handlePreviousPage}
              disabled={currentPage <= 1}
              className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            
            <span className="text-sm text-gray-600 px-2">
              {currentPage} of {totalPages}
            </span>
            
            <button
              onClick={handleNextPage}
              disabled={currentPage >= totalPages}
              className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleZoomOut}
              className="p-2 text-gray-400 hover:text-gray-600"
            >
              <ZoomOut className="w-5 h-5" />
            </button>
            
            <span className="text-sm text-gray-600 px-2">
              {Math.round(scale * 100)}%
            </span>
            
            <button
              onClick={handleZoomIn}
              className="p-2 text-gray-400 hover:text-gray-600"
            >
              <ZoomIn className="w-5 h-5" />
            </button>
            
            <div className="w-px h-6 bg-gray-300 mx-2"></div>
            
            <button
              onClick={handleRotate}
              className="p-2 text-gray-400 hover:text-gray-600"
            >
              <RotateCw className="w-5 h-5" />
            </button>
            
            <button
              onClick={handleDownload}
              className="p-2 text-gray-400 hover:text-gray-600"
            >
              <Download className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* PDF Content */}
      <div className="flex-1 overflow-auto p-4">
        <div className="flex justify-center">
          <motion.div
            style={{
              transform: `scale(${scale}) rotate(${rotation}deg)`,
              transformOrigin: 'center center'
            }}
            className="shadow-lg"
          >
            <canvas
              ref={canvasRef}
              width={600}
              height={800}
              className="border border-gray-300 bg-white"
            />
          </motion.div>
        </div>
      </div>
    </div>
  )
}


