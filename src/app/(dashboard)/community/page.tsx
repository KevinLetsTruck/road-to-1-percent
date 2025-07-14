'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { User } from '@supabase/supabase-js'
import { ArrowLeft, TrendingUp, Users, MessageCircle, MapPin } from 'lucide-react'

interface CommunityMember {
  id: string
  name: string
  tier: string
  location: string
  joinDate: string
  avatar?: string
}

export default function CommunityPage() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  // Mock data for demonstration
  const communityMembers: CommunityMember[] = [
    {
      id: '1',
      name: 'Sarah Johnson',
      tier: '1%',
      location: 'Los Angeles, CA',
      joinDate: '2024-01-15',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face'
    },
    {
      id: '2',
      name: 'Mike Chen',
      tier: '9%',
      location: 'New York, NY',
      joinDate: '2024-02-01',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
    },
    {
      id: '3',
      name: 'Emily Rodriguez',
      tier: '90%',
      location: 'Chicago, IL',
      joinDate: '2024-02-10',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face'
    },
    {
      id: '4',
      name: 'David Thompson',
      tier: '1%',
      location: 'Houston, TX',
      joinDate: '2024-01-20',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
    },
    {
      id: '5',
      name: 'Lisa Wang',
      tier: '9%',
      location: 'Seattle, WA',
      joinDate: '2024-02-05',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face'
    }
  ]

  const peerGroups = [
    {
      id: '1',
      name: 'West Coast Elite',
      members: 12,
      tier: '1%',
      description: 'High-performing drivers from the West Coast',
      location: 'California, Oregon, Washington'
    },
    {
      id: '2',
      name: 'East Coast Masters',
      members: 8,
      tier: '9%',
      description: 'Experienced drivers from the East Coast',
      location: 'New York, New Jersey, Pennsylvania'
    },
    {
      id: '3',
      name: 'Midwest Rising',
      members: 15,
      tier: '90%',
      description: 'New drivers building their foundation',
      location: 'Illinois, Michigan, Ohio'
    }
  ]

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        router.push('/login')
        return
      }
      
      setUser(user)
      setLoading(false)
    }

    getUser()
  }, [router, supabase])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  const getTierColor = (tier: string) => {
    switch (tier) {
      case '1%': return 'text-purple-600 bg-purple-100'
      case '9%': return 'text-blue-600 bg-blue-100'
      case '90%': return 'text-gray-600 bg-gray-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <button
                onClick={() => router.back()}
                className="mr-4 p-2 rounded-md hover:bg-gray-100"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <TrendingUp className="h-8 w-8 text-indigo-600 mr-2" />
              <span className="text-xl font-bold text-gray-900">Community</span>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Community Stats */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Road to 1% Community</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-indigo-600 mb-2">500+</div>
                <div className="text-gray-600">Active Members</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">25</div>
                <div className="text-gray-600">Peer Groups</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">87%</div>
                <div className="text-gray-600">Success Rate</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">4.9</div>
                <div className="text-gray-600">Average Rating</div>
              </div>
            </div>

            <p className="text-gray-600 text-center">
              Connect with fellow drivers, share experiences, and support each other on your journey to the 1%.
            </p>
          </div>

          {/* Peer Groups */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Peer Groups</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {peerGroups.map((group) => (
                <div key={group.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">{group.name}</h3>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTierColor(group.tier)}`}>
                      {group.tier}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-4">{group.description}</p>
                  <div className="flex items-center text-sm text-gray-500 mb-4">
                    <MapPin className="w-4 h-4 mr-1" />
                    {group.location}
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-sm text-gray-500">
                      <Users className="w-4 h-4 mr-1" />
                      {group.members} members
                    </div>
                    <button className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 flex items-center">
                      <UserPlus className="w-4 h-4 mr-1" />
                      Join
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Community Members */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Members</h2>
            <div className="space-y-4">
              {communityMembers.map((member) => (
                <div key={member.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                  <div className="flex items-center">
                    <img
                      src={member.avatar}
                      alt={member.name}
                      className="w-12 h-12 rounded-full mr-4"
                    />
                    <div>
                      <h3 className="font-medium text-gray-900">{member.name}</h3>
                      <div className="flex items-center text-sm text-gray-500">
                        <MapPin className="w-4 h-4 mr-1" />
                        {member.location}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTierColor(member.tier)}`}>
                      {member.tier}
                    </span>
                    <button className="text-indigo-600 hover:text-indigo-700">
                      <MessageCircle className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Call to Action */}
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg shadow-lg p-8 mt-8 text-white text-center">
            <h2 className="text-2xl font-bold mb-4">Ready to Connect?</h2>
            <p className="text-indigo-100 mb-6">
              Join a peer group and start building meaningful connections with fellow drivers.
            </p>
            <button className="bg-white text-indigo-600 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors">
              Explore Groups
            </button>
          </div>
        </div>
      </main>
    </div>
  )
} 