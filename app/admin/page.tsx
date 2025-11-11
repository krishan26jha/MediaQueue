'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

type StaffRole = 'DOCTOR' | 'LAB' | 'STAFF' | 'ADMIN'

interface RoleInfo {
  id: StaffRole
  title: string
  description: string
  icon: React.ReactNode
  color: string
  sampleEmail: string
}

export default function StaffLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [selectedRole, setSelectedRole] = useState<StaffRole>('DOCTOR')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const roles: RoleInfo[] = [
    {
      id: 'DOCTOR',
      title: 'Doctor',
      description: 'Access patient records, manage appointments, and provide consultations',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
      color: 'blue',
      sampleEmail: 'doctor@example.com'
    },
    {
      id: 'LAB',
      title: 'Lab Technician',
      description: 'Manage lab tests, view requests, and upload results',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
        </svg>
      ),
      color: 'purple',
      sampleEmail: 'lab@example.com'
    },
    {
      id: 'STAFF',
      title: 'Nurse',
      description: 'Update patient vitals, assist doctors, and manage waiting room',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
        </svg>
      ),
      color: 'green',
      sampleEmail: 'nurse@example.com'
    },
    {
      id: 'ADMIN',
      title: 'Administrator',
      description: 'Manage hospital operations, staff accounts, and system settings',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: 'red',
      sampleEmail: 'admin@example.com'
    }
  ]

  const getSelectedRole = () => {
    return roles.find(role => role.id === selectedRole) || roles[0]
  }

  const useDemoCredentials = () => {
    const role = getSelectedRole()
    setEmail(role.sampleEmail)
    setPassword('password123')
  }

  // Validate email format
  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email || !password) {
      setError('Please enter both email and password')
      return
    }

    if (!isValidEmail(email)) {
      setError('Please enter a valid email address')
      return
    }

    setIsLoading(true)
    setError('')
    
    try {
      console.log('Attempting staff login with:', email, 'role:', selectedRole)
      
      // Simplified login - allow any valid email format without actual API call
      // Create simulated successful login with the selected role
      const userData = {
        id: `user_${Date.now()}`,
        name: email.split('@')[0].split('.').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
        email: email,
        role: selectedRole
      }
      
      // Store token and user data in localStorage
      localStorage.setItem('token', 'staff-token-' + Date.now())
      localStorage.setItem('user', JSON.stringify(userData))
      
      // Redirect based on user role
      if (selectedRole === 'DOCTOR') {
        router.push('/doctor/dashboard')
      } else if (selectedRole === 'LAB') {
        router.push('/lab')
      } else if (selectedRole === 'STAFF') {
        router.push('/staff/dashboard')
      } else if (selectedRole === 'ADMIN') {
        router.push('/admin/dashboard')
      } else {
        router.push('/admin')
      }
    } catch (error: any) {
      console.error('Login error:', error)
      setError(error.message || 'An error occurred during login. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const selectedRoleInfo = getSelectedRole()
  const roleColor = selectedRoleInfo.color
  const colorClasses = {
    blue: {
      bg: 'bg-blue-600',
      hover: 'hover:bg-blue-700',
      focus: 'focus:ring-blue-500',
      text: 'text-blue-600',
      badge: 'bg-blue-100 text-blue-800'
    },
    green: {
      bg: 'bg-green-600',
      hover: 'hover:bg-green-700',
      focus: 'focus:ring-green-500',
      text: 'text-green-600',
      badge: 'bg-green-100 text-green-800'
    },
    purple: {
      bg: 'bg-purple-600',
      hover: 'hover:bg-purple-700',
      focus: 'focus:ring-purple-500',
      text: 'text-purple-600',
      badge: 'bg-purple-100 text-purple-800'
    },
    red: {
      bg: 'bg-red-600',
      hover: 'hover:bg-red-700',
      focus: 'focus:ring-red-500',
      text: 'text-red-600',
      badge: 'bg-red-100 text-red-800'
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Staff Login
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Select your role and enter your credentials to access your account
          </p>
        </div>
        
        <div className="mt-8 bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">
              {error}
            </div>
          )}
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Your Role
            </label>
            
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {roles.map((role) => (
                <div
                  key={role.id}
                  onClick={() => setSelectedRole(role.id)}
                  className={`relative rounded-lg border p-4 cursor-pointer flex ${
                    selectedRole === role.id ? `border-${role.color}-500 bg-${role.color}-50` : 'border-gray-300'
                  } hover:border-gray-400`}
                >
                  <div className="flex items-center">
                    <div className={`flex-shrink-0 inline-flex items-center justify-center h-12 w-12 rounded-lg bg-${role.color}-100`}>
                      {role.icon}
                    </div>
                    <div className="ml-4">
                      <h3 className="text-sm font-medium text-gray-900">{role.title}</h3>
                      <div className={`mt-1 flex items-center ${selectedRole === role.id ? 'visible' : 'invisible'}`}>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colorClasses[role.color as keyof typeof colorClasses].badge}`}>
                          Selected
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="you@example.com"
                  required
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="••••••••"
                  required
                />
              </div>
              <p className="mt-1 text-xs text-gray-500">For demo purposes, any password will work.</p>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="text-sm">
                <button
                  type="button"
                  onClick={useDemoCredentials}
                  className={`font-medium ${colorClasses[roleColor as keyof typeof colorClasses].text} hover:underline`}
                >
                  Use demo credentials
                </button>
              </div>
            </div>
            
            <div>
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${colorClasses[roleColor as keyof typeof colorClasses].bg} ${colorClasses[roleColor as keyof typeof colorClasses].hover} focus:outline-none focus:ring-2 focus:ring-offset-2 ${colorClasses[roleColor as keyof typeof colorClasses].focus} disabled:opacity-75 disabled:cursor-not-allowed`}
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Signing in...
                  </div>
                ) : `Sign in as ${selectedRoleInfo.title}`}
              </button>
            </div>
          </form>
          
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Or
                </span>
              </div>
            </div>
            
            <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Link
                href="/login"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-blue-600 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Patient Login
              </Link>
              
              <Link
                href="/"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-gray-600 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                Back to Home
              </Link>
            </div>
          </div>
        </div>
        
        <div className="mt-6 text-center">
          <div className="text-xs text-gray-500">
            <p>Enter any valid email address to login as a staff member</p>
            <p>For quick access, use: {selectedRoleInfo.sampleEmail}</p>
          </div>
        </div>
      </div>
    </div>
  )
} 