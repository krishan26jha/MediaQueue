'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { QueuePatient } from '@/lib/queue/smartQueueManager'
import { Prescription, TestReport } from '@/lib/prescriptions/prescriptionManager'
import { UrgencyLevel } from '@/lib/ai/waitTimePredictor'

// Mock user/patient data
const PATIENT = {
  id: 'patient-123',
  name: 'Rakesh Kumar',
  age: 42,
  gender: 'Male',
  email: 'rakesh.kumar@example.com',
  phone: '+91 98765 43210',
  address: '123 ABC, New Delhi, Delhi 110001',
  dateOfBirth: '1982-01-15',
  hospitalId: 'hosp_1',
  medicalHistory: ['Hypertension', 'Type 2 Diabetes'],
  appointments: [
    {
      id: 'appt-456',
      date: new Date('2024-04-20T14:30:00'),
      doctor: 'Dr. Kavya Sharma',
      department: 'Cardiology',
      status: 'Upcoming',
      hospital: 'General Hospital'
    }
  ]
}

// Update patient queue status to use the correct UrgencyLevel type
const mockQueueStatus = {
  id: PATIENT.id,
  name: PATIENT.name,
  urgency: UrgencyLevel.NORMAL,
  initialPosition: 3,
  currentPosition: 2, // Position improved from initial
  estimatedWaitTime: 15,
  checkInTime: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
  notified: false,
  status: 'WAITING' as const
}

