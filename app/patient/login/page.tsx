'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'

export default function PatientLogin() {
  const router = useRouter()
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    setIsLoading(true)
    setError('')
    
    try {
      if (isLogin) {
        // Handle login
        const response = await fetch('/api/auth', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email,
            password,
          }),
        })
        
        const data = await response.json()
        
        if (!response.ok) {
          throw new Error(data.error || 'Login failed')
        }
        
        if (data.success) {
          // Store token and user data in localStorage
          localStorage.setItem('authToken', data.token)
          localStorage.setItem('user', JSON.stringify(data.user))
          
          // Redirect to patient dashboard
          router.push('/patient/profile')
        } else {
          throw new Error('Login failed')
        }
      } else {
        // Handle registration
        const response = await fetch('/api/patients', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name,
            email,
            password,
            phone,
          }),
        })
        
        const data = await response.json()
        
        if (!response.ok) {
          throw new Error(data.error || 'Registration failed')
        }
        
        if (data.success) {
          // Auto-login after successful registration
          const loginResponse = await fetch('/api/auth', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email,
              password,
            }),
          })
          
          const loginData = await loginResponse.json()
          
          if (loginResponse.ok && loginData.success) {
            localStorage.setItem('authToken', loginData.token)
            localStorage.setItem('user', JSON.stringify(loginData.user))
            router.push('/patient/profile')
          } else {
            // Registration succeeded but login failed, switch to login mode
            setIsLogin(true)
            setError('Registration successful! Please sign in.')
          }
        } else {
          throw new Error('Registration failed')
        }
      }
    } catch (error: any) {
      setError(error.message || 'An error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 py-12 px-4 sm:px-6 lg:px-8 flex flex-col justify-center pt-20">
      <div className="max-w-4xl mx-auto w-full">
        <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
          <div className="md:flex">
            {/* Left side - Image and information */}
            <div className="md:w-1/2 bg-gradient-to-br from-blue-600 to-cyan-600 text-white p-8 md:p-12 flex flex-col justify-between relative">
              <div className="absolute inset-0 opacity-10 z-0">
                <div className="absolute inset-0 bg-[url('/images/patient-pattern.png')] bg-repeat opacity-20"></div>
              </div>
              
              <div className="relative z-10">
                <div className="flex items-center mb-8">
                  <div className="h-10 w-10 bg-white rounded-full flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-blue-600">
                      <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
                    </svg>
                  </div>
                  <h2 className="ml-3 text-xl font-bold">MediQueue</h2>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold mb-4">
                  {isLogin ? 'Welcome Back' : 'Create Account'}
                </h1>
                <p className="text-blue-100 mb-6">
                  {isLogin 
                    ? 'Sign in to access your queue status, appointments, and medical records.'
                    : 'Register to manage your hospital visits, track wait times, and access your medical information.'}
                </p>
                
                <div className="bg-blue-700/30 rounded-lg p-5 backdrop-blur-sm">
                  <h3 className="font-semibold text-lg mb-2">Patient Benefits</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 mt-0.5 text-blue-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Real-time updates on your queue position</span>
                    </li>
                    <li className="flex items-start">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 mt-0.5 text-blue-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Secure access to your medical records</span>
                    </li>
                    <li className="flex items-start">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 mt-0.5 text-blue-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Appointment scheduling and reminders</span>
                    </li>
                  </ul>
                </div>
              </div>
              
              <div className="relative z-10 mt-8">
                <p className="text-sm text-blue-100">
                  "I love being able to check my position in the queue from my phone. It's saved me hours of waiting in the hospital."
                </p>
                <div className="mt-4 flex items-center">
                  <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold text-sm">SP</div>
                  <div className="ml-3">
                    <p className="text-sm font-medium">Sarah P.</p>
                    <p className="text-xs text-blue-200">Patient</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Right side - Login/Registration form */}
            <div className="md:w-1/2 p-8 md:p-12">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900">
                  {isLogin ? 'Patient Login' : 'Patient Registration'}
                </h2>
                <p className="mt-2 text-gray-600">
                  {isLogin 
                    ? 'Access your patient portal' 
                    : 'Create your account to get started'}
                </p>
              </div>
              
              <div className="mb-6">
                <div className="flex rounded-md shadow-sm">
                  <button
                    type="button"
                    onClick={() => setIsLogin(true)}
                    className={`w-1/2 py-2 px-4 text-sm font-medium rounded-l-md focus:outline-none ${
                      isLogin 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Login
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsLogin(false)}
                    className={`w-1/2 py-2 px-4 text-sm font-medium rounded-r-md focus:outline-none ${
                      !isLogin 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Register
                  </button>
                </div>
              </div>
              
              {/* Demo Credentials */}
              {isLogin && (
                <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
                  <h3 className="text-sm font-medium text-blue-800 mb-2">Demo Patient Account</h3>
                  <p className="text-sm text-blue-600 mb-2">
                    <strong>Email:</strong> patient@demo.com<br />
                    <strong>Password:</strong> demo1234
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setEmail('patient@demo.com')
                      setPassword('demo1234')
                    }}
                    className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded hover:bg-blue-200"
                  >
                    Use Demo Credentials
                  </button>
                </div>
              )}
              
              {/* Error Display */}
              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">
                  {error}
                </div>
              )}
              
              <form onSubmit={handleSubmit} className="space-y-6">
                {!isLogin && (
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                      Full Name
                    </label>
                    <div className="mt-1">
                      <input
                        id="name"
                        name="name"
                        type="text"
                        autoComplete="name"
                        required={!isLogin}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-3 border"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email address
                  </label>
                  <div className="mt-1">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-3 border"
                    />
                  </div>
                </div>

                {!isLogin && (
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                      Phone Number
                    </label>
                    <div className="mt-1">
                      <input
                        id="phone"
                        name="phone"
                        type="tel"
                        autoComplete="tel"
                        required={!isLogin}
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-3 border"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <div className="mt-1">
                    <input
                      id="password"
                      name="password"
                      type="password"
                      autoComplete={isLogin ? "current-password" : "new-password"}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-3 border"
                    />
                  </div>
                </div>

                {isLogin && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <input
                        id="remember-me"
                        name="remember-me"
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                        Remember me
                      </label>
                    </div>

                    <div className="text-sm">
                      <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
                        Forgot password?
                      </a>
                    </div>
                  </div>
                )}

                {error && <p className="text-sm text-red-600">{error}</p>}

                <div>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`flex w-full justify-center rounded-md bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                  >
                    {isLoading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        {isLogin ? 'Signing in...' : 'Creating account...'}
                      </>
                    ) : (
                      isLogin ? 'Sign in' : 'Create account'
                    )}
                  </button>
                </div>
              </form>
              
              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="bg-white px-2 text-gray-500">Or</span>
                  </div>
                </div>

                <div className="mt-6 text-center text-sm">
                  <Link href="/" className="font-medium text-blue-600 hover:text-blue-500">
                    Return to homepage
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 