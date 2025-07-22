'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { User } from '@supabase/supabase-js'
import { LogOut, Gauge, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

function TruckDashboardResultsContent() {
  const [user, setUser] = useState<User | null>(null)
  const [userProgress, setUserProgress] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()
  const { signOut } = useAuth()
  
  const handleSignOut = async () => {
    await signOut()
    router.push('/login')
  }

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }
      setUser(user)
      
      // Get user progress
      const { data: progress } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', user.id)
        .single()
      
      setUserProgress(progress)
      setLoading(false)
    }
    getUser()
  }, [router, supabase])

  if (loading || !userProgress) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400 mx-auto"></div>
          <p className="mt-4 text-gray-400">Starting your engine...</p>
        </div>
      </div>
    )
  }

  const totalScore = userProgress.spi_score || 0
  const tier = userProgress.current_tier || '90%'
  
  // Calculate RPM (0-8000) based on score
  const rpm = Math.round((totalScore / 100) * 8000)
  
  // Calculate Speed (0-80 mph) based on score
  const speed = Math.round((totalScore / 100) * 80)
  
  // Calculate Fuel efficiency - inverse relationship (lower score = more fuel needed)
  const fuelEfficiency = Math.round(3 + (totalScore / 100) * 5) // 3-8 MPG
  
  // Calculate probability of success
  const getProbabilityData = (score: number) => {
    if (score >= 85) return { percentage: 85 + Math.floor((score - 85) / 15 * 15), status: 'Optimal' }
    if (score >= 70) return { percentage: 70 + Math.floor((score - 70) / 15 * 15), status: 'Good' }
    if (score >= 50) return { percentage: 50 + Math.floor((score - 50) / 20 * 20), status: 'Fair' }
    if (score >= 30) return { percentage: 30 + Math.floor((score - 30) / 20 * 20), status: 'Needs Work' }
    return { percentage: 10 + Math.floor(score / 30 * 20), status: 'Critical' }
  }
  
  const probability = getProbabilityData(totalScore)

  // Get dimension scores for individual gauges
  const dimensions = [
    { name: 'Financial', score: userProgress.financial_foundation_score || 0, max: 35, icon: '💰' },
    { name: 'Market Intel', score: userProgress.market_intelligence_score || 0, max: 20, icon: '📊' },
    { name: 'Strengths', score: userProgress.personal_strengths_score || 0, max: 20, icon: '💪' },
    { name: 'Risk Mgmt', score: userProgress.risk_management_score || 0, max: 15, icon: '🛡️' },
    { name: 'Support', score: userProgress.support_systems_score || 0, max: 10, icon: '🤝' }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
      {/* Dashboard Header - styled like truck cab header */}
      <div className="bg-black border-b-4 border-yellow-500 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-4">
              <div className="text-yellow-400">
                <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18 18.5a1.5 1.5 0 01-1.5-1.5v-1h-13v1a1.5 1.5 0 01-3 0v-7c0-1.1.9-2 2-2h1.17l1.83-3.66a2 2 0 011.79-1.09h6.42c.75 0 1.44.42 1.79 1.09L17.33 8H18.5c1.1 0 2 .9 2 2v5.5a1.5 1.5 0 01-1.5 1.5M4.33 8h11.34l-1.34-2.67a.5.5 0 00-.45-.27H6.12a.5.5 0 00-.45.27L4.33 8z"/>
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">TRUCK OWNER READINESS DASHBOARD</h1>
                <p className="text-yellow-400 text-sm">Performance Metrics & Success Indicators</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-400">{user?.email}</span>
              <button
                onClick={handleSignOut}
                className="flex items-center text-gray-400 hover:text-white transition-colors"
              >
                <LogOut className="h-5 w-5 mr-1" />
                <span className="text-sm font-medium">Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Main Gauges Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Speedometer - SPI Score */}
          <div className="bg-gray-800 rounded-2xl p-6 border-2 border-gray-700 shadow-2xl">
            <h3 className="text-center text-yellow-400 font-bold mb-4">SUCCESS SPEED</h3>
            <div className="relative w-48 h-48 mx-auto">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="96" cy="96" r="88" stroke="#374151" strokeWidth="12" fill="none" />
                <circle 
                  cx="96" cy="96" r="88" 
                  stroke={totalScore >= 70 ? '#10b981' : totalScore >= 50 ? '#3b82f6' : '#ef4444'}
                  strokeWidth="12" 
                  fill="none"
                  strokeDasharray={`${(totalScore / 100) * 553} 553`}
                  className="transition-all duration-1000"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-5xl font-bold text-white">{speed}</span>
                <span className="text-gray-400 text-sm">MPH</span>
                <span className="text-yellow-400 font-semibold mt-2">{tier} TIER</span>
              </div>
            </div>
            <div className="text-center mt-4">
              <p className="text-gray-400 text-sm">SPI SCORE</p>
              <p className="text-2xl font-bold text-white">{totalScore}/100</p>
            </div>
          </div>

          {/* RPM Gauge - Success Probability */}
          <div className="bg-gray-800 rounded-2xl p-6 border-2 border-gray-700 shadow-2xl">
            <h3 className="text-center text-yellow-400 font-bold mb-4">SUCCESS ENGINE RPM</h3>
            <div className="relative w-48 h-48 mx-auto">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="96" cy="96" r="88" stroke="#374151" strokeWidth="12" fill="none" />
                <circle 
                  cx="96" cy="96" r="88" 
                  stroke={probability.percentage >= 70 ? '#10b981' : probability.percentage >= 50 ? '#3b82f6' : '#ef4444'}
                  strokeWidth="12" 
                  fill="none"
                  strokeDasharray={`${(probability.percentage / 100) * 553} 553`}
                  className="transition-all duration-1000"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-5xl font-bold text-white">{probability.percentage}</span>
                <span className="text-gray-400 text-sm">%</span>
                <span className={`font-semibold mt-2 ${
                  probability.status === 'Optimal' ? 'text-green-400' :
                  probability.status === 'Good' ? 'text-blue-400' :
                  probability.status === 'Fair' ? 'text-yellow-400' :
                  'text-red-400'
                }`}>{probability.status}</span>
              </div>
            </div>
            <div className="text-center mt-4">
              <p className="text-gray-400 text-sm">SUCCESS PROBABILITY</p>
              <p className="text-lg font-semibold text-white">Engine Performance</p>
            </div>
          </div>

          {/* Fuel Gauge - Efficiency Indicator */}
          <div className="bg-gray-800 rounded-2xl p-6 border-2 border-gray-700 shadow-2xl">
            <h3 className="text-center text-yellow-400 font-bold mb-4">BUSINESS EFFICIENCY</h3>
            <div className="relative w-48 h-48 mx-auto">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-40 h-40 bg-gray-700 rounded-full relative overflow-hidden">
                  <div 
                    className={`absolute bottom-0 left-0 right-0 transition-all duration-1000 ${
                      fuelEfficiency >= 7 ? 'bg-green-500' :
                      fuelEfficiency >= 5 ? 'bg-yellow-500' :
                      'bg-red-500'
                    }`}
                    style={{ height: `${(fuelEfficiency / 8) * 100}%` }}
                  ></div>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-bold text-white z-10">{fuelEfficiency}</span>
                    <span className="text-gray-300 text-sm z-10">MPG</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="text-center mt-4">
              <p className="text-gray-400 text-sm">RESOURCE EFFICIENCY</p>
              <p className="text-lg font-semibold text-white">
                {fuelEfficiency >= 7 ? 'Highly Efficient' :
                 fuelEfficiency >= 5 ? 'Moderate' :
                 'Needs Optimization'}
              </p>
            </div>
          </div>
        </div>

        {/* Warning Lights / Status Indicators */}
        <div className="bg-gray-800 rounded-2xl p-6 border-2 border-gray-700 shadow-2xl mb-8">
          <h3 className="text-yellow-400 font-bold mb-4 flex items-center">
            <AlertTriangle className="w-5 h-5 mr-2" />
            SYSTEM STATUS INDICATORS
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {dimensions.map((dim) => {
              const percentage = Math.round((dim.score / dim.max) * 100)
              const status = percentage >= 70 ? 'good' : percentage >= 50 ? 'warning' : 'critical'
              
              return (
                <div key={dim.name} className="text-center">
                  <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-2 ${
                    status === 'good' ? 'bg-green-900 border-2 border-green-500' :
                    status === 'warning' ? 'bg-yellow-900 border-2 border-yellow-500 animate-pulse' :
                    'bg-red-900 border-2 border-red-500 animate-pulse'
                  }`}>
                    <span className="text-2xl">{dim.icon}</span>
                  </div>
                  <p className="text-xs text-gray-400">{dim.name}</p>
                  <p className={`text-sm font-semibold ${
                    status === 'good' ? 'text-green-400' :
                    status === 'warning' ? 'text-yellow-400' :
                    'text-red-400'
                  }`}>{percentage}%</p>
                </div>
              )
            })}
          </div>
        </div>

        {/* Trip Computer / Detailed Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-gray-800 rounded-2xl p-6 border-2 border-gray-700 shadow-2xl">
            <h3 className="text-yellow-400 font-bold mb-4 flex items-center">
              <Gauge className="w-5 h-5 mr-2" />
              PERFORMANCE METRICS
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-gray-700">
                <span className="text-gray-400">Journey Progress</span>
                <span className="text-white font-semibold">{totalScore}% Complete</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-700">
                <span className="text-gray-400">Current Tier</span>
                <span className="text-yellow-400 font-semibold">{tier}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-700">
                <span className="text-gray-400">Miles to Next Tier</span>
                <span className="text-white font-semibold">
                  {tier === '90%' ? `${70 - totalScore} points` :
                   tier === '9%' ? `${85 - totalScore} points` :
                   'Destination Reached'}
                </span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-400">Estimated Time</span>
                <span className="text-white font-semibold">
                  {totalScore < 30 ? '18-24 months' :
                   totalScore < 50 ? '12-18 months' :
                   totalScore < 70 ? '6-12 months' :
                   'Maintenance Mode'}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-2xl p-6 border-2 border-gray-700 shadow-2xl">
            <h3 className="text-yellow-400 font-bold mb-4 flex items-center">
              <CheckCircle className="w-5 h-5 mr-2" />
              NEXT SERVICE ACTIONS
            </h3>
            <div className="space-y-3">
              {dimensions
                .sort((a, b) => (a.score / a.max) - (b.score / b.max))
                .slice(0, 3)
                .map((dim, index) => (
                  <div key={dim.name} className="flex items-start space-x-3">
                    <span className="text-yellow-400 font-bold">{index + 1}.</span>
                    <div className="flex-1">
                      <p className="text-white font-medium">{dim.name} System</p>
                      <p className="text-gray-400 text-sm">
                        Requires immediate attention - Currently at {Math.round((dim.score / dim.max) * 100)}%
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>

        {/* Update Assessment Button */}
        <div className="flex justify-center">
          <button
            onClick={() => router.push('/dashboard/comprehensive-assessment')}
            className="bg-yellow-500 hover:bg-yellow-400 text-black px-8 py-4 rounded-lg font-bold text-lg transition-colors flex items-center space-x-2"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
            <span>TUNE-UP YOUR ASSESSMENT</span>
          </button>
        </div>

        {/* Toggle to Classic View */}
        <div className="text-center mt-6">
          <button
            onClick={() => router.push('/dashboard/comprehensive-assessment/results')}
            className="text-gray-400 hover:text-white text-sm underline"
          >
            Switch to Classic View
          </button>
        </div>
      </main>
    </div>
  )
}

export default function TruckDashboardResults() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading dashboard...</div>
      </div>
    }>
      <TruckDashboardResultsContent />
    </Suspense>
  )
}