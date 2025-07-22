'use client'

import { useEffect, useRef } from 'react'

interface SPIScores {
  financial_foundation: number
  market_intelligence: number
  personal_strengths: number
  risk_management: number
  support_systems: number
}

interface SPIRadarChartProps {
  currentScores: SPIScores
  targetScores?: SPIScores
  size?: number
}

export default function SPIRadarChart({ 
  currentScores, 
  targetScores, 
  size = 300 
}: SPIRadarChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const dimensions = [
    { name: 'Financial Foundation', maxScore: 35, color: '#1e3a8a' },
    { name: 'Market Intelligence', maxScore: 20, color: '#1e40af' },
    { name: 'Personal Strengths', maxScore: 20, color: '#3b82f6' },
    { name: 'Risk Management', maxScore: 15, color: '#6366f1' },
    { name: 'Support Systems', maxScore: 10, color: '#8b5cf6' }
  ]

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas size
    canvas.width = size
    canvas.height = size

    const centerX = size / 2
    const centerY = size / 2
    const outerRadius = (size * 0.4) // Tire outer radius
    const innerRadius = (size * 0.15) // Tire inner radius (rim)
    const treadRadius = (size * 0.35) // Tread area radius

    // Clear canvas
    ctx.clearRect(0, 0, size, size)

    // Draw tire shadow
    ctx.beginPath()
    ctx.arc(centerX + 3, centerY + 3, outerRadius, 0, 2 * Math.PI)
    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)'
    ctx.fill()

    // Draw tire outer edge (sidewall)
    ctx.beginPath()
    ctx.arc(centerX, centerY, outerRadius, 0, 2 * Math.PI)
    ctx.fillStyle = '#2d3748'
    ctx.fill()

    // Draw tire tread area background
    ctx.beginPath()
    ctx.arc(centerX, centerY, treadRadius, 0, 2 * Math.PI)
    ctx.fillStyle = '#1a202c'
    ctx.fill()

    // Draw tire tread pattern (concentric circles)
    for (let i = 1; i <= 5; i++) {
      const treadRingRadius = innerRadius + (treadRadius - innerRadius) * (i / 5)
      ctx.beginPath()
      ctx.arc(centerX, centerY, treadRingRadius, 0, 2 * Math.PI)
      ctx.strokeStyle = '#4a5568'
      ctx.lineWidth = 2
      ctx.stroke()
    }

    // Draw tread grooves (radial lines)
    dimensions.forEach((dimension, index) => {
      const angle = (index * 2 * Math.PI) / dimensions.length - Math.PI / 2
      const startX = centerX + innerRadius * Math.cos(angle)
      const startY = centerY + innerRadius * Math.sin(angle)
      const endX = centerX + treadRadius * Math.cos(angle)
      const endY = centerY + treadRadius * Math.sin(angle)

      // Draw tread groove
      ctx.beginPath()
      ctx.moveTo(startX, startY)
      ctx.lineTo(endX, endY)
      ctx.strokeStyle = '#4a5568'
      ctx.lineWidth = 3
      ctx.stroke()

      // Draw dimension labels
      ctx.save()
      ctx.translate(endX + 15 * Math.cos(angle), endY + 15 * Math.sin(angle))
      ctx.rotate(angle + Math.PI / 2)
      ctx.textAlign = 'center'
      ctx.font = 'bold 11px Inter'
      ctx.fillStyle = '#2d3748'
      ctx.fillText(dimension.name, 0, 0)
      ctx.restore()
    })

    // Draw rim (inner circle)
    ctx.beginPath()
    ctx.arc(centerX, centerY, innerRadius, 0, 2 * Math.PI)
    ctx.fillStyle = '#718096'
    ctx.fill()

    // Draw rim details (spokes)
    for (let i = 0; i < 8; i++) {
      const angle = (i * 2 * Math.PI) / 8
      const startX = centerX + (innerRadius * 0.3) * Math.cos(angle)
      const startY = centerY + (innerRadius * 0.3) * Math.sin(angle)
      const endX = centerX + innerRadius * Math.cos(angle)
      const endY = centerY + innerRadius * Math.sin(angle)

      ctx.beginPath()
      ctx.moveTo(startX, startY)
      ctx.lineTo(endX, endY)
      ctx.strokeStyle = '#4a5568'
      ctx.lineWidth = 2
      ctx.stroke()
    }

    // Draw rim center
    ctx.beginPath()
    ctx.arc(centerX, centerY, innerRadius * 0.3, 0, 2 * Math.PI)
    ctx.fillStyle = '#2d3748'
    ctx.fill()

    // Draw current scores (tire pressure visualization)
    const currentPoints = dimensions.map((dimension, index) => {
      const angle = (index * 2 * Math.PI) / dimensions.length - Math.PI / 2
      const score = currentScores[dimension.name.toLowerCase().replace(' ', '_') as keyof SPIScores] || 0
      const percentage = score / dimension.maxScore
      const radius = innerRadius + (treadRadius - innerRadius) * percentage
      const x = centerX + radius * Math.cos(angle)
      const y = centerY + radius * Math.sin(angle)
      return { x, y, score, dimension, radius }
    })

    // Fill current scores area (tire pressure)
    ctx.beginPath()
    currentPoints.forEach((point, index) => {
      if (index === 0) {
        ctx.moveTo(point.x, point.y)
      } else {
        ctx.lineTo(point.x, point.y)
      }
    })
    ctx.closePath()
    ctx.fillStyle = 'rgba(30, 58, 138, 0.3)'
    ctx.fill()
    ctx.strokeStyle = '#1e3a8a'
    ctx.lineWidth = 3
    ctx.stroke()

    // Draw current score points (pressure indicators)
    currentPoints.forEach(point => {
      // Draw pressure indicator
      ctx.beginPath()
      ctx.arc(point.x, point.y, 6, 0, 2 * Math.PI)
      ctx.fillStyle = '#1e3a8a'
      ctx.fill()
      ctx.strokeStyle = '#ffffff'
      ctx.lineWidth = 2
      ctx.stroke()

      // Draw score text
      ctx.save()
      ctx.translate(point.x, point.y)
      ctx.textAlign = 'center'
      ctx.font = 'bold 10px Inter'
      ctx.fillStyle = '#ffffff'
      ctx.fillText(point.score.toString(), 0, 3)
      ctx.restore()
    })

    // Draw target scores if provided (optimal pressure)
    if (targetScores) {
      const targetPoints = dimensions.map((dimension, index) => {
        const angle = (index * 2 * Math.PI) / dimensions.length - Math.PI / 2
        const score = targetScores[dimension.name.toLowerCase().replace(' ', '_') as keyof SPIScores] || 0
        const percentage = score / dimension.maxScore
        const radius = innerRadius + (treadRadius - innerRadius) * percentage
        const x = centerX + radius * Math.cos(angle)
        const y = centerY + radius * Math.sin(angle)
        return { x, y, score, dimension, radius }
      })

      // Draw target score line (optimal pressure line)
      ctx.beginPath()
      targetPoints.forEach((point, index) => {
        if (index === 0) {
          ctx.moveTo(point.x, point.y)
        } else {
          ctx.lineTo(point.x, point.y)
        }
      })
      ctx.closePath()
      ctx.strokeStyle = '#f59e0b'
      ctx.lineWidth = 3
      ctx.setLineDash([8, 4])
      ctx.stroke()
      ctx.setLineDash([])

      // Draw target score points (optimal pressure indicators)
      targetPoints.forEach(point => {
        ctx.beginPath()
        ctx.arc(point.x, point.y, 4, 0, 2 * Math.PI)
        ctx.fillStyle = '#f59e0b'
        ctx.fill()
        ctx.strokeStyle = '#ffffff'
        ctx.lineWidth = 1
        ctx.stroke()
      })
    }

    // Add tire branding
    ctx.save()
    ctx.translate(centerX, centerY + outerRadius + 20)
    ctx.textAlign = 'center'
    ctx.font = 'bold 14px Inter'
    ctx.fillStyle = '#2d3748'
    ctx.fillText('ROAD TO 1%', 0, 0)
    ctx.font = '10px Inter'
    ctx.fillStyle = '#718096'
    ctx.fillText('SPI TRACKING TIRE', 0, 15)
    ctx.restore()

  }, [currentScores, targetScores, size])

  return (
    <div className="flex flex-col items-center">
      <canvas
        ref={canvasRef}
        className="border border-gray-200 rounded-lg bg-white shadow-lg"
        style={{ width: size, height: size }}
      />
      <div className="mt-4 flex items-center space-x-6 text-sm">
        <div className="flex items-center">
          <div className="w-3 h-3 bg-[#1e3a8a] rounded-full mr-2"></div>
          <span>Current Pressure</span>
        </div>
        {targetScores && (
          <div className="flex items-center">
            <div className="w-3 h-3 bg-[#f59e0b] rounded-full mr-2"></div>
            <span>Optimal Pressure</span>
          </div>
        )}
      </div>
    </div>
  )
} 