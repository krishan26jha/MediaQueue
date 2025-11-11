'use client';

import { useState, useEffect } from 'react';
import { usePatients, Patient } from '@/context/PatientContext';
import Link from 'next/link';

export default function PatientList({ maxItems = 10 }: { maxItems?: number }) {
  const { patients, updatePatient } = usePatients();
  const [filteredPatients, setFilteredPatients] = useState<Patient[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  
  useEffect(() => {
    let result = [...patients];
    
    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        patient => 
          patient.name.toLowerCase().includes(term) || 
          patient.id.toLowerCase().includes(term) ||
          (patient.department && patient.department.toLowerCase().includes(term))
      );
    }
    
    // Apply status filter
    if (filterStatus !== 'all') {
      result = result.filter(patient => patient.status === filterStatus);
    }
    
    // Sort by priority and then by wait time
    result.sort((a, b) => {
      const priorityOrder = { 'Emergency': 0, 'High': 1, 'Medium': 2, 'Low': 3 };
      const aPriority = priorityOrder[a.priority] || 99;
      const bPriority = priorityOrder[b.priority] || 99;
      
      if (aPriority !== bPriority) {
        return aPriority - bPriority;
      }
      
      // If same priority, sort by wait time (higher first)
      return b.waitTime - a.waitTime;
    });
    
    setFilteredPatients(result.slice(0, maxItems));
  }, [patients, searchTerm, filterStatus, maxItems]);

  // Get status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Waiting':
        return 'bg-yellow-100 text-yellow-800';
      case 'In Progress':
        return 'bg-blue-100 text-blue-800';
      case 'Completed':
        return 'bg-green-100 text-green-800';
      case 'Cancelled':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Get priority badge color
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Emergency':
        return 'bg-red-100 text-red-800';
      case 'High':
        return 'bg-orange-100 text-orange-800';
      case 'Medium':
        return 'bg-blue-100 text-blue-800';
      case 'Low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Handle status change
  const handleStatusChange = (id: string, newStatus: 'Waiting' | 'In Progress' | 'Completed' | 'Cancelled') => {
    updatePatient(id, { 
      status: newStatus,
      // If marked as "In Progress", reset wait time
      ...(newStatus === 'In Progress' ? { waitTime: 0 } : {})
    });
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="p-4 sm:p-6 bg-gray-50 border-b">
        <div className="sm:flex sm:justify-between sm:items-center">
          <h3 className="text-lg font-medium text-gray-900">Patient Queue</h3>
          
          <div className="mt-3 sm:mt-0 sm:ml-4 flex flex-col sm:flex-row gap-3">
            <div className="relative rounded-md shadow-sm">
              <input
                type="text"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="Search patients..."
                className="block w-full pl-3 pr-10 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
            
            <select
              value={filterStatus}
              onChange={e => setFilterStatus(e.target.value)}
              className="block w-full pl-3 pr-10 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="all">All Statuses</option>
              <option value="Waiting">Waiting</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>
      
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
                Priority
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Wait Time
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredPatients.length > 0 ? (
              filteredPatients.map(patient => (
                <tr key={patient.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{patient.name}</div>
                        <div className="text-sm text-gray-500">ID: {patient.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{patient.department}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getPriorityColor(patient.priority)}`}>
                      {patient.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(patient.status)}`}>
                      {patient.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {patient.status === 'Waiting' ? `${patient.waitTime} min` : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      {patient.status === 'Waiting' && (
                        <button
                          onClick={() => handleStatusChange(patient.id, 'In Progress')}
                          className="text-indigo-600 hover:text-indigo-900 text-xs"
                        >
                          Start
                        </button>
                      )}
                      {patient.status === 'In Progress' && (
                        <button
                          onClick={() => handleStatusChange(patient.id, 'Completed')}
                          className="text-green-600 hover:text-green-900 text-xs"
                        >
                          Complete
                        </button>
                      )}
                      {(patient.status === 'Waiting' || patient.status === 'In Progress') && (
                        <button
                          onClick={() => handleStatusChange(patient.id, 'Cancelled')}
                          className="text-red-600 hover:text-red-900 text-xs"
                        >
                          Cancel
                        </button>
                      )}
                      <Link 
                        href={`/patient/${patient.id}`} 
                        className="text-blue-600 hover:text-blue-900 text-xs"
                      >
                        View
                      </Link>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                  {searchTerm || filterStatus !== 'all' 
                    ? "No patients match your search criteria" 
                    : "No patients in the queue"}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {filteredPatients.length > 0 && filteredPatients.length === maxItems && (
        <div className="bg-gray-50 px-4 py-3 border-t border-gray-200 text-center">
          <Link 
            href="/staff/dashboard" 
            className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-primary-700 bg-primary-100 hover:bg-primary-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            View All Patients
          </Link>
        </div>
      )}
    </div>
  );
} 