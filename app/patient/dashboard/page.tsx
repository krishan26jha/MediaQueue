'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/ui/tabs";

export default function PatientDashboard() {
  const [user, setUser] = useState<any>(null);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState("overview");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load user data from localStorage
    const userString = localStorage.getItem('user');
    if (userString) {
      try {
        const userData = JSON.parse(userString);
        setUser(userData);
        loadAppointments();
      } catch (error) {
        console.error('Error parsing user data:', error);
        setIsLoading(false);
      }
    } else {
      setIsLoading(false);
    }
  }, []);

  // Refresh appointments when switching to appointments tab
  useEffect(() => {
    if (activeTab === 'appointments') {
      loadAppointments();
    }
  }, [activeTab]);

  const loadAppointments = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) return;

      const response = await fetch('/api/appointments', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setAppointments(data.appointments || []);
      } else {
        console.error('Failed to fetch appointments');
      }
    } catch (error) {
      console.error('Error fetching appointments:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  // Get status badge color
  const getStatusColor = (status: string) => {
    switch (status?.toUpperCase()) {
      case 'REQUESTED':
        return 'bg-yellow-100 text-yellow-800';
      case 'CONFIRMED':
      case 'ACTIVE':
        return 'bg-green-100 text-green-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      case 'COMPLETED':
      case 'RESOLVED':
        return 'bg-blue-100 text-blue-800';
      case 'RESCHEDULED':
        return 'bg-purple-100 text-purple-800';
      case 'ONGOING':
        return 'bg-indigo-100 text-indigo-800';
      case 'SEVERE':
        return 'bg-red-100 text-red-800';
      case 'MODERATE':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Session Expired</h1>
        <p className="text-lg text-gray-600 mb-8">Please log in to access your dashboard.</p>
        <Link 
          href="/login" 
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
        >
          Go to Login
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Patient Dashboard</h1>
            <p className="mt-1 text-gray-500">
              Manage your health information and appointments
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex space-x-3">
            <Link
              href="/"
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              <svg className="-ml-1 mr-2 h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Home
            </Link>
            <button
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
              onClick={() => window.print()}
            >
              <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              Print Records
            </button>
          </div>
        </div>

        {/* Patient Info Card */}
        <div className="bg-white shadow rounded-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="md:col-span-1">
              <div className="h-32 w-32 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 text-4xl font-bold">
                {user.name.split(' ').map((n: string) => n[0]).join('')}
              </div>
            </div>
            <div className="md:col-span-3">
              <h2 className="text-2xl font-bold mb-2">{user.name}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <div>
                  <p className="text-gray-600">Email: {user.email}</p>
                  <p className="text-gray-600">Phone: {user.phoneNumber || 'Not provided'}</p>
                  <p className="text-gray-600">Date of Birth: {formatDate(user.dateOfBirth)}</p>
                </div>
                <div>
                  <p className="text-gray-600">Patient ID: {user.patientId}</p>
                  <p className="text-gray-600">Blood Type: {user.bloodType || 'Not recorded'}</p>
                  <p className="text-gray-600">Preferred Hospital: {user.preferredHospital?.name || 'None'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <Tabs 
            defaultValue="overview" 
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <div className="px-6 pt-4 border-b">
              <TabsList className="flex space-x-8">
                <TabsTrigger value="overview" className="px-1 py-3 text-sm font-medium">
                  Overview
                </TabsTrigger>
                <TabsTrigger value="appointments" className="px-1 py-3 text-sm font-medium">
                  Appointments
                </TabsTrigger>
                <TabsTrigger value="medical-history" className="px-1 py-3 text-sm font-medium">
                  Medical History
                </TabsTrigger>
                <TabsTrigger value="medications" className="px-1 py-3 text-sm font-medium">
                  Medications
                </TabsTrigger>
                <TabsTrigger value="lab-results" className="px-1 py-3 text-sm font-medium">
                  Lab Results
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="overview" className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Latest Vital Signs */}
                <div className="bg-white border rounded-lg shadow-sm p-4">
                  <h3 className="font-medium text-gray-900 mb-4">Latest Vital Signs</h3>
                  {user.vitalSigns && user.vitalSigns.length > 0 ? (
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Date:</span>
                        <span className="font-medium">{formatDate(user.vitalSigns[0].date)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Blood Pressure:</span>
                        <span className="font-medium">{user.vitalSigns[0].bloodPressure}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Heart Rate:</span>
                        <span className="font-medium">{user.vitalSigns[0].heartRate} bpm</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Temperature:</span>
                        <span className="font-medium">{user.vitalSigns[0].temperature}°F</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Weight:</span>
                        <span className="font-medium">{user.vitalSigns[0].weight}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Oxygen Level:</span>
                        <span className="font-medium">{user.vitalSigns[0].oxygenLevel}</span>
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-500 italic">No vital signs recorded</p>
                  )}
                </div>

                {/* Insurance */}
                <div className="bg-white border rounded-lg shadow-sm p-4">
                  <h3 className="font-medium text-gray-900 mb-4">Insurance Information</h3>
                  {user.healthInsurance ? (
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Provider:</span>
                        <span className="font-medium">{user.healthInsurance.provider}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Policy Number:</span>
                        <span className="font-medium">{user.healthInsurance.policyNumber}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Expiry Date:</span>
                        <span className="font-medium">{formatDate(user.healthInsurance.expiryDate)}</span>
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-500 italic">No insurance information available</p>
                  )}
                </div>

                {/* Allergies */}
                <div className="bg-white border rounded-lg shadow-sm p-4">
                  <h3 className="font-medium text-gray-900 mb-4">Allergies</h3>
                  {user.allergies && user.allergies.length > 0 ? (
                    <ul className="divide-y divide-gray-200">
                      {user.allergies.map((allergy: any, index: number) => (
                        <li key={index} className="py-2">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium text-gray-900">{allergy.substance}</p>
                              <p className="text-sm text-gray-500">{allergy.reaction}</p>
                            </div>
                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(allergy.severity)}`}>
                              {allergy.severity}
                            </span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-500 italic">No allergies recorded</p>
                  )}
                </div>

                {/* Upcoming Appointments */}
                <div className="bg-white border rounded-lg shadow-sm p-4">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-medium text-gray-900">Upcoming Appointments</h3>
                    <button 
                      onClick={() => setActiveTab("appointments")}
                      className="text-sm text-blue-600 hover:text-blue-800"
                    >
                      View All
                    </button>
                  </div>
                  {appointments && appointments.filter((apt: any) => 
                    apt.status === 'REQUESTED' || apt.status === 'CONFIRMED' || apt.status === 'SCHEDULED'
                  ).length > 0 ? (
                    <ul className="divide-y divide-gray-200">
                      {appointments
                        .filter((apt: any) => apt.status === 'REQUESTED' || apt.status === 'CONFIRMED' || apt.status === 'SCHEDULED')
                        .slice(0, 2)
                        .map((appointment: any) => (
                          <li key={appointment.id} className="py-2">
                            <div>
                              <p className="font-medium text-gray-900">{appointment.reasonForVisit}</p>
                              <div className="flex justify-between text-sm">
                                <span className="text-gray-500">
                                  {formatDate(appointment.appointmentDate)}, {' '}
                                  {new Date(appointment.startTime).toLocaleTimeString('en-US', { 
                                    hour: 'numeric', 
                                    minute: '2-digit',
                                    hour12: true 
                                  })}
                                </span>
                                <span className="text-gray-500">{appointment.doctor?.user?.name || 'TBD'}</span>
                              </div>
                              <div className="text-xs text-gray-400">
                                Status: {appointment.status}
                              </div>
                            </div>
                          </li>
                        ))}
                    </ul>
                  ) : (
                    <p className="text-gray-500 italic">No upcoming appointments</p>
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="appointments" className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-medium text-gray-900">Your Appointments</h3>
                <div className="flex space-x-3">
                  <button
                    onClick={loadAppointments}
                    className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                  >
                    <svg className="-ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Refresh
                  </button>
                  <Link
                    href="/patient/request-appointment"
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                  >
                    <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Request New Appointment
                  </Link>
                </div>
              </div>
              {appointments && appointments.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date & Time
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Reason
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Doctor
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Department
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {appointments.map((appointment: any) => (
                        <tr key={appointment.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {formatDate(appointment.appointmentDate)}<br/>
                            <span className="text-gray-500 text-xs">
                              {new Date(appointment.startTime).toLocaleTimeString('en-US', { 
                                hour: 'numeric', 
                                minute: '2-digit',
                                hour12: true 
                              })}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {appointment.reasonForVisit}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {appointment.doctor?.user?.name || 'TBD'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {appointment.doctor?.department?.name || 'N/A'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(appointment.status)}`}>
                              {appointment.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-6">
                  <p className="text-gray-500">No appointments found</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="medical-history" className="p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Medical History</h3>
              {user.medicalHistory && user.medicalHistory.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Condition
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Diagnosed Date
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Notes
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {user.medicalHistory.map((condition: any) => (
                        <tr key={condition.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {condition.condition}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDate(condition.diagnosedDate)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(condition.status)}`}>
                              {condition.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500">
                            {condition.notes}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-6">
                  <p className="text-gray-500">No medical history records found</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="medications" className="p-6">
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-4">Current Medications</h3>
                  {user.medications && user.medications.filter((med: any) => !med.endDate).length > 0 ? (
                    <ul className="divide-y divide-gray-200 border rounded-lg overflow-hidden">
                      {user.medications
                        .filter((med: any) => !med.endDate)
                        .map((medication: any) => (
                          <li key={medication.id} className="p-4 hover:bg-gray-50">
                            <div className="flex justify-between">
                              <div>
                                <h4 className="font-medium text-gray-900">{medication.name}</h4>
                                <p className="text-sm text-gray-500">
                                  {medication.dosage}, {medication.frequency}
                                </p>
                                <p className="text-sm text-gray-500 mt-1">
                                  Started: {formatDate(medication.startDate)}
                                </p>
                              </div>
                              <div className="text-sm text-gray-500 text-right">
                                <p>Prescribed by:</p>
                                <p className="font-medium">{medication.prescribedBy}</p>
                              </div>
                            </div>
                          </li>
                        ))}
                    </ul>
                  ) : (
                    <p className="text-gray-500 italic">No current medications</p>
                  )}
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-4">Prescriptions</h3>
                  {user.prescriptions && user.prescriptions.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Medication
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Dosage
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Instructions
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Prescribed Date
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Status
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {user.prescriptions.map((prescription: any) => (
                            <tr key={prescription.id} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {prescription.medication}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {prescription.dosage}
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-500">
                                {prescription.instructions}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {formatDate(prescription.prescribedDate)}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(prescription.status)}`}>
                                  {prescription.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className="text-gray-500 italic">No prescriptions found</p>
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="lab-results" className="p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Lab Results</h3>
              {user.labResults && user.labResults.length > 0 ? (
                <div className="space-y-6">
                  {user.labResults.map((result: any) => (
                    <div key={result.id} className="bg-white border rounded-lg shadow-sm p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium text-gray-900">{result.testName}</h4>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(result.result)}`}>
                          {result.result}
                        </span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-500">Date: {formatDate(result.date)}</p>
                          <p className="text-sm text-gray-500">Performed by: {result.performedBy}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Reference Range: {result.referenceRange}</p>
                          <p className="text-sm text-gray-500">Notes: {result.notes}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <p className="text-gray-500">No lab results found</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
} 