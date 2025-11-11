'use client';

import { useState } from 'react';

export default function EmergencyButton() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [emergencyType, setEmergencyType] = useState('');
  const [patientName, setPatientName] = useState('');
  const [patientPhone, setPatientPhone] = useState('');
  const [patientLocation, setPatientLocation] = useState('');

  const handleEmergencyClick = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    if (!isLoading) {
      setIsModalOpen(false);
      setIsConfirmed(false);
      setEmergencyType('');
      setPatientName('');
      setPatientPhone('');
      setPatientLocation('');
    }
  };

  const handleEmergencyRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Make API call to create emergency request
      const response = await fetch('/api/emergency', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          patientName,
          patientPhone,
          patientLocation,
          emergencyType,
          priorityLevel: 'EMERGENCY'
        })
      });

      const data = await response.json();
      
      if (response.ok) {
        console.log('Emergency request submitted successfully:', data);
        setIsConfirmed(true);
      } else {
        console.error('Failed to submit emergency request:', data.error);
        alert('Failed to submit emergency request. Please try again.');
      }
    } catch (error) {
      console.error('Failed to submit emergency request:', error);
      alert('Failed to submit emergency request. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-8 left-8 z-50">
      <button
        onClick={handleEmergencyClick}
        className="relative flex items-center justify-center w-16 h-16 bg-red-600 text-white rounded-full shadow-lg hover:bg-red-700 focus:outline-none focus:ring-4 focus:ring-red-300 transition-all transform hover:scale-105 animate-pulse"
        aria-label="Emergency"
      >
        <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full animate-ping"></span>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      </button>
      
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 overflow-hidden">
            {!isConfirmed ? (
              <>
                <div className="bg-red-600 text-white px-6 py-4">
                  <h2 className="text-2xl font-bold">Emergency Assistance</h2>
                  <p className="text-red-100">Connect with ambulance and hospital staff immediately</p>
                </div>
                <form onSubmit={handleEmergencyRequest} className="p-6">
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="emergencyType">
                      Emergency Type <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="emergencyType"
                      value={emergencyType}
                      onChange={(e) => setEmergencyType(e.target.value)}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                    >
                      <option value="">Select emergency type</option>
                      <option value="cardiac">Cardiac Emergency</option>
                      <option value="respiratory">Respiratory Distress</option>
                      <option value="trauma">Trauma/Injury</option>
                      <option value="stroke">Stroke Symptoms</option>
                      <option value="allergic">Severe Allergic Reaction</option>
                      <option value="other">Other Medical Emergency</option>
                    </select>
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="patientName">
                      Patient Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="patientName"
                      type="text"
                      value={patientName}
                      onChange={(e) => setPatientName(e.target.value)}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                      placeholder="Full name"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="patientPhone">
                      Contact Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="patientPhone"
                      type="tel"
                      value={patientPhone}
                      onChange={(e) => setPatientPhone(e.target.value)}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                      placeholder="Mobile number"
                    />
                  </div>
                  <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="patientLocation">
                      Current Location <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="patientLocation"
                      type="text"
                      value={patientLocation}
                      onChange={(e) => setPatientLocation(e.target.value)}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                      placeholder="Address or location details"
                    />
                  </div>
                  <div className="flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={closeModal}
                      disabled={isLoading}
                      className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 disabled:opacity-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50 flex items-center"
                    >
                      {isLoading ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Processing...
                        </>
                      ) : (
                        'Request Emergency Help'
                      )}
                    </button>
                  </div>
                </form>
              </>
            ) : (
              <div className="p-6 text-center">
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
                  <svg className="h-10 w-10 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Emergency Request Submitted</h3>
                <p className="text-gray-600 mb-6">
                  Medical personnel have been notified and an ambulance is being dispatched to your location. Please stay on the line.
                </p>
                <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4 mb-6 text-left">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-yellow-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-yellow-700">
                        Please call <a href="tel:+108" className="font-medium underline">108</a> directly if this is a life-threatening emergency.
                      </p>
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={closeModal}
                  className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-red-500"
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
} 