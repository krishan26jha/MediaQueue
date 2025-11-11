'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import QueueContent from '../../components/admin/QueueContent'
import AnalyticsContent from '../../components/admin/AnalyticsContent'
import StaffContent from '../../components/admin/StaffContent'
import DepartmentsContent from '../../components/admin/DepartmentsContent'
import SettingsContent from '../../components/admin/SettingsContent'

// Mock data for the dashboard
const MOCK_QUEUE_DATA = {
  totalPatients: 58,
  waitingPatients: 23,
  inProgressPatients: 12,
  completedToday: 23,
  averageWaitTime: 37, // minutes
  currentLoad: 72, // percentage
  emergencyCases: 3,
  departments: [
    { id: 'd1', name: 'General Medicine', patients: 12, averageWait: 42 },
    { id: 'd2', name: 'Pediatrics', patients: 8, averageWait: 31 },
    { id: 'd3', name: 'Orthopedics', patients: 5, averageWait: 45 },
    { id: 'd4', name: 'Cardiology', patients: 7, averageWait: 52 },
    { id: 'd5', name: 'Neurology', patients: 4, averageWait: 60 },
  ],
  recentPatients: [
    { id: 'p1', name: 'Amit Kumar', status: 'WAITING', urgency: 'NORMAL', waitTime: 25, position: 4 },
    { id: 'p2', name: 'Priya Sharma', status: 'IN_PROGRESS', urgency: 'HIGH', waitTime: 10, position: 0 },
    { id: 'p3', name: 'Rahul Gupta', status: 'WAITING', urgency: 'LOW', waitTime: 45, position: 8 },
    { id: 'p4', name: 'Neha Patel', status: 'WAITING', urgency: 'EMERGENCY', waitTime: 5, position: 1 },
    { id: 'p5', name: 'Vijay Singh', status: 'WAITING', urgency: 'NORMAL', waitTime: 33, position: 6 },
  ],
  aiInsights: [
    'Current wait times are 15% higher than usual for AIIMS Delhi at this time of day',
    'Predicted peak load time today: 14:30 - 16:00',
    'Consider adding 2 more staff members to Pediatrics to reduce wait times',
    'Emergency case trend is 30% higher than last week at Safdarjung Hospital',
    'Queue efficiency has improved by 12% since implementing AI scheduling at Apollo Hospitals',
  ],
  hourlyPredictions: [
    { hour: '09:00', patients: 15 },
    { hour: '10:00', patients: 22 },
    { hour: '11:00', patients: 25 },
    { hour: '12:00', patients: 28 },
    { hour: '13:00', patients: 30 },
    { hour: '14:00', patients: 35 },
    { hour: '15:00', patients: 32 },
    { hour: '16:00', patients: 25 },
    { hour: '17:00', patients: 20 },
    { hour: '18:00', patients: 15 },
  ],
}

