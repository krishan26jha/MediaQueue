'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface Patient {
  id: string
  name: string
  status: 'WAITING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED'
  urgency: 'LOW' | 'NORMAL' | 'HIGH' | 'EMERGENCY'
  waitTime: number
  position: number
  department: string
  doctor?: string
  checkInTime: string
  estimatedTime: string
}

const MOCK_PATIENTS: Patient[] = [
  {
    id: 'P001',
    name: 'John Smith',
    status: 'WAITING',
    urgency: 'NORMAL',
    waitTime: 25,
    position: 4,
    department: 'General Medicine',
    checkInTime: '09:30 AM',
    estimatedTime: '10:15 AM'
  },
  {
    id: 'P002',
    name: 'Jane Smith',
    status: 'IN_PROGRESS',
    urgency: 'HIGH',
    waitTime: 10,
    position: 0,
    department: 'Cardiology',
    doctor: 'Dr. Sarah Johnson',
    checkInTime: '09:15 AM',
    estimatedTime: '09:45 AM'
  },
  {
    id: 'P003',
    name: 'Robert Johnson',
    status: 'WAITING',
    urgency: 'LOW',
    waitTime: 45,
    position: 8,
    department: 'Orthopedics',
    checkInTime: '09:00 AM',
    estimatedTime: '10:30 AM'
  },
  {
    id: 'P004',
    name: 'Sarah Williams',
    status: 'WAITING',
    urgency: 'EMERGENCY',
    waitTime: 5,
    position: 1,
    department: 'Emergency',
    checkInTime: '09:45 AM',
    estimatedTime: '09:55 AM'
  },
  {
    id: 'P005',
    name: 'Michael Brown',
    status: 'COMPLETED',
    urgency: 'NORMAL',
    waitTime: 33,
    position: 0,
    department: 'General Medicine',
    doctor: 'Dr. James Wilson',
    checkInTime: '08:30 AM',
    estimatedTime: '09:30 AM'
  }
]

export default function QueueManagementPage() {
  const [patients, setPatients] = useState<Patient[]>(MOCK_PATIENTS)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('ALL')
  const [departmentFilter, setDepartmentFilter] = useState<string>('ALL')
  const [isLoading, setIsLoading] = useState(false)

  const departments = Array.from(new Set(MOCK_PATIENTS.map(p => p.department)))
  
  // Format time in minutes to hours and minutes
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

  const handleStatusChange = (patientId: string, newStatus: Patient['status']) => {
    setPatients(prevPatients =>
      prevPatients.map(patient =>
        patient.id === patientId
          ? { ...patient, status: newStatus }
          : patient
      )
    )
  }

  const handleAssignDoctor = (patientId: string, doctorName: string) => {
    setPatients(prevPatients =>
      prevPatients.map(patient =>
        patient.id === patientId
          ? { ...patient, doctor: doctorName, status: 'IN_PROGRESS' }
          : patient
      )
    )
  }

  const filteredPatients = patients.filter(patient => {
    const matchesSearch = patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         patient.id.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'ALL' || patient.status === statusFilter
    const matchesDepartment = departmentFilter === 'ALL' || patient.department === departmentFilter
    
    return matchesSearch && matchesStatus && matchesDepartment
  })

  return (
    <div className="min-h-screen bg-gray-100 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">Queue Management</h1>
          <Link
            href="/admin/dashboard"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            Back to Dashboard
          </Link>
        </div>

        {/* Filters */}
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
            <div>
              <label htmlFor="search" className="block text-sm font-medium text-gray-700">
                Search
              </label>
              <input
                type="text"
                name="search"
                id="search"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                placeholder="Search by name or ID"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                Status
              </label>
              <select
                id="status"
                name="status"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="ALL">All Statuses</option>
                <option value="WAITING">Waiting</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="COMPLETED">Completed</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
            </div>

            <div>
              <label htmlFor="department" className="block text-sm font-medium text-gray-700">
                Department
              </label>
              <select
                id="department"
                name="department"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                value={departmentFilter}
                onChange={(e) => setDepartmentFilter(e.target.value)}
              >
                <option value="ALL">All Departments</option>
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={() => {
                  setSearchTerm('')
                  setStatusFilter('ALL')
                  setDepartmentFilter('ALL')
                }}
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        {/* Queue Table */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Patient
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Department
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
                    Check-in
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Est. Time
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Doctor
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredPatients.map(patient => (
                  <tr key={patient.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{patient.name}</div>
                          <div className="text-sm text-gray-500">{patient.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{patient.department}</div>
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
                      {patient.checkInTime}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {patient.estimatedTime}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {patient.doctor || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {patient.status === 'WAITING' && (
                        <button
                          onClick={() => handleStatusChange(patient.id, 'IN_PROGRESS')}
                          className="text-primary-600 hover:text-primary-900 mr-4"
                        >
                          Start
                        </button>
                      )}
                      {patient.status === 'IN_PROGRESS' && (
                        <button
                          onClick={() => handleStatusChange(patient.id, 'COMPLETED')}
                          className="text-green-600 hover:text-green-900 mr-4"
                        >
                          Complete
                        </button>
                      )}
                      {(patient.status === 'WAITING' || patient.status === 'IN_PROGRESS') && (
                        <button
                          onClick={() => handleStatusChange(patient.id, 'CANCELLED')}
                          className="text-red-600 hover:text-red-900"
                        >
                          Cancel
                        </button>
                      )}
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