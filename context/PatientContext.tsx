'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: string;
  contactNumber: string;
  emergencyContact?: string;
  bloodGroup?: string;
  symptoms: string;
  priority: 'Low' | 'Medium' | 'High' | 'Emergency';
  status: 'Waiting' | 'In Progress' | 'Completed' | 'Cancelled';
  waitTime: number;
  doctor?: string;
  appointmentTime?: string;
  department?: string;
  createdAt: string;
  updatedAt: string;
}

interface PatientContextType {
  patients: Patient[];
  addPatient: (patient: Omit<Patient, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updatePatient: (id: string, updates: Partial<Patient>) => void;
  removePatient: (id: string) => void;
  getPatientById: (id: string) => Patient | undefined;
  loading: boolean;
}

const PatientContext = createContext<PatientContextType | undefined>(undefined);

export function usePatients() {
  const context = useContext(PatientContext);
  if (!context) {
    throw new Error('usePatients must be used within a PatientProvider');
  }
  return context;
}

const STORAGE_KEY = 'mediqueue_patients';

// Default patients for demo purposes
const DEFAULT_PATIENTS: Patient[] = [
  {
    id: 'p1',
    name: 'Rahul Sharma',
    age: 35,
    gender: 'Male',
    contactNumber: '+91 98765 43210',
    bloodGroup: 'O+',
    symptoms: 'Severe headache, nausea, sensitivity to light',
    priority: 'High',
    status: 'Waiting',
    waitTime: 15,
    department: 'Neurology',
    createdAt: new Date(Date.now() - 45 * 60000).toISOString(),
    updatedAt: new Date(Date.now() - 45 * 60000).toISOString(),
  },
  {
    id: 'p2',
    name: 'Priya Patel',
    age: 28,
    gender: 'Female',
    contactNumber: '+91 87654 32109',
    bloodGroup: 'A+',
    symptoms: 'Fever, dry cough, fatigue',
    priority: 'Medium',
    status: 'In Progress',
    waitTime: 0,
    doctor: 'Dr. Suresh Kumar',
    department: 'General Medicine',
    createdAt: new Date(Date.now() - 120 * 60000).toISOString(),
    updatedAt: new Date(Date.now() - 30 * 60000).toISOString(),
  },
  {
    id: 'p3',
    name: 'Arjun Singh',
    age: 45,
    gender: 'Male',
    contactNumber: '+91 76543 21098',
    emergencyContact: '+91 76540 21096',
    bloodGroup: 'B-',
    symptoms: 'Chest pain, shortness of breath, dizziness',
    priority: 'Emergency',
    status: 'In Progress',
    waitTime: 0,
    doctor: 'Dr. Anjali Gupta',
    department: 'Cardiology',
    createdAt: new Date(Date.now() - 20 * 60000).toISOString(),
    updatedAt: new Date(Date.now() - 10 * 60000).toISOString(),
  },
  {
    id: 'p4',
    name: 'Sunita Verma',
    age: 52,
    gender: 'Female',
    contactNumber: '+91 65432 10987',
    bloodGroup: 'AB+',
    symptoms: 'Joint pain, stiffness, inflammation',
    priority: 'Low',
    status: 'Waiting',
    waitTime: 45,
    department: 'Orthopedics',
    createdAt: new Date(Date.now() - 180 * 60000).toISOString(),
    updatedAt: new Date(Date.now() - 180 * 60000).toISOString(),
  }
];

export function PatientProvider({ children }: { children: ReactNode }) {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);

  // Load patients from localStorage on initial render
  useEffect(() => {
    const loadPatients = () => {
      try {
        const storedPatients = localStorage.getItem(STORAGE_KEY);
        if (storedPatients) {
          setPatients(JSON.parse(storedPatients));
        } else {
          // If no patients in storage, use default patients
          setPatients(DEFAULT_PATIENTS);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_PATIENTS));
        }
      } catch (error) {
        console.error('Failed to load patients from localStorage:', error);
        setPatients(DEFAULT_PATIENTS);
      } finally {
        setLoading(false);
      }
    };

    loadPatients();
  }, []);

  // Save patients to localStorage whenever patients state changes
  useEffect(() => {
    if (!loading) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(patients));
      } catch (error) {
        console.error('Failed to save patients to localStorage:', error);
      }
    }
  }, [patients, loading]);

  const addPatient = (patient: Omit<Patient, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    const newPatient: Patient = {
      ...patient,
      id: `p${Date.now()}`,
      createdAt: now,
      updatedAt: now,
    };

    setPatients(prevPatients => [...prevPatients, newPatient]);
  };

  const updatePatient = (id: string, updates: Partial<Patient>) => {
    setPatients(prevPatients => 
      prevPatients.map(patient => 
        patient.id === id
          ? { ...patient, ...updates, updatedAt: new Date().toISOString() }
          : patient
      )
    );
  };

  const removePatient = (id: string) => {
    setPatients(prevPatients => 
      prevPatients.filter(patient => patient.id !== id)
    );
  };

  const getPatientById = (id: string) => {
    return patients.find(patient => patient.id === id);
  };

  const value = {
    patients,
    addPatient,
    updatePatient,
    removePatient,
    getPatientById,
    loading,
  };

  return (
    <PatientContext.Provider value={value}>
      {children}
    </PatientContext.Provider>
  );
} 