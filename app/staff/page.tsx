'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function StaffRedirect() {
  const router = useRouter()
  
  useEffect(() => {
    // Redirect to staff login page
    router.replace('/staff/login')
  }, [router])
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-50">
      <div className="text-center">
        <div className="mb-4">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
        </div>
        <h1 className="text-xl font-semibold text-gray-900">Redirecting to staff login...</h1>
        <p className="mt-2 text-gray-600">Please wait, you're being redirected to the staff login page.</p>
      </div>
    </div>
  )
} 