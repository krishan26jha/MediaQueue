import { NextResponse } from 'next/server';
import {
  PrescriptionManager,
  Prescription,
  Medication,
  TestReport
} from '@/lib/prescriptions/prescriptionManager';

// In-memory prescription manager for demo
// In production, this would be stored in a database
const prescriptionManager = new PrescriptionManager();

// GET prescriptions for a patient
export async function GET(req: Request) {
  const url = new URL(req.url);
  const patientId = url.searchParams.get('patientId');
  const prescriptionId = url.searchParams.get('prescriptionId');
  const activeOnly = url.searchParams.get('activeOnly') === 'true';
  
  if (!patientId) {
    return NextResponse.json(
      { error: 'Patient ID is required' },
      { status: 400 }
    );
  }
  
  // Get a specific prescription
  if (prescriptionId) {
    const prescription = prescriptionManager.getPrescription(patientId, prescriptionId);
    
    if (!prescription) {
      return NextResponse.json(
        { error: 'Prescription not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ prescription });
  }
  
  // Get all prescriptions for a patient, filtered by active status if specified
  const prescriptions = activeOnly
    ? prescriptionManager.getActivePatientPrescriptions(patientId)
    : prescriptionManager.getPatientPrescriptions(patientId);
  
  return NextResponse.json({ 
    prescriptions,
    count: prescriptions.length
  });
}

// POST to create a new prescription
export async function POST(req: Request) {
  try {
    const data = await req.json();
    const {
      patientId,
      doctorId,
      hospitalId,
      departmentId,
      diagnosis,
      medications = [],
      testReports = [],
      recommendations,
      followUpDate
    } = data;
    
    // Validate required fields
    if (!patientId || !doctorId || !hospitalId || !diagnosis) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Create a unique ID for the prescription
    const id = `pres_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Format follow-up date if provided
    const formattedFollowUpDate = followUpDate ? new Date(followUpDate) : undefined;
    
    // Create the prescription
    const prescription = prescriptionManager.createPrescription({
      id,
      patientId,
      doctorId,
      hospitalId,
      departmentId: departmentId || 'general',
      diagnosis,
      medications: medications as Medication[],
      testReports: testReports as TestReport[],
      recommendations: recommendations || '',
      followUpDate: formattedFollowUpDate
    });
    
    return NextResponse.json({
      message: 'Prescription created successfully',
      prescription
    });
  } catch (error) {
    console.error('Error creating prescription:', error);
    return NextResponse.json(
      { error: 'Failed to create prescription' },
      { status: 500 }
    );
  }
}

// PATCH to update an existing prescription
export async function PATCH(req: Request) {
  try {
    const data = await req.json();
    const {
      patientId,
      prescriptionId,
      diagnosis,
      medications,
      recommendations,
      followUpDate,
      isActive
    } = data;
    
    if (!patientId || !prescriptionId) {
      return NextResponse.json(
        { error: 'Patient ID and Prescription ID are required' },
        { status: 400 }
      );
    }
    
    // Prepare update data
    const updateData: Partial<Prescription> = {};
    
    if (diagnosis !== undefined) updateData.diagnosis = diagnosis;
    if (medications !== undefined) updateData.medications = medications;
    if (recommendations !== undefined) updateData.recommendations = recommendations;
    if (followUpDate !== undefined) updateData.followUpDate = new Date(followUpDate);
    if (isActive !== undefined) updateData.isActive = isActive;
    
    // Update the prescription
    const updatedPrescription = prescriptionManager.updatePrescription(
      patientId, 
      prescriptionId, 
      updateData
    );
    
    if (!updatedPrescription) {
      return NextResponse.json(
        { error: 'Prescription not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      message: 'Prescription updated successfully',
      prescription: updatedPrescription
    });
  } catch (error) {
    console.error('Error updating prescription:', error);
    return NextResponse.json(
      { error: 'Failed to update prescription' },
      { status: 500 }
    );
  }
}

// Add a medication to a prescription
export async function PUT(req: Request) {
  try {
    const data = await req.json();
    const { patientId, prescriptionId, medication, testReport } = data;
    
    if (!patientId || !prescriptionId) {
      return NextResponse.json(
        { error: 'Patient ID and Prescription ID are required' },
        { status: 400 }
      );
    }
    
    let updatedPrescription: Prescription | null = null;
    
    // Add medication if provided
    if (medication) {
      updatedPrescription = prescriptionManager.addMedication(
        patientId,
        prescriptionId,
        medication
      );
    }
    
    // Add test report if provided
    if (testReport) {
      // Format date if it's a string
      if (typeof testReport.date === 'string') {
        testReport.date = new Date(testReport.date);
      }
      
      updatedPrescription = prescriptionManager.addTestReport(
        patientId,
        prescriptionId,
        testReport
      );
    }
    
    if (!updatedPrescription) {
      return NextResponse.json(
        { error: 'Prescription not found or no medication/report provided' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      message: 'Prescription updated successfully',
      prescription: updatedPrescription
    });
  } catch (error) {
    console.error('Error updating prescription:', error);
    return NextResponse.json(
      { error: 'Failed to update prescription' },
      { status: 500 }
    );
  }
} 