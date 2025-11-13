'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { BookOpen, Mail, Lock, LogIn, AlertCircle } from 'lucide-react'
import { useSearchParams } from 'next/navigation'

export default function LoginPage() {
  const searchParams = useSearchParams()
  const role = searchParams.get('role') || 'student'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    // Simulate login process
    setTimeout(() => {
      if (!email || !password) {
        setError('Please fill in all fields')
        setIsLoading(false)
        return
      }

      // For demo purposes, accept any email/password
      if (role === 'student') {
        window.location.href = '/student/assignments'
      } else {
        window.location.href = '/lecturer/assignments'
      }
      setIsLoading(false)
    }, 1000)
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-dark to-secondary items-center justify-center p-12">
        <div className="text-white text-center">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <BookOpen size={48} />
            <h1 className="text-5xl font-bold">StudyHub</h1>
          </div>
          <p className="text-xl text-gray-300 mb-4">Assignment & Study Management Platform</p>
          <p className="text-gray-400">
            Streamline academic collaboration between students and lecturers
          </p>

          {/* Features List */}
          <div className="mt-12 space-y-4 text-left max-w-md">
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
              <p>Manage assignments and deadlines efficiently</p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
              <p>Coordinate group projects seamlessly</p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
              <p>Track your academic progress and grades</p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
              <p>Share and access study materials</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 bg-light">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-dark mb-2">Welcome Back</h2>
            <p className="text-gray-600">Sign in as {role === 'student' ? 'Student' : 'Lecturer'}</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-3">
              <AlertCircle size={20} className="text-red-600 mt-0.5 flex-shrink-0" />
              <span className="text-red-700 text-sm">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Input */}
            <div>
              <label className="block text-sm font-semibold text-dark mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 text-gray-400" size={20} />
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-sm font-semibold text-dark mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 text-gray-400" size={20} />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center space-x-2 text-gray-700">
                <input type="checkbox" className="rounded" disabled={isLoading} />
                <span>Remember me</span>
              </label>
              <button
                type="button"
                className="text-primary hover:text-secondary transition-colors disabled:opacity-50"
                disabled={isLoading}
              >
                Forgot password?
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary text-white font-semibold py-2 rounded-lg hover:bg-secondary transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              <LogIn size={20} />
              <span>{isLoading ? 'Signing in...' : 'Sign In'}</span>
            </button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center">
            <div className="flex-1 border-t border-gray-300"></div>
            <span className="px-3 text-gray-500 text-sm">Demo Credentials</span>
            <div className="flex-1 border-t border-gray-300"></div>
          </div>

          {/* Demo Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-blue-900 font-semibold mb-2">Try demo login:</p>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>Email: <code className="font-mono bg-white px-2 py-1 rounded">demo@example.com</code></li>
              <li>Password: <code className="font-mono bg-white px-2 py-1 rounded">demo123</code></li>
            </ul>
          </div>

          {/* Role Switch */}
          <div className="text-center text-sm text-gray-600">
            Not a {role}?{' '}
            <Link
              href={`/auth/login?role=${role === 'student' ? 'lecturer' : 'student'}`}
              className="text-primary hover:text-secondary font-semibold transition-colors"
            >
              Sign in as {role === 'student' ? 'Lecturer' : 'Student'}
            </Link>
          </div>

          {/* Back to Home */}
          <div className="text-center mt-4">
            <Link href="/" className="text-gray-600 hover:text-dark text-sm transition-colors">
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
