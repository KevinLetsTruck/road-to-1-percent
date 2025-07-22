"use client";

import React, { useState } from "react";
import { Download } from "lucide-react";

interface PDFDownloadButtonProps {
  userProgress: any;
  standoutStrength1?: string;
  standoutStrength2?: string;
  className?: string;
}

const PDFDownloadButton: React.FC<PDFDownloadButtonProps> = ({
  userProgress,
  standoutStrength1,
  standoutStrength2,
  className = "",
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState(false);

  const handleDownload = async () => {
    setIsGenerating(true);
    setError(false);

    try {
      // Dynamically import react-pdf components only when needed
      const { PDFDownloadLink, pdf } = await import("@react-pdf/renderer");
      const AssessmentResultsPDF = (await import("./AssessmentResultsPDF"))
        .default;

      // Calculate dimensions from userProgress
      const dimensions = [
        {
          name: "Financial Foundation",
          score: userProgress.financial_foundation_score || 0,
          max: 35,
          percentage: Math.round(
            ((userProgress.financial_foundation_score || 0) / 35) * 100
          ),
          color: "green",
        },
        {
          name: "Market Intelligence",
          score: userProgress.market_intelligence_score || 0,
          max: 20,
          percentage: Math.round(
            ((userProgress.market_intelligence_score || 0) / 20) * 100
          ),
          color: "blue",
        },
        {
          name: "Risk Management",
          score: userProgress.risk_management_score || 0,
          max: 15,
          percentage: Math.round(
            ((userProgress.risk_management_score || 0) / 15) * 100
          ),
          color: "orange",
        },
        {
          name: "Support Systems",
          score: userProgress.support_systems_score || 0,
          max: 10,
          percentage: Math.round(
            ((userProgress.support_systems_score || 0) / 10) * 100
          ),
          color: "orange",
        },
      ];

      const spiScore = userProgress.spi_score || 0;

      // Generate the PDF
      const doc = (
        <AssessmentResultsPDF
          userProgress={{
            ...userProgress,
            standout_strength_1:
              standoutStrength1 || userProgress.standout_strength_1,
            standout_strength_2:
              standoutStrength2 || userProgress.standout_strength_2,
          }}
          spiScore={spiScore}
          dimensions={dimensions}
        />
      );

      // Create blob and download
      const blob = await pdf(doc).toBlob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `Success_Probability_Results_${new Date().toISOString().split("T")[0]}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setIsGenerating(false);
    } catch (err) {
      console.error("Error generating PDF:", err);
      setError(true);
      setIsGenerating(false);
    }
  };

  // Validate data before allowing download
  if (!userProgress) {
    return (
      <button
        disabled
        className={`bg-gray-400 text-white px-4 py-2 rounded-lg font-semibold cursor-not-allowed flex items-center gap-2 ${className}`}
      >
        <Download className="w-4 h-4" />
        PDF not available
      </button>
    );
  }

  const baseClasses = `font-semibold transition-colors flex items-center justify-center gap-2 px-4 py-2 rounded-lg ${className}`;

  return (
    <button
      onClick={handleDownload}
      disabled={isGenerating}
      className={`${baseClasses} ${
        isGenerating
          ? "bg-gray-500 cursor-not-allowed"
          : error
            ? "bg-red-600 hover:bg-red-700"
            : "bg-primary hover:bg-primary-dark"
      } text-white`}
    >
      {isGenerating ? (
        <>
          <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
          Generating PDF...
        </>
      ) : error ? (
        <>
          <Download className="w-4 h-4" />
          Error - Try Again
        </>
      ) : (
        <>
          <Download className="w-4 h-4" />
          Download PDF
        </>
      )}
    </button>
  );
};

export default PDFDownloadButton;
