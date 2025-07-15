'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Database } from '@/types/database'
import { 
  Users, 
  TrendingUp, 
  Target, 
  BarChart3, 
  Eye, 
  Mail, 
  Calendar,
  CheckCircle,
  Clock,
  AlertCircle,
  Shield,
  DollarSign,
  Activity
} from 'lucide-react'
import ShieldLogo from '@/components/ui/ShieldLogo'
import { useAuth } from '@/contexts/AuthContext'

type UserProgress = Database['public']['Tables']['user_progress']['Row']
type User = Database['public']['Tables']['profiles']['Row']

interface AdminStats {
  totalUsers: number
  activeUsers: number
  completedAssessments: number
  averageSPI: number
  tierDistribution: {
    '90%': number
    '9%': number
    '1%': number
  }
  recentSignups: number
  assessmentCompletion: {
    financial_foundation: number
    market_intelligence: number
    personal_strengths: number
    risk_management: number
    support_systems: number
  }
}

export default function AdminDashboard() {
  const { user: currentUser } = useAuth()
  const [users, setUsers] = useState<User[]>([])
  const [userProgress, setUserProgress] = useState<UserProgress[]>([])
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [showUserModal, setShowUserModal] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const checkAdminAccess = async () => {
      if (!currentUser) {
        router.push('/login')
        return
      }

      // Check if user is admin (you can customize this logic)
      const { data: userData } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', currentUser.id)
        .single()

      if (!userData || !userData.is_admin) {
        router.push('/dashboard')
        return
      }

      loadAdminData()
    }

    checkAdminAccess()
  }, [currentUser, router, supabase])

  const loadAdminData = async () => {
    try {
      // Load all users
      const { data: usersData } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false })

      // Load all user progress
      const { data: progressData } = await supabase
        .from('user_progress')
        .select('*')

      if (usersData) setUsers(usersData)
      if (progressData) setUserProgress(progressData)

      // Calculate stats
      calculateStats(usersData || [], progressData || [])
    } catch (error) {
      console.error('Error loading admin data:', error)
    } finally {
      setLoading(false)
    }
  }

  const calculateStats = (users: User[], progress: UserProgress[]) => {
    const now = new Date()
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)

    const stats: AdminStats = {
      totalUsers: users.length,
      activeUsers: users.filter(u => new Date(u.updated_at || u.created_at) > thirtyDaysAgo).length,
      completedAssessments: progress.reduce((sum, p) => {
        return sum + [
          p.financial_foundation_completed,
          p.market_intelligence_completed,
          p.personal_strengths_completed,
          p.risk_management_completed,
          p.support_systems_completed
        ].filter(Boolean).length
      }, 0),
      averageSPI: progress.length > 0 ? 
        Math.round(progress.reduce((sum, p) => sum + (p.financial_foundation_score || 0), 0) / progress.length) : 0,
      tierDistribution: {
        '90%': progress.filter(p => p.current_tier === '90%').length,
        '9%': progress.filter(p => p.current_tier === '9%').length,
        '1%': progress.filter(p => p.current_tier === '1%').length
      },
      recentSignups: users.filter(u => new Date(u.created_at) > thirtyDaysAgo).length,
      assessmentCompletion: {
        financial_foundation: progress.filter(p => p.financial_foundation_completed).length,
        market_intelligence: progress.filter(p => p.market_intelligence_completed).length,
        personal_strengths: progress.filter(p => p.personal_strengths_completed).length,
        risk_management: progress.filter(p => p.risk_management_completed).length,
        support_systems: progress.filter(p => p.support_systems_completed).length
      }
    }

    setStats(stats)
  }

  const getUserProgress = (userId: string) => {
    return userProgress.find(p => p.user_id === userId)
  }

  const getCompletionPercentage = (user: User) => {
    const progress = getUserProgress(user.id)
    if (!progress) return 0

    const completed = [
      progress.financial_foundation_completed,
      progress.market_intelligence_completed,
      progress.personal_strengths_completed,
      progress.risk_management_completed,
      progress.support_systems_completed
    ].filter(Boolean).length

    return Math.round((completed / 5) * 100)
  }

  const getStatusColor = (percentage: number) => {
    if (percentage >= 80) return 'text-green-600'
    if (percentage >= 50) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getStatusIcon = (percentage: number) => {
    if (percentage >= 80) return <CheckCircle className="h-4 w-4 text-green-600" />
    if (percentage >= 50) return <Clock className="h-4 w-4 text-yellow-600" />
    return <AlertCircle className="h-4 w-4 text-red-600" />
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading admin dashboard...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <button
                onClick={() => router.push('/')}
                className="flex items-center hover:opacity-80 transition-opacity"
              >
                <ShieldLogo width={120} height={40} className="mr-2" />
                <span className="text-xl font-bold text-[#1e3a8a]">Road to 1%</span>
              </button>
              <span className="ml-4 text-sm text-gray-500">Admin Dashboard</span>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push('/dashboard')}
                className="text-[#1e3a8a] hover:text-[#1e40af] transition-colors"
              >
                Back to Dashboard
              </button>
              <span className="text-sm text-gray-700">Admin: {currentUser?.email}</span>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-gradient-to-r from-[#1e3a8a] to-[#1e40af] rounded-lg shadow-lg p-8 text-white">
            <div className="flex items-center mb-4">
              <Shield className="h-8 w-8 mr-3" />
              <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            </div>
            <p className="text-blue-100">
              Monitor user progress, track engagement, and manage the Road to 1% community
            </p>
          </div>
        </div>

        {stats && (
          <>
            {/* Stats Overview */}
            <div className="px-4 py-6 sm:px-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white rounded-lg shadow-lg p-6">
                  <div className="flex items-center">
                    <Users className="h-8 w-8 text-[#1e3a8a] mr-3" />
                    <div>
                      <div className="text-2xl font-bold text-gray-900">{stats.totalUsers}</div>
                      <div className="text-sm text-gray-600">Total Users</div>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-lg p-6">
                  <div className="flex items-center">
                    <Activity className="h-8 w-8 text-[#f59e0b] mr-3" />
                    <div>
                      <div className="text-2xl font-bold text-gray-900">{stats.activeUsers}</div>
                      <div className="text-sm text-gray-600">Active (30 days)</div>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-lg p-6">
                  <div className="flex items-center">
                    <Target className="h-8 w-8 text-green-600 mr-3" />
                    <div>
                      <div className="text-2xl font-bold text-gray-900">{stats.completedAssessments}</div>
                      <div className="text-sm text-gray-600">Assessments Completed</div>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-lg p-6">
                  <div className="flex items-center">
                    <BarChart3 className="h-8 w-8 text-purple-600 mr-3" />
                    <div>
                      <div className="text-2xl font-bold text-gray-900">{stats.averageSPI}</div>
                      <div className="text-sm text-gray-600">Avg SPI Score</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Tier Distribution */}
            <div className="px-4 py-6 sm:px-0">
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Tier Distribution</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-3xl font-bold text-gray-600">{stats.tierDistribution['90%']}</div>
                    <div className="text-sm text-gray-600">90% Tier</div>
                    <div className="text-xs text-gray-500">Struggling (Drivers & O/Os)</div>
                  </div>
                  <div className="text-center p-4 bg-yellow-50 rounded-lg">
                    <div className="text-3xl font-bold text-[#f59e0b]">{stats.tierDistribution['9%']}</div>
                    <div className="text-sm text-gray-600">9% Tier</div>
                    <div className="text-xs text-gray-500">Building Success</div>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-3xl font-bold text-[#1e3a8a]">{stats.tierDistribution['1%']}</div>
                    <div className="text-sm text-gray-600">1% Tier</div>
                    <div className="text-xs text-gray-500">Elite Professionals</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Assessment Completion */}
            <div className="px-4 py-6 sm:px-0">
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Assessment Completion</h2>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-[#1e3a8a]">{stats.assessmentCompletion.financial_foundation}</div>
                    <div className="text-sm text-gray-600">Financial Foundation</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-[#1e40af]">{stats.assessmentCompletion.market_intelligence}</div>
                    <div className="text-sm text-gray-600">Market Intelligence</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-[#3b82f6]">{stats.assessmentCompletion.personal_strengths}</div>
                    <div className="text-sm text-gray-600">Personal Strengths</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-[#6366f1]">{stats.assessmentCompletion.risk_management}</div>
                    <div className="text-sm text-gray-600">Risk Management</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-[#8b5cf6]">{stats.assessmentCompletion.support_systems}</div>
                    <div className="text-sm text-gray-600">Support Systems</div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Users Table */}
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">User Management</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Progress
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tier
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Joined
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.map((user) => {
                    const progress = getUserProgress(user.id)
                    const completionPercentage = getCompletionPercentage(user)
                    
                    return (
                      <tr key={user.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <div className="h-10 w-10 rounded-full bg-[#1e3a8a] flex items-center justify-center">
                                <span className="text-white font-medium">
                                  {user.email?.charAt(0).toUpperCase()}
                                </span>
                              </div>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {user.email}
                              </div>
                              <div className="text-sm text-gray-500">
                                {user.first_name} {user.last_name}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            {getStatusIcon(completionPercentage)}
                            <span className={`ml-2 text-sm font-medium ${getStatusColor(completionPercentage)}`}>
                              {completionPercentage}% Complete
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="w-32 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-[#1e3a8a] h-2 rounded-full transition-all duration-500"
                              style={{ width: `${completionPercentage}%` }}
                            ></div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            progress?.current_tier === '1%' ? 'bg-blue-100 text-blue-800' :
                            progress?.current_tier === '9%' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {progress?.current_tier || 'Not Started'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(user.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => {
                              setSelectedUser(user)
                              setShowUserModal(true)
                            }}
                            className="text-[#1e3a8a] hover:text-[#1e40af] mr-3"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button className="text-gray-600 hover:text-gray-900">
                            <Mail className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>

      {/* User Detail Modal */}
      {showUserModal && selectedUser && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">User Details</h3>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-700">Email:</label>
                  <p className="text-sm text-gray-900">{selectedUser.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Name:</label>
                  <p className="text-sm text-gray-900">{selectedUser.first_name} {selectedUser.last_name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Joined:</label>
                  <p className="text-sm text-gray-900">{new Date(selectedUser.created_at).toLocaleDateString()}</p>
                </div>
                {getUserProgress(selectedUser.id) && (
                  <div>
                    <label className="text-sm font-medium text-gray-700">Progress:</label>
                    <p className="text-sm text-gray-900">
                      {getCompletionPercentage(selectedUser)}% Complete
                    </p>
                  </div>
                )}
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={() => setShowUserModal(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 