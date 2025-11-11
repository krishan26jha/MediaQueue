'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import VitalsContent from '../../components/staff/VitalsContent';
import RoomsContent from '../../components/staff/RoomsContent';
import EmergencyContent from '../../components/staff/EmergencyContent';
import PatientList from '@/shared/PatientList';

export default function StaffDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('queue');
  const [user, setUser] = useState<any>(null);
  
  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="h-10 w-10 bg-green-600 rounded-md flex items-center justify-center text-white">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
              </div>
            </div>
            <h1 className="ml-3 text-2xl font-semibold text-gray-900">Nurse Dashboard</h1>
          </div>
          
          <div className="flex items-center">
            <div className="hidden md:flex mr-8">
              <div className="ml-10 flex items-center space-x-4">
                <button onClick={() => setActiveTab('queue')} className={`px-3 py-2 rounded-md text-sm font-medium ${activeTab === 'queue' ? 'bg-green-100 text-green-800' : 'text-gray-600 hover:text-gray-900'}`}>Queue Management</button>
                <button onClick={() => setActiveTab('emergency')} className={`px-3 py-2 rounded-md text-sm font-medium ${activeTab === 'emergency' ? 'bg-red-100 text-red-800' : 'text-gray-600 hover:text-gray-900'}`}>Emergency Requests</button>
                <button onClick={() => setActiveTab('vitals')} className={`px-3 py-2 rounded-md text-sm font-medium ${activeTab === 'vitals' ? 'bg-green-100 text-green-800' : 'text-gray-600 hover:text-gray-900'}`}>Patient Vitals</button>
                <button onClick={() => setActiveTab('rooms')} className={`px-3 py-2 rounded-md text-sm font-medium ${activeTab === 'rooms' ? 'bg-green-100 text-green-800' : 'text-gray-600 hover:text-gray-900'}`}>Room Status</button>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <span className="text-sm text-gray-600">{user?.name || 'Nurse Staff'}</span>
              <div className="h-9 w-9 rounded-full bg-green-600 flex items-center justify-center text-white font-semibold text-lg">
                {user?.name ? user.name.charAt(0) : 'N'}
              </div>
              <Link href="/" className="ml-4 text-sm text-gray-500 hover:text-gray-700">Logout</Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'queue' && (
          <div className="space-y-6">
            {/* Add Patient Button */}
            <div className="flex justify-end">
              <Link
                href="/add-patient"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add New Patient
              </Link>
            </div>
            
            {/* Patient List */}
            <PatientList />
          </div>
        )}
        
        {activeTab === 'emergency' && <EmergencyContent />}
        
        {activeTab === 'vitals' && <VitalsContent />}
        
        {activeTab === 'rooms' && <RoomsContent />}
      </main>
    </div>
  );
} 