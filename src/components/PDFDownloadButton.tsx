'use client'

import React from 'react'
import { PDFDownloadLink } from '@react-pdf/renderer'
import { Download } from 'lucide-react'
import AssessmentResultsPDF from './AssessmentResultsPDF'

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
  return (
    <PDFDownloadLink
      document={
        <AssessmentResultsPDF 
          userProgress={userProgress}
          spiScore={spiScore}
          dimensions={dimensions}
        />
      }
      fileName={`SPI_Assessment_Results_${new Date().toISOString().split('T')[0]}.pdf`}
      className="bg-green-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-green-700 transition-colors text-lg flex items-center gap-2"
    >
      {({ blob, url, loading, error }) =>
        loading ? (
          <span className="flex items-center gap-2">
            <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></span>
            Generating PDF...
          </span>
        ) : error ? (
          <span className="flex items-center gap-2">
            <Download className="w-5 h-5" />
            Error generating PDF
          </span>
        ) : (
          <>
            <Download className="w-5 h-5" />
            Download PDF
          </>
        )
      }
    </PDFDownloadLink>
  )
}

export default PDFDownloadButton