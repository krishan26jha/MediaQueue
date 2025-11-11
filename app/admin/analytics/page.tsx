'use client'

import { useState } from 'react'
import Link from 'next/link'

interface DailyStats {
  date: string
  totalPatients: number
  averageWaitTime: number
  satisfactionScore: number
  emergencyCases: number
}

interface DepartmentStats {
  name: string
  patients: number
  averageWaitTime: number
  satisfaction: number
  utilization: number
}

const MOCK_DAILY_STATS: DailyStats[] = [
  { date: '2024-03-01', totalPatients: 45, averageWaitTime: 35, satisfactionScore: 4.2, emergencyCases: 3 },
  { date: '2024-03-02', totalPatients: 52, averageWaitTime: 42, satisfactionScore: 4.0, emergencyCases: 5 },
  { date: '2024-03-03', totalPatients: 38, averageWaitTime: 28, satisfactionScore: 4.5, emergencyCases: 2 },
  { date: '2024-03-04', totalPatients: 61, averageWaitTime: 45, satisfactionScore: 3.8, emergencyCases: 6 },
  { date: '2024-03-05', totalPatients: 49, averageWaitTime: 33, satisfactionScore: 4.3, emergencyCases: 4 },
  { date: '2024-03-06', totalPatients: 55, averageWaitTime: 38, satisfactionScore: 4.1, emergencyCases: 5 },
  { date: '2024-03-07', totalPatients: 47, averageWaitTime: 31, satisfactionScore: 4.4, emergencyCases: 3 }
]

const MOCK_DEPARTMENT_STATS: DepartmentStats[] = [
  { name: 'General Medicine', patients: 156, averageWaitTime: 35, satisfaction: 4.2, utilization: 75 },
  { name: 'Pediatrics', patients: 89, averageWaitTime: 25, satisfaction: 4.5, utilization: 65 },
  { name: 'Orthopedics', patients: 72, averageWaitTime: 40, satisfaction: 4.0, utilization: 70 },
  { name: 'Cardiology', patients: 94, averageWaitTime: 45, satisfaction: 4.1, utilization: 80 },
  { name: 'Neurology', patients: 63, averageWaitTime: 50, satisfaction: 3.9, utilization: 60 },
  { name: 'Emergency', patients: 218, averageWaitTime: 15, satisfaction: 4.3, utilization: 90 }
]

