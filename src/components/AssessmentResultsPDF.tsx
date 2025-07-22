'use client'

import React from 'react'
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer'

// Create minimal styles
const styles = StyleSheet.create({
  page: {
    padding: 40,
  },
  title: {
    fontSize: 24,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    marginBottom: 5,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    marginBottom: 10,
  },
  text: {
    fontSize: 12,
    marginBottom: 5,
  },
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

const AssessmentResultsPDF: React.FC<AssessmentResultsPDFProps> = ({ userProgress, spiScore, dimensions }) => {
  try {
    // Ensure we have valid data
    const firstName = userProgress?.first_name || 'User'
    const lastName = userProgress?.last_name || ''
    const tier = userProgress?.current_tier || '90%'
    const strength1 = userProgress?.standout_strength_1 || ''
    const strength2 = userProgress?.standout_strength_2 || ''
    
    return (
      <Document>
        <Page size="A4" style={styles.page}>
          <Text style={styles.title}>SPI Assessment Results</Text>
          <Text style={styles.subtitle}>{firstName} {lastName}</Text>
          <Text style={styles.subtitle}>{new Date().toLocaleDateString()}</Text>
          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Overall Performance</Text>
            <Text style={styles.text}>Total SPI Score: {spiScore}/100</Text>
            <Text style={styles.text}>Current Tier: {tier}</Text>
          </View>
          
          {strength1 && strength2 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Standout Strengths</Text>
              <Text style={styles.text}>{strength1} + {strength2}</Text>
            </View>
          )}
          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Dimension Breakdown</Text>
            {dimensions && dimensions.map((dimension, index) => (
              <Text key={index} style={styles.text}>
                {dimension.name}: {dimension.score}/{dimension.max} ({dimension.percentage}%)
              </Text>
            ))}
          </View>
        </Page>
      </Document>
    )
  } catch (error) {
    console.error('Error creating PDF:', error)
    return (
      <Document>
        <Page size="A4" style={styles.page}>
          <Text>Error generating PDF</Text>
        </Page>
      </Document>
    )
  }
}

export default AssessmentResultsPDF