'use client'

import { useState } from 'react'
import Link from 'next/link'

type Test = {
  id: string
  patientName: string
  patientId: string
  testType: string
  requestTime: string
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled'
  priority: 'routine' | 'urgent' | 'stat'
  requestedBy: string
}

export default function LabDashboard() {
  const [activeTab, setActiveTab] = useState('pending')
  
  const [tests, setTests] = useState<Test[]>([
    {
      id: 'T2001',
      patientName: 'Arjun Sharma',
      patientId: 'P1001',
      testType: 'Complete Blood Count (CBC)',
      requestTime: '9:40 AM',
      status: 'pending',
      priority: 'urgent',
      requestedBy: 'Dr. Vikram Patel'
    },
    {
      id: 'T2002',
      patientName: 'Neha Agarwal',
      patientId: 'P1002',
      testType: 'Urinalysis',
      requestTime: '9:55 AM',
      status: 'pending',
      priority: 'routine',
      requestedBy: 'Dr. Kavya Sharma'
    },
    {
      id: 'T2003',
      patientName: 'Deepak Verma',
      patientId: 'P1005',
      testType: 'Basic Metabolic Panel',
      requestTime: '10:20 AM',
      status: 'pending',
      priority: 'stat',
      requestedBy: 'Dr. Priya Mehta'
    },
    {
      id: 'T2004',
      patientName: 'Pooja Kapoor',
      patientId: 'P1010',
      testType: 'Liver Function Panel',
      requestTime: '10:35 AM',
      status: 'in-progress',
      priority: 'routine',
      requestedBy: 'Dr. Vikram Patel'
    },
    {
      id: 'T2005',
      patientName: 'Rohit Jain',
      patientId: 'P1008',
      testType: 'COVID-19 PCR Test',
      requestTime: '10:40 AM',
      status: 'in-progress',
      priority: 'urgent',
      requestedBy: 'Dr. Sneha Gupta'
    },
    {
      id: 'T2006',
      patientName: 'Anjali Singh',
      patientId: 'P1015',
      testType: 'Complete Blood Count (CBC)',
      requestTime: '9:15 AM',
      status: 'completed',
      priority: 'routine',
      requestedBy: 'Dr. Priya Mehta'
    },
    {
      id: 'T2007',
      patientName: 'Sunil Reddy',
      patientId: 'P1020',
      testType: 'Lipid Panel',
      requestTime: '9:30 AM',
      status: 'completed',
      priority: 'routine',
      requestedBy: 'Dr. Kavya Sharma'
    }
  ])
  
  const startTest = (testId: string) => {
    setTests(tests.map(test => 
      test.id === testId ? {...test, status: 'in-progress'} : test
    ))
  }
  
  const completeTest = (testId: string) => {
    setTests(tests.map(test => 
      test.id === testId ? {...test, status: 'completed'} : test
    ))
  }
  
  const cancelTest = (testId: string) => {
    setTests(tests.map(test => 
      test.id === testId ? {...test, status: 'cancelled'} : test
    ))
  }
  
  const filteredTests = tests.filter(test => {
    if (activeTab === 'pending') return test.status === 'pending'
    if (activeTab === 'in-progress') return test.status === 'in-progress'
    if (activeTab === 'completed') return test.status === 'completed' || test.status === 'cancelled'
    return true
  })
  
  const priorityColor = (priority: string) => {
    switch(priority) {
      case 'stat': return 'bg-red-100 text-red-800'
      case 'urgent': return 'bg-yellow-100 text-yellow-800'
      case 'routine': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }
  
  const statusColor = (status: string) => {
    switch(status) {
      case 'pending': return 'bg-blue-100 text-blue-800'
      case 'in-progress': return 'bg-yellow-100 text-yellow-800'
      case 'completed': return 'bg-green-100 text-green-800'
      case 'cancelled': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="h-10 w-10 bg-indigo-600 rounded-md flex items-center justify-center text-white">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23-.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
                </svg>
              </div>
            </div>
            <h1 className="ml-3 text-2xl font-semibold text-gray-900">Lab Dashboard</h1>
          </div>
          
          <div className="flex items-center">
            <div className="hidden md:flex mr-8">
              <div className="ml-10 flex items-center space-x-4">
                <button onClick={() => setActiveTab('pending')} className={`px-3 py-2 rounded-md text-sm font-medium ${activeTab === 'pending' ? 'bg-indigo-100 text-indigo-800' : 'text-gray-600 hover:text-gray-900'}`}>Pending Tests</button>
                <button onClick={() => setActiveTab('in-progress')} className={`px-3 py-2 rounded-md text-sm font-medium ${activeTab === 'in-progress' ? 'bg-indigo-100 text-indigo-800' : 'text-gray-600 hover:text-gray-900'}`}>In Progress</button>
                <button onClick={() => setActiveTab('completed')} className={`px-3 py-2 rounded-md text-sm font-medium ${activeTab === 'completed' ? 'bg-indigo-100 text-indigo-800' : 'text-gray-600 hover:text-gray-900'}`}>Completed</button>
                <button onClick={() => setActiveTab('all')} className={`px-3 py-2 rounded-md text-sm font-medium ${activeTab === 'all' ? 'bg-indigo-100 text-indigo-800' : 'text-gray-600 hover:text-gray-900'}`}>All Tests</button>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <span className="text-sm text-gray-600">Himanshu Jha, Lab Tech</span>
              <div className="h-9 w-9 rounded-full bg-indigo-600 flex items-center justify-center text-white font-semibold text-lg">
                HJ
              </div>
              <Link href="/" className="ml-4 text-sm text-gray-500 hover:text-gray-700">Logout</Link>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Laboratory Test Queue</h1>
            <p className="mt-1 text-sm text-gray-500">
              Manage and track laboratory tests for patients
            </p>
          </div>
          <div className="flex space-x-3">
            <span className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
              {tests.filter(test => test.status === 'pending').length} Pending
            </span>
            <span className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
              {tests.filter(test => test.status === 'in-progress').length} In Progress
            </span>
            <span className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-green-100 text-green-800">
              {tests.filter(test => test.status === 'completed').length} Completed
            </span>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Test ID</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Test Type</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Requested</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredTests.map((test) => (
                  <tr key={test.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{test.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{test.patientName}</div>
                      <div className="text-sm text-gray-500">ID: {test.patientId}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{test.testType}</div>
                      <div className="text-xs text-gray-500">By: {test.requestedBy}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {test.requestTime}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${priorityColor(test.priority)}`}>
                        {test.priority.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColor(test.status)}`}>
                        {test.status === 'in-progress' ? 'In Progress' :
                         test.status.charAt(0).toUpperCase() + test.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {test.status === 'pending' && (
                        <button
                          onClick={() => startTest(test.id)}
                          className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                          Start Test
                        </button>
                      )}
                      {test.status === 'in-progress' && (
                        <button
                          onClick={() => completeTest(test.id)}
                          className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-green-700 bg-green-100 hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                        >
                          Complete
                        </button>
                      )}
                      {(test.status === 'pending' || test.status === 'in-progress') && (
                        <button
                          onClick={() => cancelTest(test.id)}
                          className="ml-2 inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-gray-700 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                        >
                          Cancel
                        </button>
                      )}
                      {test.status === 'completed' && (
                        <button
                          className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          View Results
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Quick Stats */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Today's Stats</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium text-gray-500">Tests Completed</div>
                <div className="text-xl font-semibold text-gray-900">14</div>
              </div>
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium text-gray-500">Average Turnaround</div>
                <div className="text-xl font-semibold text-gray-900">32 min</div>
              </div>
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium text-gray-500">STAT Response Time</div>
                <div className="text-xl font-semibold text-green-600">11 min</div>
              </div>
            </div>
          </div>

          {/* Recent Equipment Status */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Equipment Status</h2>
            <div className="space-y-4">
              <div>
                <div className="flex items-center">
                  <div className="h-2.5 w-2.5 rounded-full bg-green-500 mr-2"></div>
                  <p className="text-sm font-medium text-gray-900">Hematology Analyzer</p>
                </div>
                <p className="text-xs text-gray-500 mt-1">Last Calibrated: Today, 8:00 AM</p>
              </div>
              <div>
                <div className="flex items-center">
                  <div className="h-2.5 w-2.5 rounded-full bg-green-500 mr-2"></div>
                  <p className="text-sm font-medium text-gray-900">Chemistry Analyzer</p>
                </div>
                <p className="text-xs text-gray-500 mt-1">Last Calibrated: Today, 8:15 AM</p>
              </div>
              <div>
                <div className="flex items-center">
                  <div className="h-2.5 w-2.5 rounded-full bg-yellow-500 mr-2"></div>
                  <p className="text-sm font-medium text-gray-900">PCR Thermocycler</p>
                </div>
                <p className="text-xs text-gray-500 mt-1">Maintenance Required</p>
              </div>
              <div>
                <div className="flex items-center">
                  <div className="h-2.5 w-2.5 rounded-full bg-green-500 mr-2"></div>
                  <p className="text-sm font-medium text-gray-900">Urinalysis System</p>
                </div>
                <p className="text-xs text-gray-500 mt-1">Last Calibrated: Yesterday, 5:00 PM</p>
              </div>
            </div>
          </div>

          {/* Inventory Levels */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Inventory Alerts</h2>
            <div className="space-y-4">
              <div>
                <div className="flex items-center">
                  <div className="h-2.5 w-2.5 rounded-full bg-red-500 mr-2"></div>
                  <p className="text-sm font-medium text-gray-900">CBC Test Tubes</p>
                </div>
                <div className="mt-1 w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-red-500 h-2 rounded-full" style={{ width: '10%' }}></div>
                </div>
                <p className="text-xs text-red-600 mt-1">Low stock! 5 remaining</p>
              </div>
              <div>
                <div className="flex items-center">
                  <div className="h-2.5 w-2.5 rounded-full bg-yellow-500 mr-2"></div>
                  <p className="text-sm font-medium text-gray-900">Urine Sample Containers</p>
                </div>
                <div className="mt-1 w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '25%' }}></div>
                </div>
                <p className="text-xs text-yellow-600 mt-1">Running low. 25 remaining</p>
              </div>
              <div>
                <div className="flex items-center">
                  <div className="h-2.5 w-2.5 rounded-full bg-green-500 mr-2"></div>
                  <p className="text-sm font-medium text-gray-900">COVID-19 Test Kits</p>
                </div>
                <div className="mt-1 w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '70%' }}></div>
                </div>
                <p className="text-xs text-gray-500 mt-1">125 remaining</p>
              </div>
            </div>
            <div className="mt-4">
              <button className="text-sm text-indigo-600 font-medium hover:text-indigo-700">
                Order Supplies
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
} 