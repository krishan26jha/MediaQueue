// Type definitions for the application

// Enum equivalents (since we're using strings in the database)
export enum Role {
  ADMIN = "ADMIN",
  HOSPITAL_ADMIN = "HOSPITAL_ADMIN",
  DOCTOR = "DOCTOR",
  PATIENT = "PATIENT"
}

export enum UrgencyLevel {
  LOW = 'LOW',
  NORMAL = 'NORMAL',
  HIGH = 'HIGH',
  EMERGENCY = 'EMERGENCY'
}

export enum QueueStatus {
  WAITING = "WAITING",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED"
}

export enum AppointmentStatus {
  REQUESTED = 'REQUESTED',
  CONFIRMED = 'CONFIRMED',
  CANCELLED = 'CANCELLED',
  COMPLETED = 'COMPLETED',
  RESCHEDULED = 'RESCHEDULED'
}

export enum NotificationType {
  INFO = "INFO",
  WARNING = "WARNING",
  URGENT = "URGENT",
  QUEUE_UPDATE = "QUEUE_UPDATE"
}

// User authentication types
export interface UserAuth {
  id: string;
  name?: string | null;
  email: string;
  role: Role;
  image?: string | null;
}

// Queue related types
export interface QueuePatientDetails {
  id: string;
  name: string;
  age?: number;
  reason?: string;
  waitTime: number;
  urgency: UrgencyLevel;
  status: QueueStatus;
  arrivalTime: Date;
  position: number;
}

// Doctor dashboard types
export interface PatientInQueue {
  id: string;
  name: string;
  age: number;
  reason: string;
  waitTime: string;
  urgency: 'low' | 'medium' | 'high';
  status: 'waiting' | 'in-progress' | 'completed' | 'cancelled';
  arrivalTime: string;
}

// Notification types
export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  isRead: boolean;
  type: NotificationType;
  createdAt: Date;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  image?: string;
}

export enum UserRole {
  PATIENT = 'PATIENT',
  DOCTOR = 'DOCTOR',
  STAFF = 'STAFF',
  ADMIN = 'ADMIN'
}

export interface Patient {
  id: string;
  userId: string;
  user: User;
  dateOfBirth: Date;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
}

export interface Doctor {
  id: string;
  userId: string;
  user: User;
  hospitalId: string;
  hospital: Hospital;
  departmentId: string;
  department: Department;
  specialization: string;
  availability?: Availability[];
}

export interface Hospital {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode?: string;
  phone?: string;
  departments?: Department[];
}

export interface Department {
  id: string;
  name: string;
  hospitalId: string;
  hospital?: Hospital;
  doctors?: Doctor[];
}

export interface Availability {
  id: string;
  doctorId: string;
  doctor?: Doctor;
  dayOfWeek: number; // 0 = Sunday, 1 = Monday, etc.
  startTime: string; // HH:MM format
  endTime: string; // HH:MM format
  isAvailable: boolean;
}

export interface Appointment {
  id: string;
  patientId: string;
  patient: Patient;
  doctorId: string;
  doctor: Doctor;
  appointmentDate: Date;
  startTime: Date;
  endTime: Date;
  reasonForVisit: string;
  urgencyLevel: UrgencyLevel;
  notes?: string;
  status: AppointmentStatus;
  createdAt: Date;
  updatedAt: Date;
} 