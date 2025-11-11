'use client';

import { useState } from 'react';

interface StaffMember {
  id: string;
  name: string;
  role: string;
  department: string;
  status: 'active' | 'off duty' | 'on leave';
  specialties?: string[];
  email: string;
  phone: string;
  lastActive: string;
  patientsHandled: number;
  image?: string;
}

export default function StaffContent() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [filterDepartment, setFilterDepartment] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null);
  const [isViewing, setIsViewing] = useState(false);

  // Mock data for staff members
  const mockStaff: StaffMember[] = [
    {
      id: 's1',
      name: 'Dr. Kavya Sharma',
      role: 'Doctor',
      department: 'General Medicine',
      status: 'active',
      specialties: ['Internal Medicine', 'Diabetes Care'],
      email: 'kavya.sharma@mediqueue.com',
      phone: '+91 98765 43210',
      lastActive: '2024-04-15 09:30 AM',
      patientsHandled: 32,
    },
    {
      id: 's2',
      name: 'Dr. Arjun Patel',
      role: 'Doctor',
      department: 'Pediatrics',
      status: 'active',
      specialties: ['Pediatric Care', 'Vaccinations'],
      email: 'arjun.patel@mediqueue.com',
      phone: '+91 98876 54321',
      lastActive: '2024-04-15 10:15 AM',
      patientsHandled: 28,
    },
    {
      id: 's3',
      name: 'Dr. Vikram Singh',
      role: 'Doctor',
      department: 'Cardiology',
      status: 'off duty',
      specialties: ['Heart Disease', 'Hypertension'],
      email: 'vikram.singh@mediqueue.com',
      phone: '+91 98987 65432',
      lastActive: '2024-04-14 04:45 PM',
      patientsHandled: 25,
    },
    {
      id: 's4',
      name: 'Nurse Priya Mehta',
      role: 'Nurse',
      department: 'General Medicine',
      status: 'active',
      email: 'priya.mehta@mediqueue.com',
      phone: '+91 99098 76543',
      lastActive: '2024-04-15 11:00 AM',
      patientsHandled: 42,
    },
    {
      id: 's5',
      name: 'Nurse Deepak Verma',
      role: 'Nurse',
      department: 'Emergency',
      status: 'active',
      email: 'deepak.verma@mediqueue.com',
      phone: '+91 99109 87654',
      lastActive: '2024-04-15 09:45 AM',
      patientsHandled: 38,
    },
    {
      id: 's6',
      name: 'Dr. Sneha Gupta',
      role: 'Doctor',
      department: 'Neurology',
      status: 'on leave',
      specialties: ['Neurological Disorders', 'Migraine Treatment'],
      email: 'sneha.gupta@mediqueue.com',
      phone: '+91 99210 98765',
      lastActive: '2024-04-10 02:30 PM',
      patientsHandled: 18,
    },
    {
      id: 's7',
      name: 'Nurse Anjali Singh',
      role: 'Nurse',
      department: 'Pediatrics',
      status: 'active',
      email: 'anjali.singh@mediqueue.com',
      phone: '+91 99321 09876',
      lastActive: '2024-04-15 10:30 AM',
      patientsHandled: 35,
    },
    {
      id: 's8',
      name: 'Dr. Rajesh Reddy',
      role: 'Doctor',
      department: 'Orthopedics',
      status: 'active',
      specialties: ['Joint Replacement', 'Sports Injuries'],
      email: 'rajesh.reddy@mediqueue.com',
      phone: '+91 99432 10987',
      lastActive: '2024-04-15 08:45 AM',
      patientsHandled: 22,
    },
  ];

  // Filter staff based on search term and filters
  const filteredStaff = mockStaff.filter(staff => {
    const matchesSearch = staff.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         staff.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         staff.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = filterRole === 'all' || staff.role === filterRole;
    const matchesDepartment = filterDepartment === 'all' || staff.department === filterDepartment;
    const matchesStatus = filterStatus === 'all' || staff.status === filterStatus;
    
    return matchesSearch && matchesRole && matchesDepartment && matchesStatus;
  });

  // Get unique departments and roles for filters
  const departments = Array.from(new Set(mockStaff.map(staff => staff.department)));
  const roles = Array.from(new Set(mockStaff.map(staff => staff.role)));

  // Handle view staff details
  const handleViewStaff = (staff: StaffMember) => {
    setSelectedStaff(staff);
    setIsViewing(true);
  };

  // Get status color class
  const getStatusColor = (status: string): string => {
    switch(status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'off duty': return 'bg-yellow-100 text-yellow-800';
      case 'on leave': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with filters */}
      <div className="bg-white shadow rounded-lg p-4">
        <div className="flex flex-col lg:flex-row justify-between gap-4">
          <h2 className="text-lg font-medium text-gray-900">Staff Management</h2>
          
          {/* Search and filters */}
          <div className="flex flex-col sm:flex-row flex-wrap gap-4">
            <div className="w-full sm:w-64">
              <label htmlFor="search" className="sr-only">Search staff</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                  </svg>
                </div>
                <input
                  type="text"
                  name="search"
                  id="search"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Search by name or email"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            <div className="w-full sm:w-auto">
              <select
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
              >
                <option value="all">All Roles</option>
                {roles.map((role) => (
                  <option key={role} value={role}>{role}</option>
                ))}
              </select>
            </div>
            
            <div className="w-full sm:w-auto">
              <select
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                value={filterDepartment}
                onChange={(e) => setFilterDepartment(e.target.value)}
              >
                <option value="all">All Departments</option>
                {departments.map((dept) => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>
            
            <div className="w-full sm:w-auto">
              <select
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">All Statuses</option>
                <option value="active">Active</option>
                <option value="off duty">Off Duty</option>
                <option value="on leave">On Leave</option>
              </select>
            </div>
          </div>
        </div>
      </div>
      
      {/* Staff list */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Staff List</h3>
            <button className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              Add New Staff
            </button>
          </div>
        </div>
        
        
        {/* Desktop Table View */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Staff Member
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Department
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Patients Handled
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Active
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredStaff.map((staff) => (
                <tr key={staff.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium">
                        {staff.name.charAt(0)}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{staff.name}</div>
                        <div className="text-sm text-gray-500">{staff.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {staff.role}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {staff.department}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(staff.status)}`}>
                      {staff.status.charAt(0).toUpperCase() + staff.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {staff.patientsHandled}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {staff.lastActive}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button 
                      onClick={() => handleViewStaff(staff)}
                      className="text-blue-600 hover:text-blue-900 mr-3"
                    >
                      View
                    </button>
                    <button className="text-indigo-600 hover:text-indigo-900 mr-3">
                      Edit
                    </button>
                    <button className="text-red-600 hover:text-red-900">
                      Deactivate
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
            {filteredStaff.map((staff) => (
              <div key={staff.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium text-lg">
                      {staff.name.charAt(0)}
                    </div>
                    <div className="ml-3">
                      <div className="text-sm font-medium text-gray-900">{staff.name}</div>
                      <div className="text-xs text-gray-500">{staff.email}</div>
                    </div>
                  </div>
                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(staff.status)}`}>
                    {staff.status.charAt(0).toUpperCase() + staff.status.slice(1)}
                  </span>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm mb-4">
                  <div>
                    <span className="text-gray-500">Role:</span>
                    <div className="mt-1 text-gray-900 font-medium">{staff.role}</div>
                  </div>
                  <div>
                    <span className="text-gray-500">Department:</span>
                    <div className="mt-1 text-gray-900 font-medium">{staff.department}</div>
                  </div>
                  <div>
                    <span className="text-gray-500">Patients Handled:</span>
                    <div className="mt-1 text-gray-900 font-medium">{staff.patientsHandled}</div>
                  </div>
                  <div>
                    <span className="text-gray-500">Last Active:</span>
                    <div className="mt-1 text-gray-900 text-xs">{staff.lastActive}</div>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-200">
                  <button 
                    onClick={() => handleViewStaff(staff)}
                    className="text-blue-600 hover:text-blue-900 text-sm font-medium"
                  >
                    View Details
                  </button>
                  <button className="text-indigo-600 hover:text-indigo-900 text-sm font-medium">
                    Edit
                  </button>
                  <button className="text-red-600 hover:text-red-900 text-sm font-medium">
                    Deactivate
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Staff Details Modal */}
      {isViewing && selectedStaff && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full overflow-hidden shadow-xl">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900">Staff Details</h3>
              <button 
                onClick={() => setIsViewing(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="px-6 py-4">
              <div className="flex items-center mb-6">
                <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-xl font-medium">
                  {selectedStaff.name.charAt(0)}
                </div>
                <div className="ml-4">
                  <h4 className="text-xl font-bold text-gray-900">{selectedStaff.name}</h4>
                  <p className="text-sm text-gray-500">{selectedStaff.role} - {selectedStaff.department}</p>
                </div>
                <div className="ml-auto">
                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(selectedStaff.status)}`}>
                    {selectedStaff.status.charAt(0).toUpperCase() + selectedStaff.status.slice(1)}
                  </span>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <h5 className="text-sm font-medium text-gray-500">Contact Information</h5>
                  <div className="mt-2 space-y-2">
                    <div className="flex items-center">
                      <svg className="h-5 w-5 text-gray-400 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                      </svg>
                      <span className="text-sm text-gray-900">{selectedStaff.email}</span>
                    </div>
                    <div className="flex items-center">
                      <svg className="h-5 w-5 text-gray-400 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                      </svg>
                      <span className="text-sm text-gray-900">{selectedStaff.phone}</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h5 className="text-sm font-medium text-gray-500">Activity</h5>
                  <div className="mt-2 space-y-2">
                    <div className="flex items-center">
                      <svg className="h-5 w-5 text-gray-400 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm text-gray-900">Last active: {selectedStaff.lastActive}</span>
                    </div>
                    <div className="flex items-center">
                      <svg className="h-5 w-5 text-gray-400 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                      </svg>
                      <span className="text-sm text-gray-900">Patients handled: {selectedStaff.patientsHandled}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {selectedStaff.specialties && selectedStaff.specialties.length > 0 && (
                <div className="mb-6">
                  <h5 className="text-sm font-medium text-gray-500 mb-2">Specialties</h5>
                  <div className="flex flex-wrap gap-2">
                    {selectedStaff.specialties.map((specialty, index) => (
                      <span 
                        key={index} 
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                      >
                        {specialty}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h5 className="text-sm font-medium text-gray-500 mb-2">Schedule</h5>
                  <div className="bg-gray-50 rounded-md p-3">
                    <ul className="space-y-2 text-sm">
                      <li className="flex justify-between">
                        <span className="text-gray-600">Monday:</span>
                        <span className="font-medium">9:00 AM - 5:00 PM</span>
                      </li>
                      <li className="flex justify-between">
                        <span className="text-gray-600">Tuesday:</span>
                        <span className="font-medium">9:00 AM - 5:00 PM</span>
                      </li>
                      <li className="flex justify-between">
                        <span className="text-gray-600">Wednesday:</span>
                        <span className="font-medium">10:00 AM - 6:00 PM</span>
                      </li>
                      <li className="flex justify-between">
                        <span className="text-gray-600">Thursday:</span>
                        <span className="font-medium">9:00 AM - 5:00 PM</span>
                      </li>
                      <li className="flex justify-between">
                        <span className="text-gray-600">Friday:</span>
                        <span className="font-medium">9:00 AM - 4:00 PM</span>
                      </li>
                      <li className="flex justify-between">
                        <span className="text-gray-600">Saturday:</span>
                        <span className="font-medium">Off</span>
                      </li>
                      <li className="flex justify-between">
                        <span className="text-gray-600">Sunday:</span>
                        <span className="font-medium">Off</span>
                      </li>
                    </ul>
                  </div>
                </div>
                
                <div>
                  <h5 className="text-sm font-medium text-gray-500 mb-2">Performance</h5>
                  <div className="bg-gray-50 rounded-md p-3">
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-600">Patient Satisfaction</span>
                          <span className="font-medium">92%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-green-500 h-2 rounded-full" style={{ width: '92%' }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-600">Average Wait Time</span>
                          <span className="font-medium">18 min</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-blue-500 h-2 rounded-full" style={{ width: '75%' }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-600">Cases Resolved</span>
                          <span className="font-medium">95%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-green-500 h-2 rounded-full" style={{ width: '95%' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="px-6 py-3 bg-gray-50 border-t border-gray-200 flex justify-end space-x-3">
              <button
                onClick={() => setIsViewing(false)}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Close
              </button>
              <button
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Edit Staff
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 