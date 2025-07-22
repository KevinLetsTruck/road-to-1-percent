'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { CheckCircle, ArrowRight, Mail, Lock, Phone, User, Eye, EyeOff } from 'lucide-react'

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const supabase = createClient()

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters')
      setLoading(false)
      return
    }

    try {
      const { error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            first_name: formData.firstName,
            last_name: formData.lastName,
            phone: formData.phone,
          },
          emailRedirectTo: `${window.location.origin}/login`,
        },
      })

      if (error) throw error
      
      // Sign in the user immediately after registration
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      })

      if (signInError) throw signInError

      if (signInData.user) {
        // Check if profile already exists
        const { data: existingProfile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', signInData.user.id)
          .single()

        // Create or update profile
        if (!existingProfile) {
          const { error: profileError } = await supabase.from('profiles').insert({
            id: signInData.user.id,
            email: formData.email,
            first_name: formData.firstName,
            last_name: formData.lastName,
            phone: formData.phone,
          })
          
          if (profileError) {
            console.error('Profile creation error:', profileError)
            throw new Error('Failed to create user profile')
          }
        } else {
          // Update existing profile
          const { error: updateError } = await supabase
            .from('profiles')
            .update({
              email: formData.email,
              first_name: formData.firstName,
              last_name: formData.lastName,
              phone: formData.phone,
              updated_at: new Date().toISOString(),
            })
            .eq('id', signInData.user.id)
            
          if (updateError) {
            console.error('Profile update error:', updateError)
            throw new Error('Failed to update user profile')
          }
        }
        
        // Check if user progress exists
        const { data: existingProgress } = await supabase
          .from('user_progress')
          .select('*')
          .eq('user_id', signInData.user.id)
          .single()
          
        // Create user progress record if it doesn't exist
        if (!existingProgress) {
          const { error: progressError } = await supabase.from('user_progress').insert({
            user_id: signInData.user.id,
          })
          
          if (progressError) {
            console.error('User progress creation error:', progressError)
            throw new Error('Failed to create user progress record')
          }
        }
        
        // Clear any client-side cache
        router.refresh()
        
        // Redirect directly to assessment
        router.push('/dashboard')
      } else {
        throw new Error('Failed to sign in after registration')
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message)
      } else {
        setError('An unexpected error occurred.')
      }
    } finally {
      setLoading(false)
    }
  }

  const benefits = [
    'Comprehensive financial assessment',
    'Personalized development path',
    'Peer support groups',
    'Expert mentorship',
    'Progress tracking',
    'Exclusive resources'
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4 py-8">
      <div className="max-w-4xl w-full">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          {/* Left Side - Benefits */}
          <div className="order-2 md:order-1">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              Transform Your Driving Career
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
              Join the Road to 1% program and unlock your full potential as a professional driver.
            </p>

            <div className="space-y-4 mb-8">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-center">
                  <div className="flex-shrink-0 w-6 h-6 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                  </div>
                  <span className="ml-3 text-gray-700 dark:text-gray-300">{benefit}</span>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white/50 dark:bg-gray-800/30 backdrop-blur p-4 rounded-xl border border-gray-200 dark:border-gray-700">
                <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">500+</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Active Drivers</p>
              </div>
              <div className="bg-white/50 dark:bg-gray-800/30 backdrop-blur p-4 rounded-xl border border-gray-200 dark:border-gray-700">
                <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">87%</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Success Rate</p>
              </div>
              <div className="bg-white/50 dark:bg-gray-800/30 backdrop-blur p-4 rounded-xl border border-gray-200 dark:border-gray-700">
                <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">4.9</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Rating</p>
              </div>
            </div>
          </div>

          {/* Right Side - Form */}
          <div className="order-1 md:order-2">
            <div className="bg-white dark:bg-gray-800/50 backdrop-blur rounded-2xl shadow-xl dark:shadow-2xl p-8 border border-gray-200 dark:border-gray-700">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">Create Your Account</h2>
              
              <form onSubmit={handleRegister} className="space-y-4">
                {/* Name Fields */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      First Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
                      <input
                        type="text"
                        value={formData.firstName}
                        onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                        className="w-full pl-9 pr-3 py-2 bg-gray-50 dark:bg-gray-900/50 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 transition-colors"
                        placeholder="John"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Last Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
                      <input
                        type="text"
                        value={formData.lastName}
                        onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                        className="w-full pl-9 pr-3 py-2 bg-gray-50 dark:bg-gray-900/50 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 transition-colors"
                        placeholder="Doe"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Email Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full pl-10 pr-3 py-2 bg-gray-50 dark:bg-gray-900/50 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 transition-colors"
                      placeholder="you@example.com"
                      required
                    />
                  </div>
                </div>

                {/* Phone Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      className="w-full pl-10 pr-3 py-2 bg-gray-50 dark:bg-gray-900/50 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 transition-colors"
                      placeholder="(555) 123-4567"
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={(e) => setFormData({...formData, password: e.target.value})}
                      className="w-full pl-10 pr-10 py-2 bg-gray-50 dark:bg-gray-900/50 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 transition-colors"
                      placeholder="Min. 6 characters"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 focus:outline-none"
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Confirm Password Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                      className="w-full pl-10 pr-10 py-2 bg-gray-50 dark:bg-gray-900/50 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 transition-colors"
                      placeholder="Confirm your password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 focus:outline-none"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-lg text-sm">
                    {error}
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-indigo-600 dark:bg-indigo-500 text-white py-3 rounded-lg font-medium hover:bg-indigo-700 dark:hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 dark:focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center transform hover:scale-[1.02] active:scale-[0.98] shadow-lg"
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Creating Account...
                    </span>
                  ) : (
                    <>
                      Start Your Journey
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </>
                  )}
                </button>
              </form>

              {/* Sign In Link */}
              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Already have an account?{' '}
                  <Link href="/login" className="font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 transition-colors">
                    Sign in
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Text */}
        <p className="mt-8 text-center text-xs text-gray-500 dark:text-gray-400">
          By creating an account, you agree to our{' '}
          <Link href="/terms" className="font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300">
            Terms of Service
          </Link>{' '}
          and{' '}
          <Link href="/privacy" className="font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300">
            Privacy Policy
          </Link>
        </p>
      </div>
    </div>
  )
}