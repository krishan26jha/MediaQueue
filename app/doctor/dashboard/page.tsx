'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import PeakHoursChart from '../../components/PeakHoursChart'

// Types
interface QueuePatient {
  id: string
  name: string
  urgency: 'EMERGENCY' | 'HIGH' | 'NORMAL' | 'LOW'
  initialPosition: number
  currentPosition: number
  estimatedWaitTime: number
  checkInTime: Date
  notified: boolean
  status: 'READY' | 'WAITING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED'
}

interface Medication {
  name: string
  dosage: string
  frequency: string
  duration: string
  instructions: string
}

interface Prescription {
  diagnosis: string
  medications: Medication[]
  recommendations: string
  followUpDate: string
}

// Mock doctor data
const DOCTOR = {
  id: 'doc_123',
  name: 'Dr. Ananya Gupta',
  department: 'General Medicine',
  hospitalId: 'hosp_1'
}

// Mock consultation history
const MOCK_HISTORY = [
  {
    id: 'cons_1',
    patientName: 'Rakesh Kumar',
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    diagnosis: 'Common Cold',
    status: 'COMPLETED',
    followUpDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  },
  {
    id: 'cons_2',
    patientName: 'Meera Agarwal',
    date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    diagnosis: 'Hypertension',
    status: 'COMPLETED',
    followUpDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
  },
  {
    id: 'cons_3',
    patientName: 'Sunil Mehta',
    date: new Date(Date.now() - 12 * 60 * 60 * 1000),
    diagnosis: 'Migraine',
    status: 'COMPLETED',
    followUpDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
  }
]

// Mock peak hours data
const PEAK_HOURS_DATA = [
  { hour: '09:00', patients: 15, waitTime: 25, staffCount: 3, efficiency: 85 },
  { hour: '10:00', patients: 22, waitTime: 35, staffCount: 4, efficiency: 82 },
  { hour: '11:00', patients: 25, waitTime: 40, staffCount: 4, efficiency: 78 },
  { hour: '12:00', patients: 28, waitTime: 45, staffCount: 5, efficiency: 75 },
  { hour: '13:00', patients: 30, waitTime: 50, staffCount: 5, efficiency: 72 },
  { hour: '14:00', patients: 35, waitTime: 55, staffCount: 6, efficiency: 70 },
  { hour: '15:00', patients: 32, waitTime: 45, staffCount: 5, efficiency: 76 },
  { hour: '16:00', patients: 25, waitTime: 35, staffCount: 4, efficiency: 80 },
  { hour: '17:00', patients: 20, waitTime: 30, staffCount: 4, efficiency: 84 },
  { hour: '18:00', patients: 15, waitTime: 25, staffCount: 3, efficiency: 86 }
]

