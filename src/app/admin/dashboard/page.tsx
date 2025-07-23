'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { 
  Users, 
  TrendingUp, 
  Award, 
  AlertCircle,
  BarChart3,
  Activity,
  Clock,
  Target,
  Search,
  Filter,
  Download,
  ChevronRight,
  UserCheck,
  UserX,
  ArrowLeft,
  Gauge
} from 'lucide-react'

interface UserMetrics {
  id: string
  email: string
  created_at: string
  last_sign_in_at: string
  spi_score: number
  current_tier: string
  financial_foundation_score: number
  market_intelligence_score: number
  risk_management_score: number
  support_systems_score: number
  assessment_date: string
  standout_strength_1: string
  standout_strength_2: string
}

interface DashboardStats {
  totalUsers: number
  completedAssessments: number
  averageSPIScore: number
  tier1Count: number
  tier9Count: number
  tier90Count: number
  newUsersThisWeek: number
  assessmentsThisWeek: number
}

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    completedAssessments: 0,
    averageSPIScore: 0,
    tier1Count: 0,
    tier9Count: 0,
    tier90Count: 0,
    newUsersThisWeek: 0,
    assessmentsThisWeek: 0
  })
  const [users, setUsers] = useState<UserMetrics[]>([])
  const [filteredUsers, setFilteredUsers] = useState<UserMetrics[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState<'score' | 'date' | 'email'>('score')
  const [filterTier, setFilterTier] = useState<'all' | '1%' | '9%' | '90%'>('all')
  
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    checkAdminAccess()
  }, [])

  const checkAdminAccess = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      router.push('/login')
      return
    }

    // Check if user is admin from database
    const { data: profile } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', user.id)
      .single()
    
    if (!profile?.is_admin) {
      router.push('/dashboard')
      return
    }

    setIsAdmin(true)
    await loadDashboardData()
  }

  const loadDashboardData = async () => {
    try {
      // Get all users with their assessment data
      const { data: userData, error: userError } = await supabase
        .from('profiles')
        .select(`
          id,
          email,
          created_at,
          user_progress (
            spi_score,
            current_tier,
            financial_foundation_score,
            market_intelligence_score,
            risk_management_score,
            support_systems_score
          ),
          comprehensive_assessments (
            assessment_date,
            standout_strength_1,
            standout_strength_2
          )
        `)

      if (userError) {
        console.error('Error fetching user data:', userError)
        throw userError
      }

      console.log('Fetched user data:', userData)

      // Note: We can't get last sign in data without admin API access
      // You would need to set up a server endpoint or use Supabase edge functions for this

      // Process user data
      const processedUsers: UserMetrics[] = userData?.map(user => {
        const progress = user.user_progress?.[0]
        const assessment = user.comprehensive_assessments?.[0]

        return {
          id: user.id,
          email: user.email,
          created_at: user.created_at,
          last_sign_in_at: '', // Would need admin API for this
          spi_score: progress?.spi_score || 0,
          current_tier: progress?.current_tier || '90%',
          financial_foundation_score: progress?.financial_foundation_score || 0,
          market_intelligence_score: progress?.market_intelligence_score || 0,
          risk_management_score: progress?.risk_management_score || 0,
          support_systems_score: progress?.support_systems_score || 0,
          assessment_date: assessment?.assessment_date || '',
          standout_strength_1: assessment?.standout_strength_1 || '',
          standout_strength_2: assessment?.standout_strength_2 || ''
        }
      }) || []

      setUsers(processedUsers)
      setFilteredUsers(processedUsers)

      // Calculate stats
      const totalUsers = processedUsers.length
      const completedAssessments = processedUsers.filter(u => u.spi_score > 0).length
      const averageSPIScore = completedAssessments > 0 
        ? Math.round(processedUsers.reduce((sum, u) => sum + u.spi_score, 0) / completedAssessments)
        : 0

      const tier1Count = processedUsers.filter(u => u.current_tier === '1%').length
      const tier9Count = processedUsers.filter(u => u.current_tier === '9%').length
      const tier90Count = processedUsers.filter(u => u.current_tier === '90%').length

      // Calculate weekly stats
      const oneWeekAgo = new Date()
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)

      const newUsersThisWeek = processedUsers.filter(u => 
        new Date(u.created_at) > oneWeekAgo
      ).length

      const assessmentsThisWeek = processedUsers.filter(u => 
        u.assessment_date && new Date(u.assessment_date) > oneWeekAgo
      ).length

      setStats({
        totalUsers,
        completedAssessments,
        averageSPIScore,
        tier1Count,
        tier9Count,
        tier90Count,
        newUsersThisWeek,
        assessmentsThisWeek
      })

      console.log('Dashboard stats:', {
        totalUsers,
        completedAssessments,
        processedUsersLength: processedUsers.length,
        rawDataLength: userData?.length
      })

      setLoading(false)
    } catch (error) {
      console.error('Error loading dashboard data:', error)
      setLoading(false)
    }
  }

  // Filter and sort users
  useEffect(() => {
    let filtered = [...users]

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(user => 
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Apply tier filter
    if (filterTier !== 'all') {
      filtered = filtered.filter(user => user.current_tier === filterTier)
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'score':
          return b.spi_score - a.spi_score
        case 'date':
          return new Date(b.assessment_date || 0).getTime() - new Date(a.assessment_date || 0).getTime()
        case 'email':
          return a.email.localeCompare(b.email)
        default:
          return 0
      }
    })

    setFilteredUsers(filtered)
  }, [searchTerm, sortBy, filterTier, users])

  const exportToCSV = () => {
    const headers = ['Email', 'SPI Score', 'Tier', 'Financial', 'Market Intel', 'Risk Mgmt', 'Support', 'Strengths', 'Assessment Date']
    const rows = filteredUsers.map(user => [
      user.email,
      user.spi_score,
      user.current_tier,
      user.financial_foundation_score,
      user.market_intelligence_score,
      user.risk_management_score,
      user.support_systems_score,
      `${user.standout_strength_1} + ${user.standout_strength_2}`,
      user.assessment_date || 'Not completed'
    ])

    const csv = [headers, ...rows].map(row => row.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `spi-users-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  if (!isAdmin) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Monitor user progress and system metrics
                </p>
              </div>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => router.push('/dashboard')}
                  className="flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </button>
                <button
                  onClick={exportToCSV}
                  className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export CSV
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* No Data Message */}
        {stats.totalUsers === 0 && (
          <div className="mb-8 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6">
            <div className="flex items-start">
              <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mt-0.5 mr-3" />
              <div>
                <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">No User Data Found</h3>
                <div className="mt-2 text-sm text-yellow-700 dark:text-yellow-300">
                  <p>The dashboard is working, but there's no user data to display. This could be because:</p>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>No users have registered yet</li>
                    <li>Row Level Security (RLS) policies might be blocking data access</li>
                    <li>Database tables might be empty</li>
                  </ul>
                  <p className="mt-3">Check the browser console for detailed logs, or run the test queries in <code className="bg-yellow-100 dark:bg-yellow-800 px-1 rounded">test_admin_data.sql</code></p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Users */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Users</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{stats.totalUsers}</p>
                <p className="text-xs text-green-600 dark:text-green-400 mt-2">
                  +{stats.newUsersThisWeek} this week
                </p>
              </div>
              <div className="p-3 bg-indigo-100 dark:bg-indigo-900 rounded-lg">
                <Users className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
              </div>
            </div>
          </div>

          {/* Completed Assessments */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Assessments</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{stats.completedAssessments}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  {Math.round((stats.completedAssessments / stats.totalUsers) * 100)}% completion
                </p>
              </div>
              <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
                <Target className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </div>

          {/* Average SPI Score */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Avg SPI Score</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{stats.averageSPIScore}</p>
                <p className="text-xs text-blue-600 dark:text-blue-400 mt-2">
                  Out of 100 points
                </p>
              </div>
              <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <Gauge className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </div>

          {/* Weekly Activity */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Weekly Activity</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{stats.assessmentsThisWeek}</p>
                <p className="text-xs text-purple-600 dark:text-purple-400 mt-2">
                  New assessments
                </p>
              </div>
              <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-lg">
                <Activity className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Tier Distribution */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Tier Distribution</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="relative inline-flex items-center justify-center w-32 h-32">
                <svg className="w-32 h-32 transform -rotate-90">
                  <circle cx="64" cy="64" r="56" stroke="#e5e7eb" strokeWidth="8" fill="none" />
                  <circle
                    cx="64" cy="64" r="56"
                    stroke="#dc2626"
                    strokeWidth="8"
                    fill="none"
                    strokeDasharray={`${(stats.tier1Count / stats.totalUsers) * 352} 352`}
                  />
                </svg>
                <span className="absolute text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.tier1Count}
                </span>
              </div>
              <p className="mt-2 text-sm font-medium text-gray-900 dark:text-white">Top 1%</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Elite Performers</p>
            </div>

            <div className="text-center">
              <div className="relative inline-flex items-center justify-center w-32 h-32">
                <svg className="w-32 h-32 transform -rotate-90">
                  <circle cx="64" cy="64" r="56" stroke="#e5e7eb" strokeWidth="8" fill="none" />
                  <circle
                    cx="64" cy="64" r="56"
                    stroke="#3b82f6"
                    strokeWidth="8"
                    fill="none"
                    strokeDasharray={`${(stats.tier9Count / stats.totalUsers) * 352} 352`}
                  />
                </svg>
                <span className="absolute text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.tier9Count}
                </span>
              </div>
              <p className="mt-2 text-sm font-medium text-gray-900 dark:text-white">Top 9%</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">High Performers</p>
            </div>

            <div className="text-center">
              <div className="relative inline-flex items-center justify-center w-32 h-32">
                <svg className="w-32 h-32 transform -rotate-90">
                  <circle cx="64" cy="64" r="56" stroke="#e5e7eb" strokeWidth="8" fill="none" />
                  <circle
                    cx="64" cy="64" r="56"
                    stroke="#6b7280"
                    strokeWidth="8"
                    fill="none"
                    strokeDasharray={`${(stats.tier90Count / stats.totalUsers) * 352} 352`}
                  />
                </svg>
                <span className="absolute text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.tier90Count}
                </span>
              </div>
              <p className="mt-2 text-sm font-medium text-gray-900 dark:text-white">Bottom 90%</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Building Foundation</p>
            </div>
          </div>
        </div>

        {/* User Table */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">User Details</h2>
              
              <div className="flex flex-col sm:flex-row gap-4">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>

                {/* Tier Filter */}
                <select
                  value={filterTier}
                  onChange={(e) => setFilterTier(e.target.value as any)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="all">All Tiers</option>
                  <option value="1%">Top 1%</option>
                  <option value="9%">Top 9%</option>
                  <option value="90%">Bottom 90%</option>
                </select>

                {/* Sort */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="score">Sort by Score</option>
                  <option value="date">Sort by Date</option>
                  <option value="email">Sort by Email</option>
                </select>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    SPI Score
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Tier
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Strengths
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Dimension Scores
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Assessment Date
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {user.email}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          Joined {new Date(user.created_at).toLocaleDateString()}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className="text-lg font-semibold text-gray-900 dark:text-white">
                          {user.spi_score}
                        </span>
                        <span className="text-sm text-gray-500 dark:text-gray-400 ml-1">/100</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        user.current_tier === '1%' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                        user.current_tier === '9%' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                        'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                      }`}>
                        {user.current_tier}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {user.standout_strength_1 && user.standout_strength_2 ? (
                        <div className="text-xs">
                          <div className="font-medium text-gray-900 dark:text-white">
                            {user.standout_strength_1}
                          </div>
                          <div className="text-gray-500 dark:text-gray-400">
                            + {user.standout_strength_2}
                          </div>
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400 dark:text-gray-500">Not selected</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="grid grid-cols-2 gap-1 text-xs">
                        <div>
                          <span className="text-gray-500 dark:text-gray-400">F:</span>
                          <span className="font-medium text-gray-900 dark:text-white ml-1">
                            {user.financial_foundation_score}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-500 dark:text-gray-400">M:</span>
                          <span className="font-medium text-gray-900 dark:text-white ml-1">
                            {user.market_intelligence_score}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-500 dark:text-gray-400">R:</span>
                          <span className="font-medium text-gray-900 dark:text-white ml-1">
                            {user.risk_management_score}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-500 dark:text-gray-400">S:</span>
                          <span className="font-medium text-gray-900 dark:text-white ml-1">
                            {user.support_systems_score}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {user.assessment_date ? (
                        <div className="flex items-center text-sm text-gray-900 dark:text-white">
                          <UserCheck className="h-4 w-4 text-green-500 mr-2" />
                          {new Date(user.assessment_date).toLocaleDateString()}
                        </div>
                      ) : (
                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                          <UserX className="h-4 w-4 text-gray-400 mr-2" />
                          Not completed
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Table Footer */}
          <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Showing <span className="font-medium">{filteredUsers.length}</span> of{' '}
              <span className="font-medium">{users.length}</span> users
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}