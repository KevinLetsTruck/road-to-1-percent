'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/contexts/AuthContext'

interface SPIProgressChartProps {
  timeframe: '3m' | '6m' | '1y'
}

interface ChartData {
  date: string
  score: number
  label: string
}

export default function SPIProgressChart({ timeframe }: SPIProgressChartProps) {
  const { user } = useAuth()
  const [chartData, setChartData] = useState<ChartData[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    if (!user) return

    const loadChartData = async () => {
      try {
        // Get comprehensive assessments for the user
        const { data: assessments } = await supabase
          .from('comprehensive_assessments')
          .select('assessment_date, total_spi_score')
          .eq('user_id', user.id)
          .order('assessment_date', { ascending: true })

        // Get quarterly assessments for the user
        const { data: quarterlyAssessments } = await supabase
          .from('quarterly_assessments')
          .select('assessment_date, total_score')
          .eq('user_id', user.id)
          .order('assessment_date', { ascending: true })

        // Combine and process data
        const allData: ChartData[] = []

        // Add comprehensive assessments
        assessments?.forEach((assessment: any) => {
          allData.push({
            date: assessment.assessment_date,
            score: assessment.total_spi_score,
            label: 'Comprehensive'
          })
        })

        // Add quarterly assessments
        quarterlyAssessments?.forEach((assessment: any) => {
          allData.push({
            date: assessment.assessment_date,
            score: assessment.total_score,
            label: 'Quarterly'
          })
        })

        // Sort by date
        allData.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

        // Filter by timeframe
        const now = new Date()
        const timeframeMap = {
          '3m': new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000),
          '6m': new Date(now.getTime() - 180 * 24 * 60 * 60 * 1000),
          '1y': new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000)
        }

        const filteredData = allData.filter(item => 
          new Date(item.date) >= timeframeMap[timeframe]
        )

        // If no data, create sample data
        if (filteredData.length === 0) {
          const sampleData: ChartData[] = []
          const months = timeframe === '3m' ? 3 : timeframe === '6m' ? 6 : 12
          
          for (let i = months; i >= 0; i--) {
            const date = new Date()
            date.setMonth(date.getMonth() - i)
            sampleData.push({
              date: date.toISOString(),
              score: Math.floor(Math.random() * 40) + 60, // Random score between 60-100
              label: 'Sample'
            })
          }
          setChartData(sampleData)
        } else {
          setChartData(filteredData)
        }

        setLoading(false)
      } catch (error) {
        console.error('Error loading chart data:', error)
        setLoading(false)
      }
    }

    loadChartData()
  }, [user, timeframe, supabase])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (chartData.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        No data available for this timeframe
      </div>
    )
  }

  const maxScore = Math.max(...chartData.map(d => d.score))
  const minScore = Math.min(...chartData.map(d => d.score))

  return (
    <div className="w-full h-full">
      <div className="flex items-end justify-between h-full space-x-2">
        {chartData.map((data, index) => {
          const height = maxScore > minScore 
            ? ((data.score - minScore) / (maxScore - minScore)) * 100
            : 50
          
          return (
            <div key={index} className="flex-1 flex flex-col items-center">
              <div className="relative group">
                <div 
                  className="bg-gradient-to-t from-blue-600 to-blue-400 rounded-t-lg transition-all duration-300 hover:from-blue-700 hover:to-blue-500"
                  style={{ height: `${Math.max(height, 10)}%` }}
                ></div>
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  {data.score}/100
                  <br />
                  {new Date(data.date).toLocaleDateString()}
                </div>
              </div>
              <div className="text-xs text-gray-500 mt-2 text-center">
                {new Date(data.date).toLocaleDateString('en-US', { 
                  month: 'short',
                  day: 'numeric'
                })}
              </div>
            </div>
          )
        })}
      </div>
      
      {/* Y-axis labels */}
      <div className="flex justify-between text-xs text-gray-500 mt-2">
        <span>{Math.round(minScore)}</span>
        <span>{Math.round((maxScore + minScore) / 2)}</span>
        <span>{Math.round(maxScore)}</span>
      </div>
    </div>
  )
} 