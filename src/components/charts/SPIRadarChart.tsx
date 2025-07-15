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
    const radius = (size * 0.35)

    // Clear canvas
    ctx.clearRect(0, 0, size, size)

    // Draw background circles
    for (let i = 1; i <= 5; i++) {
      ctx.beginPath()
      ctx.arc(centerX, centerY, (radius * i) / 5, 0, 2 * Math.PI)
      ctx.strokeStyle = '#e5e7eb'
      ctx.lineWidth = 1
      ctx.stroke()
    }

    // Draw dimension lines
    dimensions.forEach((dimension, index) => {
      const angle = (index * 2 * Math.PI) / dimensions.length - Math.PI / 2
      const x = centerX + radius * Math.cos(angle)
      const y = centerY + radius * Math.sin(angle)

      ctx.beginPath()
      ctx.moveTo(centerX, centerY)
      ctx.lineTo(x, y)
      ctx.strokeStyle = '#d1d5db'
      ctx.lineWidth = 1
      ctx.stroke()

      // Draw dimension labels
      ctx.save()
      ctx.translate(x, y)
      ctx.rotate(angle + Math.PI / 2)
      ctx.textAlign = 'center'
      ctx.font = '12px Inter'
      ctx.fillStyle = '#374151'
      ctx.fillText(dimension.name, 0, -10)
      ctx.restore()
    })

    // Draw current scores
    const currentPoints = dimensions.map((dimension, index) => {
      const angle = (index * 2 * Math.PI) / dimensions.length - Math.PI / 2
      const score = currentScores[dimension.name.toLowerCase().replace(' ', '_') as keyof SPIScores] || 0
      const percentage = score / dimension.maxScore
      const x = centerX + radius * percentage * Math.cos(angle)
      const y = centerY + radius * percentage * Math.sin(angle)
      return { x, y, score, dimension }
    })

    // Fill current scores area
    ctx.beginPath()
    currentPoints.forEach((point, index) => {
      if (index === 0) {
        ctx.moveTo(point.x, point.y)
      } else {
        ctx.lineTo(point.x, point.y)
      }
    })
    ctx.closePath()
    ctx.fillStyle = 'rgba(30, 58, 138, 0.2)'
    ctx.fill()
    ctx.strokeStyle = '#1e3a8a'
    ctx.lineWidth = 2
    ctx.stroke()

    // Draw current score points
    currentPoints.forEach(point => {
      ctx.beginPath()
      ctx.arc(point.x, point.y, 4, 0, 2 * Math.PI)
      ctx.fillStyle = '#1e3a8a'
      ctx.fill()
    })

    // Draw target scores if provided
    if (targetScores) {
      const targetPoints = dimensions.map((dimension, index) => {
        const angle = (index * 2 * Math.PI) / dimensions.length - Math.PI / 2
        const score = targetScores[dimension.name.toLowerCase().replace(' ', '_') as keyof SPIScores] || 0
        const percentage = score / dimension.maxScore
        const x = centerX + radius * percentage * Math.cos(angle)
        const y = centerY + radius * percentage * Math.sin(angle)
        return { x, y, score, dimension }
      })

      // Draw target score line
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
      ctx.lineWidth = 2
      ctx.setLineDash([5, 5])
      ctx.stroke()
      ctx.setLineDash([])

      // Draw target score points
      targetPoints.forEach(point => {
        ctx.beginPath()
        ctx.arc(point.x, point.y, 4, 0, 2 * Math.PI)
        ctx.fillStyle = '#f59e0b'
        ctx.fill()
      })
    }

  }, [currentScores, targetScores, size])

  return (
    <div className="flex flex-col items-center">
      <canvas
        ref={canvasRef}
        className="border border-gray-200 rounded-lg bg-white"
        style={{ width: size, height: size }}
      />
      <div className="mt-4 flex items-center space-x-6 text-sm">
        <div className="flex items-center">
          <div className="w-3 h-3 bg-[#1e3a8a] rounded-full mr-2"></div>
          <span>Current Score</span>
        </div>
        {targetScores && (
          <div className="flex items-center">
            <div className="w-3 h-3 bg-[#f59e0b] rounded-full mr-2"></div>
            <span>Target Score</span>
          </div>
        )}
      </div>
    </div>
  )
} 