export default function DoctorDashboard() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('queue')
  const [queueData, setQueueData] = useState<QueuePatient[]>([])
  const [currentPatient, setCurrentPatient] = useState<QueuePatient | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [prescriptionData, setPrescriptionData] = useState({
    diagnosis: '',
    medications: [{ name: '', dosage: '', frequency: '', duration: '', instructions: '' }],
    recommendations: '',
    followUpDate: ''
  })
  const [showPrescriptionForm, setShowPrescriptionForm] = useState(false)
  const [notification, setNotification] = useState('')
  
  // Load queue data
  useEffect(() => {
    fetchQueueData()
    
    // Refresh queue data every 30 seconds
    const interval = setInterval(fetchQueueData, 30000)
    return () => clearInterval(interval)
  }, [])
  
  // Fetch queue data from API
  const fetchQueueData = async () => {
    try {
      setLoading(true)
      
      // For demo, always use mock data
      const mockQueueData: QueuePatient[] = [
        {
          id: 'pat_1',
          name: 'Rakesh Kumar',
          urgency: 'HIGH',
          initialPosition: 1,
          currentPosition: 1,
          estimatedWaitTime: 15,
          checkInTime: new Date(Date.now() - 30 * 60000),
          notified: true,
          status: 'READY'
        },
        {
          id: 'pat_2',
          name: 'Kavita Sharma',
          urgency: 'EMERGENCY',
          initialPosition: 2,
          currentPosition: 2,
          estimatedWaitTime: 5,
          checkInTime: new Date(Date.now() - 15 * 60000),
          notified: false,
          status: 'WAITING'
        },
        {
          id: 'pat_3',
          name: 'Deepak Agarwal',
          urgency: 'NORMAL',
          initialPosition: 3,
          currentPosition: 3,
          estimatedWaitTime: 35,
          checkInTime: new Date(Date.now() - 45 * 60000),
          notified: false,
          status: 'WAITING'
        },
        {
          id: 'pat_4',
          name: 'Pooja Verma',
          urgency: 'LOW',
          initialPosition: 4,
          currentPosition: 4,
          estimatedWaitTime: 45,
          checkInTime: new Date(Date.now() - 20 * 60000),
          notified: false,
          status: 'WAITING'
        },
        {
          id: 'pat_5',
          name: 'Rohit Jain',
          urgency: 'NORMAL',
          initialPosition: 5,
          currentPosition: 5,
          estimatedWaitTime: 50,
          checkInTime: new Date(Date.now() - 10 * 60000),
          notified: false,
          status: 'WAITING'
        }
      ]
      
      setQueueData(mockQueueData)
      setError('')
    } catch (err) {
      console.error('Error fetching queue:', err)
      setError('Failed to load queue data. Please try again.')
    } finally {
      setLoading(false)
    }
  }
  
  // Handle starting patient consultation
  const startConsultation = async (patient: QueuePatient) => {
    try {
      // Update local state only for demo
      const updatedPatient = { ...patient, status: 'IN_PROGRESS' as const }
      setCurrentPatient(updatedPatient)
      setQueueData(queueData.map(p => 
        p.id === patient.id ? updatedPatient : p
      ))
      setActiveTab('consultation')
      setShowPrescriptionForm(false)
      
      // Reset prescription form
      setPrescriptionData({
        diagnosis: '',
        medications: [{ name: '', dosage: '', frequency: '', duration: '', instructions: '' }],
        recommendations: '',
        followUpDate: ''
      })
      
      setNotification(`Started consultation with ${patient.name}`)
    } catch (err) {
      console.error('Error starting consultation:', err)
      setError('Failed to start consultation. Please try again.')
    }
  }
  
  // Complete patient consultation
  const completeConsultation = async () => {
    if (!currentPatient) return
    
    try {
      // Update local state only for demo
      setQueueData(queueData.filter(p => p.id !== currentPatient.id))
      setNotification(`Completed consultation with ${currentPatient.name}`)
      setCurrentPatient(null)
      setActiveTab('queue')
    } catch (err) {
      console.error('Error completing consultation:', err)
      setError('Failed to complete consultation. Please try again.')
    }
  }
  
  // Handle adding prescription
  const handlePrescription = () => {
    setShowPrescriptionForm(true)
  }
  
  // Add a new medication field
  const addMedication = () => {
    setPrescriptionData({
      ...prescriptionData,
      medications: [
        ...prescriptionData.medications,
        { name: '', dosage: '', frequency: '', duration: '', instructions: '' }
      ]
    })
  }
  
  // Remove a medication field
  const removeMedication = (index: number) => {
    const updatedMedications = [...prescriptionData.medications]
    updatedMedications.splice(index, 1)
    setPrescriptionData({
      ...prescriptionData,
      medications: updatedMedications
    })
  }
  
  // Handle medication field changes
  const handleMedicationChange = (index: number, field: keyof Medication, value: string) => {
    const updatedMedications = [...prescriptionData.medications]
    updatedMedications[index] = {
      ...updatedMedications[index],
      [field]: value
    }
    setPrescriptionData({
      ...prescriptionData,
      medications: updatedMedications
    })
  }
  
  // Handle form field changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setPrescriptionData({
      ...prescriptionData,
      [name]: value
    })
  }
  
  // Submit prescription
  const submitPrescription = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!currentPatient) return
    
    try {
      // Filter out empty medications
      const validMedications = prescriptionData.medications.filter(m => m.name.trim() !== '')
      
      // Create prescription through API
      const response = await fetch('/api/prescriptions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          patientId: currentPatient.id,
          doctorId: DOCTOR.id,
          hospitalId: DOCTOR.hospitalId,
          departmentId: DOCTOR.department,
          diagnosis: prescriptionData.diagnosis,
          medications: validMedications,
          testReports: [],
          recommendations: prescriptionData.recommendations,
          followUpDate: prescriptionData.followUpDate || undefined
        })
      })
      
      if (!response.ok) {
        throw new Error('Failed to create prescription')
      }
      
      setNotification('Prescription created successfully')
      setShowPrescriptionForm(false)
    } catch (err) {
      console.error('Error creating prescription:', err)
      setError('Failed to create prescription. Please try again.')
    }
  }
  
  // Cancel prescription form
  const cancelPrescription = () => {
    setShowPrescriptionForm(false)
  }
  
  // Format date for display
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }
  
  // Get urgency level color
  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'EMERGENCY': return 'text-red-600 font-bold'
      case 'HIGH': return 'text-orange-500 font-semibold'
      case 'NORMAL': return 'text-blue-500'
      case 'LOW': return 'text-green-500'
      default: return 'text-gray-500'
    }
  }
  
  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      {/* Doctor dashboard header */}
      <header className="bg-primary-700 text-white shadow-md">
        <div className="container mx-auto px-4 py-8 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Doctor Dashboard</h1>
            <p className="text-primary-200">{DOCTOR.name} - {DOCTOR.department}</p>
          </div>
          <div className="flex items-center space-x-4">
            <span className="bg-green-500 px-3 py-1 rounded-full text-sm">Online</span>
            <Link href="/" className="text-primary-200 hover:text-white underline">
              Sign Out
            </Link>
          </div>
        </div>
      </header>
      
      {/* Main content */}
      <main className="container mx-auto px-4 py-8">
        {/* Notification */}
        {notification && (
          <div className="mb-6 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative">
            {notification}
            <button 
              className="absolute top-0 right-0 px-4 py-3"
              onClick={() => setNotification('')}
            >
              <span className="sr-only">Close</span>
              <svg className="h-6 w-6 text-green-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}
        
        {/* Error */}
        {error && (
          <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
            {error}
            <button 
              className="absolute top-0 right-0 px-4 py-3"
              onClick={() => setError('')}
            >
              <span className="sr-only">Close</span>
              <svg className="h-6 w-6 text-red-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}
        
        {/* Tabs */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('queue')}
              className={`py-4 px-1 ${
                activeTab === 'queue'
                  ? 'border-b-2 border-primary-500 text-primary-600'
                  : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Patient Queue
            </button>
            <button
              onClick={() => setActiveTab('consultation')}
              className={`py-4 px-1 ${
                activeTab === 'consultation'
                  ? 'border-b-2 border-primary-500 text-primary-600'
                  : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              disabled={!currentPatient}
            >
              Current Consultation
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`py-4 px-1 ${
                activeTab === 'history'
                  ? 'border-b-2 border-primary-500 text-primary-600'
                  : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Consultation History
            </button>
          </nav>
        </div>
        
        {/* Queue Tab */}
        {activeTab === 'queue' && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Patient Queue</h2>
              <button 
                onClick={fetchQueueData}
                className="bg-primary-100 text-primary-600 px-4 py-2 rounded hover:bg-primary-200 flex items-center"
              >
                <svg className="h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Refresh Queue
              </button>
            </div>
            
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div>
                <p className="mt-4 text-gray-500">Loading queue data...</p>
              </div>
            ) : queueData.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg shadow">
                <svg className="mx-auto h-12 w-12 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No patients in queue</h3>
                <p className="mt-1 text-sm text-gray-500">Queue is currently empty.</p>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Position
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Patient
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Urgency
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Check-in Time
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {queueData
                      .filter(patient => patient.status !== 'COMPLETED' && patient.status !== 'CANCELLED')
                      .sort((a, b) => a.currentPosition - b.currentPosition)
                      .map(patient => (
                        <tr key={patient.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {patient.status === 'IN_PROGRESS' ? '-' : patient.currentPosition}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{patient.name}</div>
                            <div className="text-sm text-gray-500">ID: {patient.id}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className={`text-sm ${getUrgencyColor(patient.urgency)}`}>
                              {patient.urgency}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {formatDate(patient.checkInTime)}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              patient.status === 'READY' 
                                ? 'bg-green-100 text-green-800' 
                                : patient.status === 'WAITING' 
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-blue-100 text-blue-800'
                            }`}>
                              {patient.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            {patient.status === 'IN_PROGRESS' ? (
                              <span className="text-gray-400">In Progress</span>
                            ) : (
                              <button
                                onClick={() => startConsultation(patient)}
                                className="text-primary-600 hover:text-primary-900"
                              >
                                Start Consultation
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
        
        {/* Current Consultation Tab */}
        {activeTab === 'consultation' && (
          <div>
            {!currentPatient ? (
              <div className="text-center py-12 bg-white rounded-lg shadow">
                <svg className="mx-auto h-12 w-12 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No active consultation</h3>
                <p className="mt-1 text-sm text-gray-500">Start a consultation from the queue.</p>
                <button
                  onClick={() => setActiveTab('queue')}
                  className="mt-6 bg-primary-600 text-white px-4 py-2 rounded hover:bg-primary-700"
                >
                  Go to Queue
                </button>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-2xl font-bold mb-1">{currentPatient.name}</h2>
                    <p className="text-gray-500">
                      Patient ID: {currentPatient.id} • Urgency: 
                      <span className={getUrgencyColor(currentPatient.urgency)}>
                        {' '}{currentPatient.urgency}
                      </span>
                    </p>
                  </div>
                  <div className="flex space-x-3">
                    <button
                      onClick={handlePrescription}
                      className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                    >
                      Issue Prescription
                    </button>
                    <button
                      onClick={completeConsultation}
                      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                      Complete Consultation
                    </button>
                  </div>
                </div>
                
                {/* Prescription Form */}
                {showPrescriptionForm && (
                  <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
                    <div className="relative top-20 mx-auto p-5 border w-full max-w-3xl shadow-lg rounded-md bg-white">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-medium">Issue Prescription</h3>
                        <button onClick={cancelPrescription} className="text-gray-400 hover:text-gray-500">
                          <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>

                      <form onSubmit={submitPrescription} className="space-y-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Diagnosis
                          </label>
                          <textarea
                            value={prescriptionData.diagnosis}
                            onChange={(e) => setPrescriptionData({...prescriptionData, diagnosis: e.target.value})}
                            rows={3}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Medications
                          </label>
                          {prescriptionData.medications.map((med, index) => (
                            <div key={index} className="p-4 border rounded-md mb-4 bg-gray-50">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Name
                                  </label>
                                  <input
                                    type="text"
                                    value={med.name}
                                    onChange={(e) => handleMedicationChange(index, 'name', e.target.value)}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                                  />
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Dosage
                                  </label>
                                  <input
                                    type="text"
                                    value={med.dosage}
                                    onChange={(e) => handleMedicationChange(index, 'dosage', e.target.value)}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                                  />
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Frequency
                                  </label>
                                  <input
                                    type="text"
                                    value={med.frequency}
                                    onChange={(e) => handleMedicationChange(index, 'frequency', e.target.value)}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                                  />
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Duration
                                  </label>
                                  <input
                                    type="text"
                                    value={med.duration}
                                    onChange={(e) => handleMedicationChange(index, 'duration', e.target.value)}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                                  />
                                </div>
                              </div>
                              <div className="mt-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Instructions
                                </label>
                                <textarea
                                  value={med.instructions}
                                  onChange={(e) => handleMedicationChange(index, 'instructions', e.target.value)}
                                  rows={2}
                                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                                />
                              </div>
                              {index > 0 && (
                                <button
                                  type="button"
                                  onClick={() => removeMedication(index)}
                                  className="mt-2 text-red-600 hover:text-red-700"
                                >
                                  Remove Medication
                                </button>
                              )}
                            </div>
                          ))}
                          <button
                            type="button"
                            onClick={addMedication}
                            className="mt-2 text-primary-600 hover:text-primary-700"
                          >
                            + Add Another Medication
                          </button>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Recommendations
                          </label>
                          <textarea
                            value={prescriptionData.recommendations}
                            onChange={(e) => setPrescriptionData({...prescriptionData, recommendations: e.target.value})}
                            rows={3}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Follow-up Date
                          </label>
                          <input
                            type="date"
                            value={prescriptionData.followUpDate}
                            onChange={(e) => setPrescriptionData({...prescriptionData, followUpDate: e.target.value})}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                          />
                        </div>

                        <div className="flex justify-end space-x-3">
                          <button
                            type="button"
                            onClick={cancelPrescription}
                            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700"
                          >
                            Issue Prescription
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
        
        {/* History Tab */}
        {activeTab === 'history' && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Consultation History</h2>
            <div className="bg-white rounded-lg shadow overflow-hidden">
              {MOCK_HISTORY.length === 0 ? (
                <div className="text-center py-12">
                  <svg className="mx-auto h-12 w-12 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No consultation history</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Your consultation history will appear here.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Patient
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Diagnosis
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Follow-up
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {MOCK_HISTORY.map((consultation) => (
                        <tr key={consultation.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {consultation.patientName}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {consultation.date.toLocaleDateString()}
                            </div>
                            <div className="text-sm text-gray-500">
                              {consultation.date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {consultation.diagnosis}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {consultation.followUpDate.toLocaleDateString()}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            <div className="mt-8">
              <h3 className="text-lg font-semibold mb-4">Peak Hours Analysis</h3>
              <PeakHoursChart data={PEAK_HOURS_DATA} />
            </div>
          </div>
        )}
      </main>
    </div>
  )
} 