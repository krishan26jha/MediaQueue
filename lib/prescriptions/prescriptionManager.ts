export interface Medication {
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
}

export interface TestReport {
  name: string;
  date: Date;
  result: string;
  notes: string;
  fileUrl?: string;
}

export interface Prescription {
  id: string;
  patientId: string;
  doctorId: string;
  hospitalId: string;
  departmentId: string;
  diagnosis: string;
  medications: Medication[];
  testReports: TestReport[];
  recommendations: string;
  followUpDate?: Date;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
}

export class PrescriptionManager {
  private prescriptions: Record<string, Prescription[]> = {};
  
  // Create a new prescription
  createPrescription(prescription: Omit<Prescription, 'createdAt' | 'updatedAt' | 'isActive'>): Prescription {
    const now = new Date();
    const newPrescription: Prescription = {
      ...prescription,
      createdAt: now,
      updatedAt: now,
      isActive: true
    };
    
    // Initialize patient prescriptions array if it doesn't exist
    if (!this.prescriptions[prescription.patientId]) {
      this.prescriptions[prescription.patientId] = [];
    }
    
    // Add to patient's prescriptions
    this.prescriptions[prescription.patientId].push(newPrescription);
    
    return newPrescription;
  }
  
  // Get all prescriptions for a patient
  getPatientPrescriptions(patientId: string): Prescription[] {
    return this.prescriptions[patientId] || [];
  }
  
  // Get active prescriptions for a patient
  getActivePatientPrescriptions(patientId: string): Prescription[] {
    return this.getPatientPrescriptions(patientId).filter(p => p.isActive);
  }
  
  // Get a specific prescription
  getPrescription(patientId: string, prescriptionId: string): Prescription | undefined {
    return this.getPatientPrescriptions(patientId).find(p => p.id === prescriptionId);
  }
  
  // Update a prescription
  updatePrescription(
    patientId: string, 
    prescriptionId: string, 
    updates: Partial<Omit<Prescription, 'id' | 'patientId' | 'createdAt' | 'updatedAt'>>
  ): Prescription | null {
    const prescription = this.getPrescription(patientId, prescriptionId);
    
    if (!prescription) {
      return null;
    }
    
    // Apply updates
    Object.assign(prescription, { 
      ...updates,
      updatedAt: new Date() 
    });
    
    return prescription;
  }
  
  // Deactivate a prescription
  deactivatePrescription(patientId: string, prescriptionId: string): boolean {
    const prescription = this.getPrescription(patientId, prescriptionId);
    
    if (!prescription) {
      return false;
    }
    
    prescription.isActive = false;
    prescription.updatedAt = new Date();
    
    return true;
  }
  
  // Add a medication to prescription
  addMedication(
    patientId: string, 
    prescriptionId: string, 
    medication: Medication
  ): Prescription | null {
    const prescription = this.getPrescription(patientId, prescriptionId);
    
    if (!prescription) {
      return null;
    }
    
    prescription.medications.push(medication);
    prescription.updatedAt = new Date();
    
    return prescription;
  }
  
  // Remove a medication from prescription
  removeMedication(
    patientId: string, 
    prescriptionId: string, 
    medicationName: string
  ): Prescription | null {
    const prescription = this.getPrescription(patientId, prescriptionId);
    
    if (!prescription) {
      return null;
    }
    
    prescription.medications = prescription.medications.filter(m => m.name !== medicationName);
    prescription.updatedAt = new Date();
    
    return prescription;
  }
  
  // Add a test report to prescription
  addTestReport(
    patientId: string, 
    prescriptionId: string, 
    report: TestReport
  ): Prescription | null {
    const prescription = this.getPrescription(patientId, prescriptionId);
    
    if (!prescription) {
      return null;
    }
    
    prescription.testReports.push(report);
    prescription.updatedAt = new Date();
    
    return prescription;
  }
} 