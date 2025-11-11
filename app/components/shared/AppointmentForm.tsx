'use client';

import { useState, useEffect } from 'react';
import { UrgencyLevel } from '@/lib/types';

interface Doctor {
  id: string;
  user: {
    name: string;
  };
  specialization: string;
  department: {
    name: string;
  };
}

interface Hospital {
  id: string;
  name: string;
  departments: {
    id: string;
    name: string;
  }[];
}

interface AppointmentFormProps {
  patientId?: string;
  userId?: string;
  onSuccess?: (appointment: any) => void;
  onCancel?: () => void;
}

export default function AppointmentForm({ patientId, userId, onSuccess, onCancel }: AppointmentFormProps) {
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [selectedHospitalId, setSelectedHospitalId] = useState('');
  const [departments, setDepartments] = useState<{id: string, name: string}[]>([]);
  const [selectedDepartmentId, setSelectedDepartmentId] = useState('');
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [selectedDoctorId, setSelectedDoctorId] = useState('');
  const [appointmentDate, setAppointmentDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [reasonForVisit, setReasonForVisit] = useState('');
  const [urgencyLevel, setUrgencyLevel] = useState<UrgencyLevel>(UrgencyLevel.NORMAL);
  const [notes, setNotes] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [availableTimeSlots, setAvailableTimeSlots] = useState<string[]>([]);

  // Fetch hospitals on component mount
  useEffect(() => {
    async function fetchHospitals() {
      try {
        const response = await fetch('/api/hospitals?includeDepartments=true');
        const data = await response.json();
        
        if (data.success) {
          setHospitals(data.hospitals);
        }
      } catch (error) {
        console.error('Error fetching hospitals:', error);
        setError('Failed to load hospitals. Please try again.');
      }
    }
    
    fetchHospitals();
  }, []);

  // Update departments when hospital changes
  useEffect(() => {
    if (selectedHospitalId) {
      const hospital = hospitals.find(h => h.id === selectedHospitalId);
      if (hospital) {
        setDepartments(hospital.departments);
        setSelectedDepartmentId('');
      }
    } else {
      setDepartments([]);
    }
  }, [selectedHospitalId, hospitals]);

  // Fetch doctors when department changes
  useEffect(() => {
    async function fetchDoctors() {
      if (!selectedHospitalId || !selectedDepartmentId) {
        setDoctors([]);
        return;
      }
      
      try {
        const response = await fetch(`/api/doctors?hospitalId=${selectedHospitalId}&departmentId=${selectedDepartmentId}`);
        const data = await response.json();
        
        if (data.success) {
          setDoctors(data.doctors);
        }
      } catch (error) {
        console.error('Error fetching doctors:', error);
        setError('Failed to load doctors. Please try again.');
      }
    }
    
    fetchDoctors();
  }, [selectedHospitalId, selectedDepartmentId]);

  // Set end time based on start time (1 hour later)
  useEffect(() => {
    if (startTime) {
      // Parse hours and minutes
      const [hours, minutes] = startTime.split(':').map(Number);
      
      // Add 1 hour
      let newHours = hours + 1;
      
      // Format the time back to HH:MM
      const newEndTime = `${newHours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
      setEndTime(newEndTime);
    } else {
      setEndTime('');
    }
  }, [startTime]);
  
  // Generate time slots from 8 AM to 6 PM
  useEffect(() => {
    const slots = [];
    for (let hour = 8; hour < 18; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const formattedHour = hour.toString().padStart(2, '0');
        const formattedMinute = minute.toString().padStart(2, '0');
        slots.push(`${formattedHour}:${formattedMinute}`);
      }
    }
    setAvailableTimeSlots(slots);
  }, []);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!patientId || !selectedHospitalId || !selectedDepartmentId || !selectedDoctorId || !appointmentDate || !startTime || !endTime || !reasonForVisit) {
      setError('Please fill in all required fields.');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      const response = await fetch('/api/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          patientId,
          doctorId: selectedDoctorId,
          appointmentDate,
          startTime,
          endTime,
          reasonForVisit,
          urgencyLevel,
          notes,
        }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setSuccess('Appointment scheduled successfully!');
        
        // Reset form
        setSelectedHospitalId('');
        setSelectedDepartmentId('');
        setSelectedDoctorId('');
        setAppointmentDate('');
        setStartTime('');
        setEndTime('');
        setReasonForVisit('');
        setUrgencyLevel(UrgencyLevel.NORMAL);
        setNotes('');
        
        // Call onSuccess callback if provided
        if (onSuccess) {
          onSuccess(data.appointment);
        }
      } else {
        setError(data.error || 'Failed to schedule appointment. Please try again.');
      }
    } catch (error) {
      console.error('Error scheduling appointment:', error);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Schedule Appointment</h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">
          {error}
        </div>
      )}
      
      {success && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-md text-sm">
          {success}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div>
            <label htmlFor="hospital" className="block text-sm font-medium text-gray-700">Hospital *</label>
            <select
              id="hospital"
              value={selectedHospitalId}
              onChange={(e) => setSelectedHospitalId(e.target.value)}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              required
            >
              <option value="">Select Hospital</option>
              {hospitals.map((hospital) => (
                <option key={hospital.id} value={hospital.id}>
                  {hospital.name}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label htmlFor="department" className="block text-sm font-medium text-gray-700">Department *</label>
            <select
              id="department"
              value={selectedDepartmentId}
              onChange={(e) => setSelectedDepartmentId(e.target.value)}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              required
              disabled={!selectedHospitalId}
            >
              <option value="">Select Department</option>
              {departments.map((department) => (
                <option key={department.id} value={department.id}>
                  {department.name}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label htmlFor="doctor" className="block text-sm font-medium text-gray-700">Doctor *</label>
            <select
              id="doctor"
              value={selectedDoctorId}
              onChange={(e) => setSelectedDoctorId(e.target.value)}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              required
              disabled={!selectedDepartmentId}
            >
              <option value="">Select Doctor</option>
              {doctors.map((doctor) => (
                <option key={doctor.id} value={doctor.id}>
                  Dr. {doctor.user.name} - {doctor.specialization || doctor.department.name}
                </option>
              ))}
            </select>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="appointmentDate" className="block text-sm font-medium text-gray-700">Date *</label>
              <input
                type="date"
                id="appointmentDate"
                value={appointmentDate}
                onChange={(e) => setAppointmentDate(e.target.value)}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                min={new Date().toISOString().split('T')[0]}
                required
              />
            </div>
            
            <div>
              <label htmlFor="startTime" className="block text-sm font-medium text-gray-700">Time *</label>
              <select
                id="startTime"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                required
              >
                <option value="">Select Time</option>
                {availableTimeSlots.map((slot) => (
                  <option key={slot} value={slot}>
                    {slot}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          <div>
            <label htmlFor="reasonForVisit" className="block text-sm font-medium text-gray-700">Reason for Visit *</label>
            <textarea
              id="reasonForVisit"
              value={reasonForVisit}
              onChange={(e) => setReasonForVisit(e.target.value)}
              rows={3}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              required
            />
          </div>
          
          <div>
            <label htmlFor="urgencyLevel" className="block text-sm font-medium text-gray-700">Urgency Level</label>
            <select
              id="urgencyLevel"
              value={urgencyLevel}
              onChange={(e) => setUrgencyLevel(e.target.value as UrgencyLevel)}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
              <option value={UrgencyLevel.LOW}>Low</option>
              <option value={UrgencyLevel.NORMAL}>Normal</option>
              <option value={UrgencyLevel.HIGH}>High</option>
              <option value={UrgencyLevel.EMERGENCY}>Emergency</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700">Additional Notes</label>
            <textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
        </div>
        
        <div className="mt-6 flex justify-end space-x-3">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancel
            </button>
          )}
          
          <button
            type="submit"
            disabled={isLoading}
            className="px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {isLoading ? 'Scheduling...' : 'Schedule Appointment'}
          </button>
        </div>
      </form>
    </div>
  );
} 