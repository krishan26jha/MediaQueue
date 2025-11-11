'use client';

import { useState } from 'react';

interface Department {
  id: string;
  name: string;
  headDoctor: string;
  staffCount: number;
  roomsCount: number;
  maxCapacity: number;
  currentLoad: number;
  avgWaitTime: number;
  status: 'active' | 'limited' | 'closed';
}

export default function DepartmentsContent() {
  const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  // Mock data for departments
  const mockDepartments: Department[] = [
    {
      id: 'd1',
      name: 'General Medicine',
      headDoctor: 'Dr. Sarah Johnson',
      staffCount: 12,
      roomsCount: 8,
      maxCapacity: 30,
      currentLoad: 65,
      avgWaitTime: 42,
      status: 'active',
    },
    {
      id: 'd2',
      name: 'Pediatrics',
      headDoctor: 'Dr. Michael Chen',
      staffCount: 8,
      roomsCount: 6,
      maxCapacity: 25,
      currentLoad: 48,
      avgWaitTime: 31,
      status: 'active',
    },
    {
      id: 'd3',
      name: 'Orthopedics',
      headDoctor: 'Dr. Robert Brown',
      staffCount: 6,
      roomsCount: 5,
      maxCapacity: 20,
      currentLoad: 70,
      avgWaitTime: 45,
      status: 'limited',
    },
    {
      id: 'd4',
      name: 'Cardiology',
      headDoctor: 'Dr. James Wilson',
      staffCount: 7,
      roomsCount: 6,
      maxCapacity: 22,
      currentLoad: 82,
      avgWaitTime: 52,
      status: 'active',
    },
    {
      id: 'd5',
      name: 'Neurology',
      headDoctor: 'Dr. Lisa Patel',
      staffCount: 5,
      roomsCount: 4,
      maxCapacity: 18,
      currentLoad: 72,
      avgWaitTime: 60,
      status: 'active',
    },
    {
      id: 'd6',
      name: 'Emergency',
      headDoctor: 'Dr. Arjun Reddy',
      staffCount: 15,
      roomsCount: 10,
      maxCapacity: 40,
      currentLoad: 55,
      avgWaitTime: 15,
      status: 'active',
    },
    {
      id: 'd7',
      name: 'Radiology',
      headDoctor: 'Dr. Emma White',
      staffCount: 6,
      roomsCount: 4,
      maxCapacity: 15,
      currentLoad: 50,
      avgWaitTime: 36,
      status: 'active',
    },
    {
      id: 'd8',
      name: 'Psychiatry',
      headDoctor: 'Dr. David Miller',
      staffCount: 4,
      roomsCount: 5,
      maxCapacity: 12,
      currentLoad: 25,
      avgWaitTime: 20,
      status: 'closed',
    },
  ];

  const handleEditDepartment = (department: Department) => {
    setSelectedDepartment(department);
    setIsEditing(true);
  };

  const handleSaveDepartment = () => {
    // In a real app, this would update the database
    setIsEditing(false);
  };

  const getStatusColor = (status: Department['status']): string => {
    switch(status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'limited': return 'bg-yellow-100 text-yellow-800';
      case 'closed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getLoadColor = (load: number): string => {
    if (load < 50) return 'bg-green-500';
    if (load < 75) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="space-y-6">
      {/* Department Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white shadow rounded-lg p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-blue-100 rounded-md p-3">
              <svg className="h-6 w-6 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Departments</p>
              <p className="text-xl font-semibold text-gray-900">{mockDepartments.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white shadow rounded-lg p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-green-100 rounded-md p-3">
              <svg className="h-6 w-6 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Active Departments</p>
              <p className="text-xl font-semibold text-gray-900">
                {mockDepartments.filter(d => d.status === 'active').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white shadow rounded-lg p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-purple-100 rounded-md p-3">
              <svg className="h-6 w-6 text-purple-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Staff</p>
              <p className="text-xl font-semibold text-gray-900">
                {mockDepartments.reduce((sum, dept) => sum + dept.staffCount, 0)}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white shadow rounded-lg p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-red-100 rounded-md p-3">
              <svg className="h-6 w-6 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Average Wait Time</p>
              <p className="text-xl font-semibold text-gray-900">
                {Math.round(mockDepartments.reduce((sum, dept) => sum + dept.avgWaitTime, 0) / mockDepartments.length)} min
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Departments List */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Departments</h3>
            <button className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              Add Department
            </button>
          </div>
        </div>
        
        {/* Desktop Table View */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Head Doctor</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Staff</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rooms</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Current Load</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Wait Time</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {mockDepartments.map((department) => (
                <tr key={department.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{department.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {department.headDoctor}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {department.staffCount}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {department.roomsCount} / {department.maxCapacity}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <span className="text-sm text-gray-900 mr-2">{department.currentLoad}%</span>
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${getLoadColor(department.currentLoad)}`}
                          style={{ width: `${department.currentLoad}%` }}
                        ></div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {department.avgWaitTime} min
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(department.status)}`}>
                      {department.status.charAt(0).toUpperCase() + department.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button 
                      onClick={() => handleEditDepartment(department)}
                      className="text-indigo-600 hover:text-indigo-900 mr-3"
                    >
                      Edit
                    </button>
                    <button className="text-blue-600 hover:text-blue-900">
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile/Tablet Card View */}
        <div className="lg:hidden">
          <div className="space-y-4 p-4">
            {mockDepartments.map((department) => (
              <div key={department.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-medium text-gray-900">{department.name}</h4>
                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(department.status)}`}>
                    {department.status.charAt(0).toUpperCase() + department.status.slice(1)}
                  </span>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <div>
                    <span className="text-sm text-gray-500">Head Doctor:</span>
                    <div className="mt-1 text-sm font-medium text-gray-900">{department.headDoctor}</div>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Staff Count:</span>
                    <div className="mt-1 text-sm font-medium text-gray-900">{department.staffCount}</div>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Rooms:</span>
                    <div className="mt-1 text-sm font-medium text-gray-900">{department.roomsCount} / {department.maxCapacity}</div>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Wait Time:</span>
                    <div className="mt-1 text-sm font-medium text-gray-900">{department.avgWaitTime} min</div>
                  </div>
                </div>
                
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-500">Current Load:</span>
                    <span className="text-sm font-medium text-gray-900">{department.currentLoad}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${getLoadColor(department.currentLoad)}`}
                      style={{ width: `${department.currentLoad}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-200">
                  <button 
                    onClick={() => handleEditDepartment(department)}
                    className="text-indigo-600 hover:text-indigo-900 text-sm font-medium"
                  >
                    Edit
                  </button>
                  <button className="text-blue-600 hover:text-blue-900 text-sm font-medium">
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Department Edit Modal */}
      {isEditing && selectedDepartment && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full overflow-hidden shadow-xl">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900">Edit Department</h3>
              <button 
                onClick={() => setIsEditing(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="px-6 py-4 space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Department Name</label>
                <input
                  type="text"
                  id="name"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  value={selectedDepartment.name}
                  onChange={(e) => setSelectedDepartment({...selectedDepartment, name: e.target.value})}
                />
              </div>
              
              <div>
                <label htmlFor="headDoctor" className="block text-sm font-medium text-gray-700">Head Doctor</label>
                <input
                  type="text"
                  id="headDoctor"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  value={selectedDepartment.headDoctor}
                  onChange={(e) => setSelectedDepartment({...selectedDepartment, headDoctor: e.target.value})}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="staffCount" className="block text-sm font-medium text-gray-700">Staff Count</label>
                  <input
                    type="number"
                    id="staffCount"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    value={selectedDepartment.staffCount}
                    onChange={(e) => setSelectedDepartment({...selectedDepartment, staffCount: Number(e.target.value)})}
                  />
                </div>
                
                <div>
                  <label htmlFor="roomsCount" className="block text-sm font-medium text-gray-700">Rooms Count</label>
                  <input
                    type="number"
                    id="roomsCount"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    value={selectedDepartment.roomsCount}
                    onChange={(e) => setSelectedDepartment({...selectedDepartment, roomsCount: Number(e.target.value)})}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="maxCapacity" className="block text-sm font-medium text-gray-700">Max Capacity</label>
                  <input
                    type="number"
                    id="maxCapacity"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    value={selectedDepartment.maxCapacity}
                    onChange={(e) => setSelectedDepartment({...selectedDepartment, maxCapacity: Number(e.target.value)})}
                  />
                </div>
                
                <div>
                  <label htmlFor="avgWaitTime" className="block text-sm font-medium text-gray-700">Avg. Wait Time (min)</label>
                  <input
                    type="number"
                    id="avgWaitTime"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    value={selectedDepartment.avgWaitTime}
                    onChange={(e) => setSelectedDepartment({...selectedDepartment, avgWaitTime: Number(e.target.value)})}
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status</label>
                <select
                  id="status"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  value={selectedDepartment.status}
                  onChange={(e) => setSelectedDepartment({...selectedDepartment, status: e.target.value as Department['status']})}
                >
                  <option value="active">Active</option>
                  <option value="limited">Limited</option>
                  <option value="closed">Closed</option>
                </select>
              </div>
            </div>
            
            <div className="px-6 py-3 bg-gray-50 border-t border-gray-200 flex justify-end space-x-3">
              <button
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveDepartment}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 