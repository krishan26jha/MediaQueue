'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userRole, setUserRole] = useState<string | null>(null)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname() || ''
  const router = useRouter()

  useEffect(() => {
    // Check if user is logged in and get their role
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/check')
        if (response.ok) {
          const data = await response.json()
          setIsLoggedIn(true)
          setUserRole(data.role)
        } else {
          setIsLoggedIn(false)
          setUserRole(null)
        }
      } catch (error) {
        console.error('Auth check failed:', error)
        setIsLoggedIn(false)
        setUserRole(null)
      }
    }

    checkAuth()
  }, [])

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMenuOpen(false)
  }, [pathname])

  const isActive = (path: string) => {
    return pathname === path ? 'text-primary-600 border-b-2 border-primary-600' : 'text-gray-600 hover:text-primary-600'
  }

  const handleSignOut = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      setIsLoggedIn(false)
      setUserRole(null)
      router.push('/')
    } catch (error) {
      console.error('Sign out failed:', error)
    }
  }

  const getDashboardLink = () => {
    if (!isLoggedIn) return '/'
    switch (userRole) {
      case 'PATIENT':
        return '/patient/dashboard'
      case 'DOCTOR':
        return '/doctor/dashboard'
      case 'ADMIN':
        return '/admin/dashboard'
      case 'LAB_TECH':
        return '/lab/dashboard'
      case 'NURSE':
        return '/nurse/dashboard'
      default:
        return '/'
    }
  }

  return (
    <nav className="bg-white shadow-md fixed w-full top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center flex-shrink-0">
            <Link href="/" className="flex items-center">
              <img 
                src="/images/logo.png" 
                alt="MediQueue Logo" 
                className="h-8 w-auto mr-2"
              />
              <span className="text-2xl font-bold text-primary-600">MediQueue</span>
            </Link>
          </div>
          
          {/* Navigation Links - desktop */}
          <div className="hidden md:flex md:items-center md:justify-center flex-1 px-8">
            <div className="flex space-x-8">
              <Link 
                href="/" 
                className={`inline-flex items-center px-1 pt-1 border-b-2 ${
                  pathname === '/' ? 'border-primary-600 text-primary-600' : 'border-transparent text-gray-600 hover:text-primary-600 hover:border-primary-300'
                }`}
              >
                Home
              </Link>
              <Link 
                href="/about" 
                className={`inline-flex items-center px-1 pt-1 border-b-2 ${
                  pathname === '/about' ? 'border-primary-600 text-primary-600' : 'border-transparent text-gray-600 hover:text-primary-600 hover:border-primary-300'
                }`}
              >
                About
              </Link>
              <Link 
                href="/contact" 
                className={`inline-flex items-center px-1 pt-1 border-b-2 ${
                  pathname === '/contact' ? 'border-primary-600 text-primary-600' : 'border-transparent text-gray-600 hover:text-primary-600 hover:border-primary-300'
                }`}
              >
                Contact
              </Link>
              {isLoggedIn && (
                <Link 
                  href={getDashboardLink()} 
                  className={`inline-flex items-center px-1 pt-1 border-b-2 ${
                    pathname.includes('dashboard') ? 'border-primary-600 text-primary-600' : 'border-transparent text-gray-600 hover:text-primary-600 hover:border-primary-300'
                  }`}
                >
                  Dashboard
                </Link>
              )}
            </div>
          </div>

          {/* Auth buttons - desktop */}
          <div className="hidden md:flex md:items-center">
            {!isLoggedIn ? (
              <>
                <Link 
                  href="/login" 
                  className={`inline-flex items-center px-4 py-2 rounded-md ${
                    pathname === '/login' ? 'bg-primary-100 text-primary-600' : 'text-gray-600 hover:text-primary-600'
                  }`}
                >
                  Login
                </Link>
                <Link 
                  href="/register" 
                  className="ml-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
                >
                  Register
                </Link>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <button
                  onClick={handleSignOut}
                  className="text-gray-600 hover:text-primary-600"
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-500 hover:text-primary-600 hover:bg-primary-50 focus:outline-none"
              aria-controls="mobile-menu"
              aria-expanded={isMenuOpen ? 'true' : 'false'}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <span className="sr-only">Open main menu</span>
              {/* Menu open: "hidden", Menu closed: "block" */}
              <svg
                className={`${isMenuOpen ? 'hidden' : 'block'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              {/* Menu open: "block", Menu closed: "hidden" */}
              <svg
                className={`${isMenuOpen ? 'block' : 'hidden'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`${isMenuOpen ? 'block' : 'hidden'} md:hidden`}
        id="mobile-menu"
      >
        <div className="pt-2 pb-3 space-y-1">
          <Link 
            href="/" 
            className={`block px-3 py-2 ${
              pathname === '/' ? 'bg-primary-50 text-primary-600' : 'text-gray-600 hover:bg-primary-50 hover:text-primary-600'
            }`}
          >
            Home
          </Link>
          <Link 
            href="/about" 
            className={`block px-3 py-2 ${
              pathname === '/about' ? 'bg-primary-50 text-primary-600' : 'text-gray-600 hover:bg-primary-50 hover:text-primary-600'
            }`}
          >
            About
          </Link>
          <Link 
            href="/contact" 
            className={`block px-3 py-2 ${
              pathname === '/contact' ? 'bg-primary-50 text-primary-600' : 'text-gray-600 hover:bg-primary-50 hover:text-primary-600'
            }`}
          >
            Contact
          </Link>
          {isLoggedIn && (
            <Link 
              href={getDashboardLink()} 
              className={`block px-3 py-2 ${
                pathname.includes('dashboard') ? 'bg-primary-50 text-primary-600' : 'text-gray-600 hover:bg-primary-50 hover:text-primary-600'
              }`}
            >
              Dashboard
            </Link>
          )}
        </div>
        
        {/* Mobile auth buttons */}
        <div className="pt-4 pb-3 border-t border-gray-200">
          <div className="px-2 space-y-1">
            {!isLoggedIn ? (
              <>
                <Link 
                  href="/login" 
                  className={`block px-3 py-2 ${
                    pathname === '/login' ? 'bg-primary-50 text-primary-600' : 'text-gray-600 hover:bg-primary-50 hover:text-primary-600'
                  }`}
                >
                  Login
                </Link>
                <Link 
                  href="/register" 
                  className="block px-3 py-2 text-primary-600 hover:bg-primary-50"
                >
                  Register
                </Link>
              </>
            ) : (
              <button
                onClick={handleSignOut}
                className="block w-full text-left px-3 py-2 text-gray-600 hover:bg-primary-50 hover:text-primary-600"
              >
                Sign Out
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}