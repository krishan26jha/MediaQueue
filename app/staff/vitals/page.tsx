'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface PatientVitals {
  id: string;
  name: string;
  age: number;
  temperature: number;
  bloodPressure: string;
  heartRate: number;
  oxygenLevel: number;
  weight: number;
  height: number;
  lastUpdated: string;
}

export default function PatientVitalsPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<PatientVitals | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  // Dummy data for patient vitals
  const dummyPatients: PatientVitals[] = [
    {
      id: 'P1001',
      name: 'Arjun Sharma',
      age: 45,
      temperature: 37.2,
      bloodPressure: '120/80',
      heartRate: 72,
      oxygenLevel: 98,
      weight: 75,
      height: 180,
      lastUpdated: '2024-03-20 09:30 AM'
    },
    {
      id: 'P1002',
      name: 'Neha Agarwal',
      age: 32,
      temperature: 38.5,
      bloodPressure: '118/76',
      heartRate: 85,
      oxygenLevel: 97,
      weight: 65,
      height: 165,
      lastUpdated: '2024-03-20 09:45 AM'
    },
    {
      id: 'P1003',
      name: 'Vikram Patel',
      age: 58,
      temperature: 36.8,
      bloodPressure: '135/85',
      heartRate: 78,
      oxygenLevel: 96,
      weight: 82,
      height: 175,
      lastUpdated: '2024-03-20 10:00 AM'
    }
  ];

  const filteredPatients = dummyPatients.filter(patient =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleUpdateVitals = (patient: PatientVitals) => {
    setSelectedPatient(patient);
    setIsEditing(true);
  };

  const handleSaveVitals = () => {
    if (selectedPatient) {
      // In a real app, this would update the database
      console.log('Saving vitals for patient:', selectedPatient);
      setIsEditing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="h-10 w-10 bg-green-600 rounded-md flex items-center justify-center text-white">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
            <h1 className="ml-3 text-2xl font-semibold text-gray-900">Patient Vitals</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <Link href="/staff/dashboard" className="text-sm text-gray-600 hover:text-gray-900">
              Back to Dashboard
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Bar */}
        <div className="mb-6">
          <div className="max-w-md">
            <label htmlFor="search" className="sr-only">
              Search patients
            </label>
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
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-green-500 focus:border-green-500 sm:text-sm"
                placeholder="Search by patient name or ID"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Patient List */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Patient Vitals Records
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              View and update patient vital signs
            </p>
          </div>
          
          <div className="border-t border-gray-200">
            <ul className="divide-y divide-gray-200">
              {filteredPatients.map((patient) => (
                <li key={patient.id} className="px-4 py-4 sm:px-6 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
                          <span className="text-green-600 font-medium">
                            {patient.name.charAt(0)}
                          </span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {patient.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          ID: {patient.id} | Age: {patient.age}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-sm text-gray-500">
                        Last updated: {patient.lastUpdated}
                      </div>
                      <button
                        onClick={() => handleUpdateVitals(patient)}
                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-green-700 bg-green-100 hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                      >
                        Update Vitals
                      </button>
                    </div>
                  </div>
                  
                  <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
                    <div className="bg-gray-50 p-3 rounded-md">
                      <div className="text-xs font-medium text-gray-500">Temperature</div>
                      <div className="mt-1 text-sm text-gray-900">{patient.temperature}°C</div>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-md">
                      <div className="text-xs font-medium text-gray-500">Blood Pressure</div>
                      <div className="mt-1 text-sm text-gray-900">{patient.bloodPressure}</div>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-md">
                      <div className="text-xs font-medium text-gray-500">Heart Rate</div>
                      <div className="mt-1 text-sm text-gray-900">{patient.heartRate} bpm</div>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-md">
                      <div className="text-xs font-medium text-gray-500">Oxygen Level</div>
                      <div className="mt-1 text-sm text-gray-900">{patient.oxygenLevel}%</div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </main>

      {/* Edit Modal */}
      {isEditing && selectedPatient && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                Update Vitals for {selectedPatient.name}
              </h3>
              <button
                onClick={() => setIsEditing(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Temperature (°C)</label>
                <input
                  type="number"
                  step="0.1"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                  value={selectedPatient.temperature}
                  onChange={(e) => setSelectedPatient({...selectedPatient, temperature: parseFloat(e.target.value)})}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Blood Pressure</label>
                <input
                  type="text"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                  value={selectedPatient.bloodPressure}
                  onChange={(e) => setSelectedPatient({...selectedPatient, bloodPressure: e.target.value})}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Heart Rate (bpm)</label>
                <input
                  type="number"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                  value={selectedPatient.heartRate}
                  onChange={(e) => setSelectedPatient({...selectedPatient, heartRate: parseInt(e.target.value)})}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Oxygen Level (%)</label>
                <input
                  type="number"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                  value={selectedPatient.oxygenLevel}
                  onChange={(e) => setSelectedPatient({...selectedPatient, oxygenLevel: parseInt(e.target.value)})}
                />
              </div>
            </div>
            
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveVitals}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 