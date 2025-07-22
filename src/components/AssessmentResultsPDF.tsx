'use client'

import React from 'react'
import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer'
import { calculateStandoutScore, getStandoutTier } from '@/lib/standoutScoring'

// Register fonts
Font.register({
  family: 'Inter',
  fonts: [
    { src: 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiA.woff2' },
    { src: 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuGKYAZ9hiA.woff2', fontWeight: 600 },
    { src: 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuFuYAZ9hiA.woff2', fontWeight: 700 },
  ]
})

// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    padding: 40,
    fontFamily: 'Inter',
  },
  header: {
    marginBottom: 30,
    borderBottom: '2px solid #4f46e5',
    paddingBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 700,
    color: '#1f2937',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 4,
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 600,
    color: '#1f2937',
    marginBottom: 12,
  },
  scoreBox: {
    backgroundColor: '#f3f4f6',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  scoreRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  scoreLabel: {
    fontSize: 12,
    color: '#4b5563',
  },
  scoreValue: {
    fontSize: 14,
    fontWeight: 600,
    color: '#1f2937',
  },
  totalScore: {
    fontSize: 24,
    fontWeight: 700,
    color: '#4f46e5',
    textAlign: 'center',
    marginVertical: 15,
  },
  tierBadge: {
    backgroundColor: '#4f46e5',
    color: '#ffffff',
    padding: 10,
    borderRadius: 6,
    fontSize: 16,
    fontWeight: 600,
    textAlign: 'center',
    marginBottom: 15,
  },
  probabilityBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f9fafb',
    padding: 12,
    borderRadius: 6,
    marginBottom: 10,
  },
  strengthBox: {
    backgroundColor: '#fef3c7',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  strengthTitle: {
    fontSize: 16,
    fontWeight: 600,
    color: '#92400e',
    marginBottom: 8,
  },
  dimensionItem: {
    marginBottom: 15,
  },
  dimensionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  dimensionName: {
    fontSize: 14,
    fontWeight: 600,
    color: '#1f2937',
  },
  dimensionScore: {
    fontSize: 14,
    color: '#6b7280',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#e5e7eb',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4f46e5',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    fontSize: 10,
    color: '#9ca3af',
    textAlign: 'center',
  }
})

interface AssessmentResultsPDFProps {
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

const getProbabilityData = (spiScore: number, tier: string) => {
  if (tier === '1%') {
    return { probability: 76, tier: 'High', color: '#10b981' }
  } else if (tier === '9%') {
    if (spiScore >= 65) {
      return { probability: 51, tier: 'Medium-High', color: '#3b82f6' }
    } else {
      return { probability: 26, tier: 'Medium', color: '#f59e0b' }
    }
  } else {
    return { probability: 25, tier: 'Low', color: '#ef4444' }
  }
}

const AssessmentResultsPDF: React.FC<AssessmentResultsPDFProps> = ({ userProgress, spiScore, dimensions }) => {
  // Ensure userProgress exists with defaults
  const safeUserProgress = userProgress || {}
  const tier = safeUserProgress.current_tier || '90%'
  const strength1 = safeUserProgress.standout_strength_1 || ''
  const strength2 = safeUserProgress.standout_strength_2 || ''
  const firstName = safeUserProgress.first_name || 'User'
  const lastName = safeUserProgress.last_name || ''
  
  const actualStrengthCombo = strength1 && strength2 ? `${strength1} + ${strength2}` : 'Balanced'
  const standoutResult = calculateStandoutScore(strength1, strength2)
  const standoutSynergy = getStandoutTier(standoutResult.score)
  const probabilityData = getProbabilityData(spiScore, tier)
  const currentDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>SPI Assessment Results</Text>
          <Text style={styles.subtitle}>{firstName} {lastName}</Text>
          <Text style={styles.subtitle}>{currentDate}</Text>
        </View>

        {/* Overall Score Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Overall Performance</Text>
          <Text style={styles.totalScore}>Total SPI Score: {spiScore}/100</Text>
          <Text style={styles.tierBadge}>Current Tier: {tier}</Text>
          
          <View style={styles.probabilityBox}>
            <Text style={styles.scoreLabel}>Success Probability:</Text>
            <Text style={[styles.scoreValue, { color: probabilityData.color }]}>
              {probabilityData.probability}% ({probabilityData.tier} Range)
            </Text>
          </View>
        </View>

        {/* Standout Strengths */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Standout Strengths</Text>
          <View style={styles.strengthBox}>
            <Text style={styles.strengthTitle}>{actualStrengthCombo}</Text>
            <Text style={styles.scoreLabel}>Synergy Level: {standoutSynergy}</Text>
            <Text style={styles.scoreLabel}>Bonus Points: +{Math.round(standoutResult.score * 2)}</Text>
          </View>
        </View>

        {/* Dimension Breakdown */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Dimension Breakdown</Text>
          {dimensions.map((dimension, index) => (
            <View key={index} style={styles.dimensionItem}>
              <View style={styles.dimensionHeader}>
                <Text style={styles.dimensionName}>{dimension.name}</Text>
                <Text style={styles.dimensionScore}>
                  {dimension.score}/{dimension.max} ({dimension.percentage}%)
                </Text>
              </View>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: `${dimension.percentage}%` }]} />
              </View>
            </View>
          ))}
        </View>

        {/* Footer */}
        <Text style={styles.footer}>
          Generated from spiassessment.com | Road to 1% - Comprehensive Assessment Platform
        </Text>
      </Page>
    </Document>
  )
}

export default AssessmentResultsPDF