const PEAK_HOURS = [
  { hour: '09:00', patients: 15, waitTime: 25, staffCount: 3, efficiency: 85 },
  { hour: '10:00', patients: 22, waitTime: 35, staffCount: 4, efficiency: 82 },
  { hour: '11:00', patients: 25, waitTime: 40, staffCount: 4, efficiency: 78 },
  { hour: '12:00', patients: 28, waitTime: 45, staffCount: 5, efficiency: 75 },
  { hour: '13:00', patients: 30, waitTime: 50, staffCount: 5, efficiency: 72 },
  { hour: '14:00', patients: 35, waitTime: 55, staffCount: 6, efficiency: 70 },
  { hour: '15:00', patients: 32, waitTime: 45, staffCount: 5, efficiency: 76 },
  { hour: '16:00', patients: 25, waitTime: 35, staffCount: 4, efficiency: 80 },
  { hour: '17:00', patients: 20, waitTime: 30, staffCount: 4, efficiency: 84 },
  { hour: '18:00', patients: 15, waitTime: 25, staffCount: 3, efficiency: 86 }
]

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState('week')
  
  // Format time in minutes to hours and minutes
  const formatTime = (minutes: number): string => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    
    if (hours > 0) {
      return `${hours}h ${mins}m`
    }
    return `${mins}m`
  }
  
  const getUtilizationColor = (utilization: number): string => {
    if (utilization < 60) return 'bg-green-500'
    if (utilization < 80) return 'bg-yellow-500'
    return 'bg-red-500'
  }
  
  const calculateTotalStats = () => {
    const total = MOCK_DAILY_STATS.reduce((acc, day) => ({
      totalPatients: acc.totalPatients + day.totalPatients,
      averageWaitTime: acc.averageWaitTime + day.averageWaitTime,
      satisfactionScore: acc.satisfactionScore + day.satisfactionScore,
      emergencyCases: acc.emergencyCases + day.emergencyCases
    }), {
      totalPatients: 0,
      averageWaitTime: 0,
      satisfactionScore: 0,
      emergencyCases: 0
    })
    
    return {
      totalPatients: total.totalPatients,
      averageWaitTime: Math.round(total.averageWaitTime / MOCK_DAILY_STATS.length),
      satisfactionScore: (total.satisfactionScore / MOCK_DAILY_STATS.length).toFixed(1),
      emergencyCases: total.emergencyCases
    }
  }
  
  const totalStats = calculateTotalStats()

  return (
    <div className="min-h-screen bg-gray-100 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">Analytics & Insights</h1>
          <Link
            href="/admin/dashboard"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            Back to Dashboard
          </Link>
        </div>

        {/* Time Range Selector */}
        <div className="bg-white shadow rounded-lg p-4 mb-6">
          <div className="flex space-x-4">
            <button
              onClick={() => setTimeRange('day')}
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                timeRange === 'day'
                  ? 'bg-primary-100 text-primary-700'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Today
            </button>
            <button
              onClick={() => setTimeRange('week')}
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                timeRange === 'week'
                  ? 'bg-primary-100 text-primary-700'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              This Week
            </button>
            <button
              onClick={() => setTimeRange('month')}
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                timeRange === 'month'
                  ? 'bg-primary-100 text-primary-700'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              This Month
            </button>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 gap-6 mb-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 p-3 rounded-md bg-blue-100">
                <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <h2 className="text-sm font-medium text-gray-500">Total Patients</h2>
                <p className="text-2xl font-semibold text-gray-900">{totalStats.totalPatients}</p>
              </div>
            </div>
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 p-3 rounded-md bg-green-100">
                <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <h2 className="text-sm font-medium text-gray-500">Average Wait Time</h2>
                <p className="text-2xl font-semibold text-gray-900">{formatTime(totalStats.averageWaitTime)}</p>
              </div>
            </div>
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 p-3 rounded-md bg-yellow-100">
                <svg className="h-6 w-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              </div>
              <div className="ml-4">
                <h2 className="text-sm font-medium text-gray-500">Satisfaction Score</h2>
                <p className="text-2xl font-semibold text-gray-900">{totalStats.satisfactionScore}/5.0</p>
              </div>
            </div>
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 p-3 rounded-md bg-red-100">
                <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div className="ml-4">
                <h2 className="text-sm font-medium text-gray-500">Emergency Cases</h2>
                <p className="text-2xl font-semibold text-gray-900">{totalStats.emergencyCases}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Department Performance */}
        <div className="grid grid-cols-1 gap-6 mb-6 lg:grid-cols-2">
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Department Performance</h2>
              <div className="space-y-4">
                {MOCK_DEPARTMENT_STATS.map(dept => (
                  <div key={dept.name} className="relative">
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700">{dept.name}</span>
                      <span className="text-sm font-medium text-gray-500">{dept.utilization}%</span>
                    </div>
                    <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-200">
                      <div
                        style={{ width: `${dept.utilization}%` }}
                        className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center ${getUtilizationColor(dept.utilization)}`}
                      ></div>
                    </div>
                    <div className="flex justify-between mt-1 text-xs text-gray-500">
                      <span>{dept.patients} patients</span>
                      <span>{formatTime(dept.averageWaitTime)} avg. wait</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Peak Hours */}
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Peak Hours Analysis</h2>
              <div className="relative h-80">
                <div className="absolute inset-0">
                  <div className="flex h-full items-end space-x-2">
                    {PEAK_HOURS.map(hour => (
                      <div key={hour.hour} className="flex-1 group relative">
                        <div
                          className="bg-primary-500 rounded-t transition-all duration-200 group-hover:bg-primary-600"
                          style={{ height: `${(hour.patients / 35) * 100}%` }}
                        >
                          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block bg-gray-900 text-white text-xs rounded px-2 py-1 whitespace-nowrap">
                            <div>Patients: {hour.patients}</div>
                            <div>Wait Time: {formatTime(hour.waitTime)}</div>
                            <div>Staff: {hour.staffCount}</div>
                            <div>Efficiency: {hour.efficiency}%</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-gray-500 pt-2 border-t">
                  {PEAK_HOURS.map(hour => (
                    <div key={hour.hour} className="text-center" style={{ width: '10%' }}>
                      {hour.hour}
                    </div>
                  ))}
                </div>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-4 text-sm text-gray-600">
                <div>
                  <p className="font-medium">Peak Time:</p>
                  <p>14:00 - 35 patients</p>
                </div>
                <div>
                  <p className="font-medium">Average Wait Time:</p>
                  <p>{formatTime(PEAK_HOURS.reduce((acc, curr) => acc + curr.waitTime, 0) / PEAK_HOURS.length)}</p>
                </div>
                <div>
                  <p className="font-medium">Average Staff Count:</p>
                  <p>{(PEAK_HOURS.reduce((acc, curr) => acc + curr.staffCount, 0) / PEAK_HOURS.length).toFixed(1)} staff members</p>
                </div>
                <div>
                  <p className="font-medium">Average Efficiency:</p>
                  <p>{(PEAK_HOURS.reduce((acc, curr) => acc + curr.efficiency, 0) / PEAK_HOURS.length).toFixed(1)}%</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Daily Stats Table */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Daily Statistics</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Patients
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Average Wait Time
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Satisfaction Score
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Emergency Cases
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {MOCK_DAILY_STATS.map(day => (
                  <tr key={day.date}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(day.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {day.totalPatients}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatTime(day.averageWaitTime)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {day.satisfactionScore.toFixed(1)}/5.0
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {day.emergencyCases}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
} 