'use client'

import { useState } from 'react'
import Link from 'next/link'

interface Department {
  id: string
  name: string
  head: string
  staff: number
  rooms: number
  patients: {
    waiting: number
    inProgress: number
    completed: number
  }
  averageWaitTime: number
  utilization: number
  status: 'OPERATIONAL' | 'LIMITED' | 'CLOSED'
}

const MOCK_DEPARTMENTS: Department[] = [
  {
    id: 'GM001',
    name: 'General Medicine',
    head: 'Dr. Sarah Johnson',
    staff: 25,
    rooms: 10,
    patients: {
      waiting: 12,
      inProgress: 8,
      completed: 45
    },
    averageWaitTime: 35,
    utilization: 75,
    status: 'OPERATIONAL'
  },
  {
    id: 'PD001',
    name: 'Pediatrics',
    head: 'Dr. Lisa Martinez',
    staff: 18,
    rooms: 8,
    patients: {
      waiting: 6,
      inProgress: 5,
      completed: 28
    },
    averageWaitTime: 25,
    utilization: 65,
    status: 'OPERATIONAL'
  },
  {
    id: 'CD001',
    name: 'Cardiology',
    head: 'Dr. James Wilson',
    staff: 15,
    rooms: 6,
    patients: {
      waiting: 4,
      inProgress: 4,
      completed: 22
    },
    averageWaitTime: 45,
    utilization: 80,
    status: 'OPERATIONAL'
  },
  {
    id: 'ER001',
    name: 'Emergency',
    head: 'Dr. Michael Chen',
    staff: 30,
    rooms: 15,
    patients: {
      waiting: 8,
      inProgress: 10,
      completed: 52
    },
    averageWaitTime: 15,
    utilization: 90,
    status: 'OPERATIONAL'
  },
  {
    id: 'OR001',
    name: 'Orthopedics',
    head: 'Dr. Robert Brown',
    staff: 12,
    rooms: 5,
    patients: {
      waiting: 3,
      inProgress: 2,
      completed: 18
    },
    averageWaitTime: 40,
    utilization: 70,
    status: 'LIMITED'
  },
  {
    id: 'NR001',
    name: 'Neurology',
    head: 'Dr. Emily White',
    staff: 10,
    rooms: 4,
    patients: {
      waiting: 2,
      inProgress: 3,
      completed: 15
    },
    averageWaitTime: 50,
    utilization: 60,
    status: 'OPERATIONAL'
  }
]

export default function DepartmentsPage() {
  const [departments, setDepartments] = useState<Department[]>(MOCK_DEPARTMENTS)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('ALL')
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingDepartment, setEditingDepartment] = useState<Department | null>(null)

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
      case 'OPERATIONAL': return 'bg-green-100 text-green-800'
      case 'LIMITED': return 'bg-yellow-100 text-yellow-800'
      case 'CLOSED': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getUtilizationColor = (utilization: number): string => {
    if (utilization < 60) return 'text-green-600'
    if (utilization < 80) return 'text-yellow-600'
    return 'text-red-600'
  }

  const handleStatusChange = (deptId: string, newStatus: Department['status']) => {
    setDepartments(prevDepts =>
      prevDepts.map(dept =>
        dept.id === deptId
          ? { ...dept, status: newStatus }
          : dept
      )
    )
  }

  const filteredDepartments = departments.filter(dept => {
    const matchesSearch = dept.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         dept.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         dept.head.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'ALL' || dept.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  return (
    <div className="min-h-screen bg-gray-100 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">Department Management</h1>
          <div className="flex space-x-4">
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Add Department
            </button>
            <Link
              href="/admin/dashboard"
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <div>
              <label htmlFor="search" className="block text-sm font-medium text-gray-700">
                Search
              </label>
              <input
                type="text"
                name="search"
                id="search"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                placeholder="Search by name, ID, or head"
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
                <option value="OPERATIONAL">Operational</option>
                <option value="LIMITED">Limited</option>
                <option value="CLOSED">Closed</option>
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={() => {
                  setSearchTerm('')
                  setStatusFilter('ALL')
                }}
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        {/* Department Cards */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredDepartments.map(dept => (
            <div key={dept.id} className="bg-white shadow rounded-lg overflow-hidden">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{dept.name}</h3>
                    <p className="text-sm text-gray-500">{dept.id}</p>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(dept.status)}`}>
                    {dept.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Department Head</p>
                    <p className="text-sm text-gray-900">{dept.head}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Staff Members</p>
                    <p className="text-sm text-gray-900">{dept.staff}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Total Rooms</p>
                    <p className="text-sm text-gray-900">{dept.rooms}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Average Wait</p>
                    <p className="text-sm text-gray-900">{formatTime(dept.averageWaitTime)}</p>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">Utilization</span>
                    <span className={`text-sm font-medium ${getUtilizationColor(dept.utilization)}`}>
                      {dept.utilization}%
                    </span>
                  </div>
                  <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-200">
                    <div
                      style={{ width: `${dept.utilization}%` }}
                      className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center ${
                        dept.utilization < 60 ? 'bg-green-500' :
                        dept.utilization < 80 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                    ></div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 mb-4">
                  <div className="text-center p-2 bg-yellow-50 rounded">
                    <p className="text-sm font-medium text-yellow-800">{dept.patients.waiting}</p>
                    <p className="text-xs text-yellow-600">Waiting</p>
                  </div>
                  <div className="text-center p-2 bg-blue-50 rounded">
                    <p className="text-sm font-medium text-blue-800">{dept.patients.inProgress}</p>
                    <p className="text-xs text-blue-600">In Progress</p>
                  </div>
                  <div className="text-center p-2 bg-green-50 rounded">
                    <p className="text-sm font-medium text-green-800">{dept.patients.completed}</p>
                    <p className="text-xs text-green-600">Completed</p>
                  </div>
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setEditingDepartment(dept)}
                    className="text-primary-600 hover:text-primary-900 text-sm font-medium"
                  >
                    Edit
                  </button>
                  {dept.status !== 'CLOSED' && (
                    <button
                      onClick={() => handleStatusChange(dept.id, 'CLOSED')}
                      className="text-red-600 hover:text-red-900 text-sm font-medium"
                    >
                      Close
                    </button>
                  )}
                  {dept.status === 'CLOSED' && (
                    <button
                      onClick={() => handleStatusChange(dept.id, 'OPERATIONAL')}
                      className="text-green-600 hover:text-green-900 text-sm font-medium"
                    >
                      Reopen
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
} 