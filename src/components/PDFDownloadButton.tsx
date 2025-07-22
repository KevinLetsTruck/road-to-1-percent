'use client'

import React, { useState } from 'react'
import { Download } from 'lucide-react'

interface PDFDownloadButtonProps {
  userProgress: any
  spiScore: number
  dimensions: Array<{
    name: string
    score: number
    max: number
    percentage: number
    color: string
  }>
}

const PDFDownloadButton: React.FC<PDFDownloadButtonProps> = ({ userProgress, spiScore, dimensions }) => {
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState(false)

  const handleDownload = async () => {
    setIsGenerating(true)
    setError(false)

    try {
      // Dynamically import react-pdf components only when needed
      const { PDFDownloadLink, pdf } = await import('@react-pdf/renderer')
      const AssessmentResultsPDF = (await import('./AssessmentResultsPDF')).default

      // Generate the PDF
      const doc = (
        <AssessmentResultsPDF
          userProgress={userProgress}
          spiScore={spiScore}
          dimensions={dimensions}
        />
      )

      // Create blob and download
      const blob = await pdf(doc).toBlob()
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `SPI_Assessment_Results_${new Date().toISOString().split('T')[0]}.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
      
      setIsGenerating(false)
    } catch (err) {
      console.error('Error generating PDF:', err)
      setError(true)
      setIsGenerating(false)
    }
  }

  // Validate data before allowing download
  if (!userProgress || !dimensions || dimensions.length === 0) {
    return (
      <button
        disabled
        className="bg-gray-400 text-white px-8 py-4 rounded-lg font-semibold cursor-not-allowed text-lg flex items-center gap-2"
      >
        <Download className="w-5 h-5" />
        PDF not available
      </button>
    )
  }

  return (
    <button
      onClick={handleDownload}
      disabled={isGenerating}
      className={`${
        isGenerating 
          ? 'bg-gray-500 cursor-not-allowed' 
          : error 
          ? 'bg-red-600 hover:bg-red-700' 
          : 'bg-green-600 hover:bg-green-700'
      } text-white px-8 py-4 rounded-lg font-semibold transition-colors text-lg flex items-center gap-2`}
    >
      {isGenerating ? (
        <>
          <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></span>
          Generating PDF...
        </>
      ) : error ? (
        <>
          <Download className="w-5 h-5" />
          Error - Try Again
        </>
      ) : (
        <>
          <Download className="w-5 h-5" />
          Download PDF
        </>
      )}
    </button>
  )
}

export default PDFDownloadButton