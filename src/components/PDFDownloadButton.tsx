'use client'

import React, { useState, useEffect } from 'react'
import { Download } from 'lucide-react'
import dynamic from 'next/dynamic'

// Dynamically import react-pdf components to avoid SSR issues
const PDFDownloadLink = dynamic(
  () => import('@react-pdf/renderer').then(mod => mod.PDFDownloadLink),
  { ssr: false }
)

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
  const [isReady, setIsReady] = useState(false)
  const [PDFDocument, setPDFDocument] = useState<any>(null)

  useEffect(() => {
    // Dynamically import the PDF component
    import('./AssessmentResultsPDF').then((module) => {
      setPDFDocument(() => module.default)
    }).catch((error) => {
      console.error('Error loading PDF component:', error)
    })
  }, [])

  // Don't render anything until user clicks
  if (!isReady) {
    return (
      <button
        onClick={() => setIsReady(true)}
        className="bg-green-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-green-700 transition-colors text-lg flex items-center gap-2"
      >
        <Download className="w-5 h-5" />
        Download PDF
      </button>
    )
  }

  // Validate data before rendering PDF
  if (!userProgress || !dimensions || dimensions.length === 0 || !PDFDocument) {
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
    <PDFDownloadLink
      document={
        <PDFDocument 
          userProgress={userProgress}
          spiScore={spiScore}
          dimensions={dimensions}
        />
      }
      fileName={`SPI_Assessment_Results_${new Date().toISOString().split('T')[0]}.pdf`}
      className="bg-green-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-green-700 transition-colors text-lg flex items-center gap-2"
    >
      {({ blob, url, loading, error }) => {
        if (error) {
          console.error('PDF Generation Error:', error)
        }
        
        return loading ? (
          <span className="flex items-center gap-2">
            <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></span>
            Generating PDF...
          </span>
        ) : error ? (
          <span className="flex items-center gap-2">
            <Download className="w-5 h-5" />
            Error generating PDF - Try again
          </span>
        ) : blob ? (
          <>
            <Download className="w-5 h-5" />
            Download PDF
          </>
        ) : null
      }}
    </PDFDownloadLink>
  )
}

export default PDFDownloadButton