export default function PatientProfile() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('queue')
  const [queueData, setQueueData] = useState<QueuePatient | null>(null)
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [notification, setNotification] = useState('')
  const [queueUpdates, setQueueUpdates] = useState<{oldPosition: number, newPosition: number, reason: string}[]>([])
  
  // Load patient data
  useEffect(() => {
    fetchQueueStatus()
    fetchPrescriptions()
    
    // Refresh queue status every 15 seconds
    const interval = setInterval(fetchQueueStatus, 15000)
    return () => clearInterval(interval)
  }, [])
  
  // Fetch queue status from API
  const fetchQueueStatus = async () => {
    try {
      setLoading(true)
      // In a real app, fetch from real API endpoint
      const response = await fetch(`/api/queue?hospitalId=${PATIENT.hospitalId}&patientId=${PATIENT.id}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch queue status')
      }
      
      const data = await response.json()
      
      if (data.patient) {
        setQueueData(data.patient)
        
        // If position changed, add to updates
        if (queueData && queueData.currentPosition !== data.patient.currentPosition) {
          setQueueUpdates(prev => [
            {
              oldPosition: queueData.currentPosition,
              newPosition: data.patient.currentPosition,
              reason: 'Queue position updated based on urgency levels and wait times'
            },
            ...prev
          ])
          
          // Show notification if position improved
          if (data.patient.currentPosition < queueData.currentPosition) {
            setNotification(`Your position in the queue has been updated to ${data.patient.currentPosition}`)
          }
        }
      }
      
      setError('')
    } catch (err) {
      console.error('Error fetching queue status:', err)
      setError('Failed to load queue status. Please try again.')
      
      // For demo, add mock data
      setQueueData({
        id: PATIENT.id,
        name: PATIENT.name,
        urgency: UrgencyLevel.NORMAL,
        initialPosition: 3,
        currentPosition: 2, // Position improved from initial
        estimatedWaitTime: 15,
        checkInTime: new Date(Date.now() - 20 * 60000),
        notified: false,
        status: 'WAITING'
      })
      
      // Add mock queue updates
      if (!queueUpdates.length) {
        setQueueUpdates([
          {
            oldPosition: 3,
            newPosition: 2,
            reason: 'Queue position updated based on urgency levels and wait times'
          }
        ])
      }
    } finally {
      setLoading(false)
    }
  }
  
  // Fetch prescriptions from API
  const fetchPrescriptions = async () => {
    try {
      // In a real app, fetch from real API endpoint
      const response = await fetch(`/api/prescriptions?patientId=${PATIENT.id}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch prescriptions')
      }
      
      const data = await response.json()
      setPrescriptions(data.prescriptions || [])
    } catch (err) {
      console.error('Error fetching prescriptions:', err)
      
      // For demo, add mock data
      setPrescriptions([
        {
          id: 'pres_123',
          patientId: PATIENT.id,
          doctorId: 'doc_456',
          hospitalId: 'hosp_1',
          departmentId: 'cardiology',
          diagnosis: 'Mild hypertension',
          medications: [
            {
              name: 'Lisinopril',
              dosage: '10mg',
              frequency: 'Once daily',
              duration: '3 months',
              instructions: 'Take in the morning with food'
            },
            {
              name: 'Aspirin',
              dosage: '81mg',
              frequency: 'Once daily',
              duration: '3 months',
              instructions: 'Take with food'
            }
          ],
          testReports: [
            {
              name: 'Blood Pressure Reading',
              date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
              result: '140/90 mmHg',
              notes: 'Slightly elevated',
              fileUrl: '/reports/bp_123.pdf'
            },
            {
              name: 'ECG',
              date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
              result: 'Normal sinus rhythm',
              notes: 'No abnormalities detected',
              fileUrl: '/reports/ecg_123.pdf'
            }
          ],
          recommendations: 'Reduce salt intake. Exercise at least 30 minutes daily. Monitor blood pressure weekly.',
          followUpDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
          updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
          isActive: true
        }
      ])
    }
  }
  
  // Format date for display
  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString()
  }
  
  // Format time for display
  const formatTime = (date: Date | string) => {
    return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }
  
  // Format wait time (minutes)
  const formatWaitTime = (minutes: number): string => {
    if (minutes < 60) {
      return `${minutes} minutes`;
    } else {
      const hours = Math.floor(minutes / 60);
      const remainingMinutes = minutes % 60;
      return `${hours} hour${hours > 1 ? 's' : ''} ${remainingMinutes > 0 ? `${remainingMinutes} min` : ''}`;
    }
  }
  
  // Calculate queue progress percentage
  const getQueueProgress = () => {
    if (!queueData) return 0
    
    const { initialPosition, currentPosition } = queueData
    
    if (initialPosition <= 1) return 100
    
    const progress = ((initialPosition - currentPosition) / initialPosition) * 100
    return Math.max(0, Math.min(100, progress))
  }
  
  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      {/* Patient profile header */}
      <header className="bg-primary-700 text-white shadow-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Patient Portal</h1>
            <p className="text-primary-200">Welcome, {PATIENT.name}</p>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/" className="text-primary-200 hover:text-white underline">
              Sign Out
            </Link>
          </div>
        </div>
      </header>
      
      {/* Main content */}
      <main className="container mx-auto px-4 py-6">
        {/* Notification */}
        {notification && (
          <div className="mb-6 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
            {notification}
            <button 
              className="float-right text-green-700"
              onClick={() => setNotification('')}
            >
              &times;
            </button>
          </div>
        )}
        
        {/* Error */}
        {error && (
          <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
            <button 
              className="float-right text-red-700"
              onClick={() => setError('')}
            >
              &times;
            </button>
          </div>
        )}
        
        {/* Profile summary */}
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="md:col-span-1">
              <div className="h-32 w-32 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 text-4xl font-bold">
                {PATIENT.name.split(' ').map(n => n[0]).join('')}
              </div>
            </div>
            <div className="md:col-span-3">
              <h2 className="text-2xl font-bold mb-2">{PATIENT.name}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <div>
                  <p className="text-gray-600">Email: {PATIENT.email}</p>
                  <p className="text-gray-600">Phone: {PATIENT.phone}</p>
                </div>
                <div>
                  <p className="text-gray-600">Date of Birth: {PATIENT.dateOfBirth}</p>
                  <p className="text-gray-600">Patient ID: {PATIENT.id}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Tabs */}
        <div className="mb-6 border-b border-gray-200">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('queue')}
              className={`py-4 px-1 ${
                activeTab === 'queue'
                  ? 'border-b-2 border-primary-500 text-primary-600'
                  : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Queue Status
            </button>
            <button
              onClick={() => setActiveTab('prescriptions')}
              className={`py-4 px-1 ${
                activeTab === 'prescriptions'
                  ? 'border-b-2 border-primary-500 text-primary-600'
                  : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Prescriptions & Reports
            </button>
            <button
              onClick={() => setActiveTab('appointments')}
              className={`py-4 px-1 ${
                activeTab === 'appointments'
                  ? 'border-b-2 border-primary-500 text-primary-600'
                  : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Appointments
            </button>
          </nav>
        </div>
        
        {/* Queue Status Tab */}
        {activeTab === 'queue' && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Current Queue Status</h2>
              <button 
                onClick={fetchQueueStatus}
                className="bg-primary-100 text-primary-600 px-4 py-2 rounded hover:bg-primary-200"
              >
                Refresh Status
              </button>
            </div>
            
            {loading && !queueData ? (
              <p className="text-center py-4">Loading queue status...</p>
            ) : !queueData ? (
              <div className="bg-white rounded-lg shadow p-6 text-center">
                <p className="text-lg text-gray-500 mb-4">You are not currently in any queue</p>
                <Link
                  href="/check-in"
                  className="bg-primary-600 text-white px-4 py-2 rounded hover:bg-primary-700"
                >
                  Check-in Now
                </Link>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-1">Your Queue Status</h3>
                      <p className="text-gray-500">Checked in at {formatTime(queueData.checkInTime)}</p>
                    </div>
                    <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
                      {queueData.status}
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <div className="flex justify-between mb-1">
                      <span className="text-gray-700">Current Position: <span className="font-bold text-primary-600">{queueData.currentPosition}</span></span>
                      <span className="text-gray-700">Initial Position: {queueData.initialPosition}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-4">
                      <div 
                        className="bg-primary-600 h-4 rounded-full" 
                        style={{ width: `${getQueueProgress()}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <h4 className="text-md font-semibold mb-2">Estimated Wait Time</h4>
                    <div className="bg-blue-50 p-4 rounded">
                      <div className="text-2xl font-bold text-blue-700 mb-1">
                        {formatWaitTime(queueData.estimatedWaitTime)}
                      </div>
                      <p className="text-blue-500 text-sm">
                        {queueData.status === 'WAITING' 
                          ? 'You will be notified when it is almost your turn'
                          : queueData.status === 'READY'
                          ? 'You are up soon! Please proceed to the waiting area'
                          : 'You are currently being seen'
                        }
                      </p>
                    </div>
                  </div>
                  
                  {queueUpdates.length > 0 && (
                    <div>
                      <h4 className="text-md font-semibold mb-2">Queue Updates</h4>
                      <div className="border rounded overflow-hidden">
                        {queueUpdates.map((update, i) => (
                          <div key={i} className="p-3 border-b last:border-b-0">
                            <div className="flex items-center mb-1">
                              <svg className="h-4 w-4 text-primary-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                              </svg>
                              <span className="text-sm font-medium">
                                Position changed: {update.oldPosition} → {update.newPosition}
                              </span>
                            </div>
                            <p className="text-xs text-gray-500 ml-6">
                              {update.reason}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
        
        {/* Prescriptions & Reports Tab */}
        {activeTab === 'prescriptions' && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Your Prescriptions</h2>
            
            {prescriptions.length === 0 ? (
              <div className="bg-white rounded-lg shadow p-6 text-center">
                <p className="text-lg text-gray-500">You don't have any prescriptions yet</p>
              </div>
            ) : (
              <div>
                {prescriptions.map((prescription) => (
                  <div key={prescription.id} className="bg-white rounded-lg shadow mb-6 overflow-hidden">
                    <div className="border-b border-gray-200 px-6 py-4">
                      <div className="flex justify-between">
                        <h3 className="text-lg font-medium text-gray-900">
                          {prescription.diagnosis}
                        </h3>
                        <span className="text-sm text-gray-500">
                          {formatDate(prescription.createdAt)}
                        </span>
                      </div>
                    </div>
                    
                    <div className="px-6 py-4">
                      <div className="mb-4">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Medications</h4>
                        <div className="space-y-3">
                          {prescription.medications.map((medication, index) => (
                            <div key={index} className="bg-gray-50 p-3 rounded border">
                              <div className="flex justify-between">
                                <div className="font-medium">{medication.name}</div>
                                <div className="text-sm">{medication.dosage}</div>
                              </div>
                              <div className="text-sm text-gray-600 mt-1">
                                {medication.frequency} for {medication.duration}
                              </div>
                              <div className="text-sm text-gray-500 mt-1">
                                {medication.instructions}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      {prescription.testReports.length > 0 && (
                        <div className="mb-4">
                          <h4 className="text-sm font-medium text-gray-700 mb-2">Test Reports</h4>
                          <div className="space-y-3">
                            {prescription.testReports.map((report, index) => (
                              <div key={index} className="bg-gray-50 p-3 rounded border">
                                <div className="flex justify-between">
                                  <div className="font-medium">{report.name}</div>
                                  <div className="text-sm">{formatDate(report.date)}</div>
                                </div>
                                <div className="text-sm text-gray-600 mt-1">
                                  Result: {report.result}
                                </div>
                                <div className="text-sm text-gray-500 mt-1">
                                  {report.notes}
                                </div>
                                {report.fileUrl && (
                                  <a 
                                    href={report.fileUrl} 
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-primary-600 hover:text-primary-800 text-sm inline-block mt-2"
                                  >
                                    View Report
                                  </a>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      <div className="mb-4">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Recommendations</h4>
                        <p className="text-gray-600">
                          {prescription.recommendations}
                        </p>
                      </div>
                      
                      {prescription.followUpDate && (
                        <div className="mb-4">
                          <h4 className="text-sm font-medium text-gray-700 mb-2">Follow-up</h4>
                          <div className="bg-yellow-50 border border-yellow-200 rounded p-3 text-yellow-800">
                            Please schedule a follow-up appointment on or around {formatDate(prescription.followUpDate)}
                          </div>
                        </div>
                      )}
                      
                      <div className="flex justify-end mt-4">
                        <button className="bg-primary-100 text-primary-600 px-4 py-2 rounded mr-2 hover:bg-primary-200">
                          Download PDF
                        </button>
                        <button className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-50">
                          Email Prescription
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        
        {/* Appointments Tab */}
        {activeTab === 'appointments' && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Your Appointments</h2>
            <div className="bg-white rounded-lg shadow p-6 text-center">
              <p className="text-lg text-gray-500 mb-4">No upcoming appointments</p>
              <Link 
                href="/check-in"
                className="bg-primary-600 text-white px-4 py-2 rounded hover:bg-primary-700"
              >
                Schedule New Appointment
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  )
} 