export default function AdminDashboard() {
  const [currentTab, setCurrentTab] = useState('overview')
  const [queueData, setQueueData] = useState(MOCK_QUEUE_DATA)
  const [isLoading, setIsLoading] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  
  // Handle clicking outside mobile menu to close it
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) { // lg breakpoint
        setIsMobileMenuOpen(false)
      }
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])
  
  // Simulate periodic data refresh
  useEffect(() => {
    const intervalId = setInterval(() => {
      // In a real app, we would fetch fresh data from an API here
      // For demo, we'll just make small random adjustments to the mock data
      setQueueData(prev => ({
        ...prev,
        waitingPatients: prev.waitingPatients + Math.floor(Math.random() * 3) - 1,
        inProgressPatients: prev.inProgressPatients + Math.floor(Math.random() * 3) - 1,
        currentLoad: Math.min(100, Math.max(50, prev.currentLoad + Math.floor(Math.random() * 5) - 2)),
        averageWaitTime: Math.max(20, prev.averageWaitTime + Math.floor(Math.random() * 5) - 2),
      }))
    }, 30000) // Update every 30 seconds
    
    return () => clearInterval(intervalId)
  }, [])
  
  const refreshData = () => {
    setIsLoading(true)
    // Simulate API call with a delay
    setTimeout(() => {
      setQueueData({
        ...queueData,
        waitingPatients: queueData.waitingPatients + Math.floor(Math.random() * 5) - 2,
        inProgressPatients: queueData.inProgressPatients + Math.floor(Math.random() * 3) - 1,
        completedToday: queueData.completedToday + Math.floor(Math.random() * 2),
        currentLoad: Math.min(100, Math.max(50, queueData.currentLoad + Math.floor(Math.random() * 8) - 4)),
        averageWaitTime: Math.max(20, queueData.averageWaitTime + Math.floor(Math.random() * 7) - 3),
      })
      setIsLoading(false)
    }, 1000)
  }
  
  // Format a number as hours:minutes
  const formatTime = (minutes: number): string => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    
    if (hours > 0) {
      return `${hours}h ${mins}m`
    }
    return `${mins}m`
  }
  
  const getStatusColor = (status: string): string => {
    switch(status) {
      case 'WAITING': return 'bg-yellow-100 text-yellow-800'
      case 'IN_PROGRESS': return 'bg-blue-100 text-blue-800'
      case 'COMPLETED': return 'bg-green-100 text-green-800'
      case 'CANCELLED': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }
  
  const getUrgencyColor = (urgency: string): string => {
    switch(urgency) {
      case 'LOW': return 'bg-green-100 text-green-800'
      case 'NORMAL': return 'bg-blue-100 text-blue-800'
      case 'HIGH': return 'bg-orange-100 text-orange-800'
      case 'EMERGENCY': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }
  
  const getLoadColor = (load: number): string => {
    if (load < 60) return 'text-green-600'
    if (load < 80) return 'text-yellow-600'
    return 'text-red-600'
  }
  
  return (
    <div className="min-h-screen bg-gray-100 pt-16">
      <div className="flex">
        {/* Mobile menu overlay */}
        {isMobileMenuOpen && (
          <div
            className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}
        
        {/* Sidebar */}
        <div className={`
          fixed inset-y-0 left-0 z-50 w-64 bg-primary-800 text-white transform transition-transform duration-300 ease-in-out
          lg:relative lg:translate-x-0 lg:z-0
          flex flex-col
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        `}>
          <div className="p-8 border-b border-primary-700">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <h1 className="text-2xl font-bold truncate">MediQueue</h1>
                <p className="text-primary-200 text-sm">Admin Dashboard</p>
              </div>
              {/* Close button for mobile */}
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="lg:hidden p-2 rounded-md text-primary-200 hover:text-white hover:bg-primary-700 flex-shrink-0"
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
          
          <nav className="mt-4 flex-1 overflow-y-auto">
            <div className="px-3 mb-2 text-xs font-semibold text-primary-200 uppercase tracking-wider">
              Main
            </div>
            <button 
              onClick={() => {
                setCurrentTab('overview')
                setIsMobileMenuOpen(false)
              }}
              className={`block w-full text-left py-2.5 px-4 transition-colors ${currentTab === 'overview' ? 'bg-primary-700' : 'hover:bg-primary-700'}`}
            >
              Overview
            </button>
            <button 
              onClick={() => {
                setCurrentTab('queue')
                setIsMobileMenuOpen(false)
              }}
              className={`block w-full text-left py-2.5 px-4 transition-colors ${currentTab === 'queue' ? 'bg-primary-700' : 'hover:bg-primary-700'}`}
            >
              Queue Management
            </button>
            <button 
              onClick={() => {
                setCurrentTab('analytics')
                setIsMobileMenuOpen(false)
              }}
              className={`block w-full text-left py-2.5 px-4 transition-colors ${currentTab === 'analytics' ? 'bg-primary-700' : 'hover:bg-primary-700'}`}
            >
              Analytics
            </button>
            
            <div className="px-3 mt-4 mb-2 text-xs font-semibold text-primary-200 uppercase tracking-wider">
              Administration
            </div>
            <button 
              onClick={() => {
                setCurrentTab('staff')
                setIsMobileMenuOpen(false)
              }}
              className={`block w-full text-left py-2.5 px-4 transition-colors ${currentTab === 'staff' ? 'bg-primary-700' : 'hover:bg-primary-700'}`}
            >
              Staff Management
            </button>
            <button 
              onClick={() => {
                setCurrentTab('departments')
                setIsMobileMenuOpen(false)
              }}
              className={`block w-full text-left py-2.5 px-4 transition-colors ${currentTab === 'departments' ? 'bg-primary-700' : 'hover:bg-primary-700'}`}
            >
              Departments
            </button>
            <button 
              onClick={() => {
                setCurrentTab('settings')
                setIsMobileMenuOpen(false)
              }}
              className={`block w-full text-left py-2.5 px-4 transition-colors ${currentTab === 'settings' ? 'bg-primary-700' : 'hover:bg-primary-700'}`}
            >
              Settings
            </button>
          </nav>
          
          <div className="flex-shrink-0 p-3 border-t border-primary-700">
            <Link href="/" className="block text-primary-200 hover:text-white transition-colors">
              Back to Site →
            </Link>
          </div>
        </div>
        
        {/* Main content */}
        <div className="flex-1 lg:ml-0">
          {/* Header */}
          <header className="bg-white shadow-sm">
            <div className="flex justify-between items-center px-4 py-8 lg:px-8 lg:pt-12 lg:pb-4">
              {/* Mobile menu button */}
              <div className="flex items-center">
                <button
                  onClick={() => setIsMobileMenuOpen(true)}
                  className="lg:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 mr-3"
                >
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
                <h1 className="text-xl lg:text-2xl font-semibold text-gray-800">
                  {currentTab === 'overview' && 'Dashboard Overview'}
                  {currentTab === 'queue' && 'Queue Management'}
                  {currentTab === 'analytics' && 'Analytics & Insights'}
                  {currentTab === 'staff' && 'Staff Management'}
                  {currentTab === 'departments' && 'Departments'}
                  {currentTab === 'settings' && 'Settings'}
                </h1>
              </div>
              
              <div className="flex items-center space-x-3">
                <button 
                  onClick={refreshData}
                  className="flex items-center px-2 py-1 bg-white border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <svg className={`h-4 w-4 mr-1 ${isLoading ? 'animate-spin' : ''}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Refresh
                </button>
                
                <div className="relative">
                  <button className="flex items-center focus:outline-none">
                    <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center text-gray-700">
                      A
                    </div>
                    <span className="ml-2 text-sm text-gray-700">Admin</span>
                    <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </header>
          
          {/* Main dashboard content */}
          <main className="p-4 lg:p-8">
            {currentTab === 'overview' && (
              <div className="space-y-6">
                {/* Stats row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                  <div className="bg-white shadow rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-500">Total Patients Today</p>
                        <p className="text-3xl font-bold text-gray-900">{queueData.totalPatients}</p>
                      </div>
                      <div className="p-3 bg-blue-100 rounded-full">
                        <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                        </svg>
                      </div>
                    </div>
                    <div className="mt-2">
                      <div className="flex items-center text-sm">
                        <span className="text-green-500">↑ 12%</span>
                        <span className="ml-1 text-gray-500">vs. last week</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white shadow rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-500">Current Wait Time</p>
                        <p className="text-3xl font-bold text-gray-900">{formatTime(queueData.averageWaitTime)}</p>
                      </div>
                      <div className="p-3 bg-purple-100 rounded-full">
                        <svg className="h-6 w-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                      </div>
                    </div>
                    <div className="mt-2">
                      <div className="flex items-center text-sm">
                        <span className="text-red-500">↑ 8%</span>
                        <span className="ml-1 text-gray-500">vs. average</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white shadow rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-500">Hospital Load</p>
                        <p className={`text-3xl font-bold ${getLoadColor(queueData.currentLoad)}`}>
                          {queueData.currentLoad}%
                        </p>
                      </div>
                      <div className="p-3 bg-yellow-100 rounded-full">
                        <svg className="h-6 w-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
                        </svg>
                      </div>
                    </div>
                    <div className="mt-2">
                      <div className="flex items-center text-sm">
                        <span className="text-yellow-500">~ 5%</span>
                        <span className="ml-1 text-gray-500">steady rate</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white shadow rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-500">Emergency Cases</p>
                        <p className="text-3xl font-bold text-red-600">{queueData.emergencyCases}</p>
                      </div>
                      <div className="p-3 bg-red-100 rounded-full">
                        <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                        </svg>
                      </div>
                    </div>
                    <div className="mt-2">
                      <div className="flex items-center text-sm">
                        <span className="text-red-500">↑ 2</span>
                        <span className="ml-1 text-gray-500">urgent cases</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Queue status and AI insights */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
                  {/* Current queue */}
                  <div className="lg:col-span-2 bg-white shadow rounded-lg overflow-hidden">
                    <div className="bg-primary-700 text-white px-4 py-3">
                      <h2 className="text-lg font-semibold">Current Queue Status</h2>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Patient
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Status
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Urgency
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Wait Time
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Position
                            </th>
                            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {queueData.recentPatients.map(patient => (
                            <tr key={patient.id}>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900">{patient.name}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(patient.status)}`}>
                                  {patient.status.replace('_', ' ')}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`px-2 py-1 text-xs rounded-full ${getUrgencyColor(patient.urgency)}`}>
                                  {patient.urgency}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {formatTime(patient.waitTime)}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {patient.status === 'IN_PROGRESS' ? '-' : `#${patient.position}`}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <a href="#" className="text-primary-600 hover:text-primary-900 mr-3">
                                  View
                                </a>
                                {patient.status === 'WAITING' && (
                                  <a href="#" className="text-indigo-600 hover:text-indigo-900">
                                    Check-in
                                  </a>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 text-center text-sm">
                      <button 
                        onClick={() => setCurrentTab('queue')} 
                        className="text-primary-600 hover:text-primary-900 font-medium"
                      >
                        View Full Queue →
                      </button>
                    </div>
                  </div>
                  
                  {/* AI insights */}
                  <div className="bg-white shadow rounded-lg overflow-hidden">
                    <div className="bg-primary-700 text-white px-4 py-3">
                      <h2 className="text-lg font-semibold">AI Insights</h2>
                    </div>
                    <div className="p-4">
                      <ul className="space-y-4">
                        {queueData.aiInsights.map((insight, index) => (
                          <li key={index} className="flex items-start">
                            <div className="flex-shrink-0 mt-1">
                              <svg className="h-5 w-5 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                              </svg>
                            </div>
                            <div className="ml-3">
                              <p className="text-sm text-gray-700">{insight}</p>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 text-center text-sm">
                      <button 
                        onClick={() => setCurrentTab('analytics')} 
                        className="text-primary-600 hover:text-primary-900 font-medium"
                      >
                        View All Analytics →
                      </button>
                    </div>
                  </div>
                </div>
                
                {/* Department stats */}
                <div className="bg-white shadow rounded-lg overflow-hidden">
                  <div className="bg-primary-700 text-white px-4 py-3">
                    <h2 className="text-lg font-semibold">Department Status</h2>
                  </div>
                  <div className="p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {queueData.departments.map(dept => (
                        <div key={dept.id} className="border rounded-lg p-4">
                          <h3 className="text-lg font-medium text-gray-800">{dept.name}</h3>
                          <div className="mt-4 grid grid-cols-2 gap-2">
                            <div>
                              <p className="text-sm text-gray-500">Patients</p>
                              <p className="text-2xl font-semibold text-gray-900">{dept.patients}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Avg. Wait</p>
                              <p className="text-2xl font-semibold text-gray-900">{formatTime(dept.averageWait)}</p>
                            </div>
                          </div>
                          <div className="mt-4">
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className={`h-2 rounded-full ${
                                  dept.patients < 5 ? 'bg-green-500' : 
                                  dept.patients < 10 ? 'bg-yellow-500' : 'bg-red-500'
                                }`} 
                                style={{ width: `${Math.min(100, (dept.patients / 15) * 100)}%` }}
                              ></div>
                            </div>
                            <p className="mt-1 text-xs text-gray-500">
                              {dept.patients < 5 ? 'Low volume' : 
                               dept.patients < 10 ? 'Moderate volume' : 'High volume'}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 text-center text-sm">
                    <button 
                      onClick={() => setCurrentTab('departments')} 
                      className="text-primary-600 hover:text-primary-900 font-medium"
                    >
                      View All Departments →
                    </button>
                  </div>
                </div>
              </div>
            )}
            
            {currentTab === 'queue' && <QueueContent />}
            {currentTab === 'analytics' && <AnalyticsContent />}
            {currentTab === 'staff' && <StaffContent />}
            {currentTab === 'departments' && <DepartmentsContent />}
            {currentTab === 'settings' && <SettingsContent />}
          </main>
        </div>
      </div>
    </div>
  )
} 