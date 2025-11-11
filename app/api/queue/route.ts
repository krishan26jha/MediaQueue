import { NextResponse } from 'next/server';
import { queueService } from '@/lib/services/queueService';
import { UrgencyLevel } from '@/lib/ai/waitTimePredictor';
import { predictWaitTime } from '@/lib/ai/waitTimePredictor';

// GET queue status for a hospital
export async function GET(req: Request) {
  const url = new URL(req.url);
  const hospitalId = url.searchParams.get('hospitalId');
  const patientId = url.searchParams.get('patientId');
  
  if (!hospitalId) {
    return NextResponse.json(
      { error: 'Hospital ID is required' },
      { status: 400 }
    );
  }
  
  try {
    // If patientId is provided, return just that patient's info
    if (patientId) {
      const patient = await queueService.getPatientQueueInfo(hospitalId, patientId);
      if (!patient) {
        return NextResponse.json(
          { error: 'Patient not found in queue' },
          { status: 404 }
        );
      }
      return NextResponse.json({ patient });
    }
    
    // Otherwise return the whole queue
    const queue = await queueService.getHospitalQueue(hospitalId);
    
    return NextResponse.json({
      queue,
      queueLength: queue.filter(p => p.status === 'WAITING' || p.status === 'READY').length,
      timestamp: new Date()
    });
  } catch (error) {
    console.error('Error fetching queue:', error);
    return NextResponse.json(
      { error: 'Failed to fetch queue data' },
      { status: 500 }
    );
  }
}

// POST to add a patient to the queue
export async function POST(req: Request) {
  try {
    const data = await req.json();
    const { 
      hospitalId, 
      patientId,
      patientName,
      urgencyLevel,
      departmentId,
      symptoms
    } = data;
    
    if (!hospitalId || !patientId || !patientName || !urgencyLevel) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Generate queue data for prediction
    const queueData = {
      hospitalId,
      departmentId: departmentId || 'general',
      urgencyLevel: urgencyLevel as UrgencyLevel,
      patientCount: 10, // Example value, should come from actual queue length
      currentLoad: 0.7, // 70% load example
      averageServiceTime: 15, // 15 minutes average
      timeOfDay: new Date().getHours(),
      dayOfWeek: new Date().getDay(),
      isHoliday: false,
      emergencyCases: 1,
      staffCount: 5
    };
    
    // Get wait time prediction
    const prediction = predictWaitTime(queueData);
    
    // Add patient to queue
    const patient = await queueService.addPatientToQueue(
      hospitalId,
      patientId,
      patientName,
      urgencyLevel as UrgencyLevel,
      prediction.estimatedWaitTime
    );
    
    return NextResponse.json({
      message: 'Patient added to queue',
      queueNumber: patient.currentPosition,
      estimatedWaitTime: prediction.estimatedWaitTime,
      patient
    });
  } catch (error) {
    console.error('Error adding patient to queue:', error);
    return NextResponse.json(
      { error: 'Failed to add patient to queue' },
      { status: 500 }
    );
  }
}

// PATCH to update a patient's status in the queue
export async function PATCH(req: Request) {
  try {
    const data = await req.json();
    const { hospitalId, patientId, status } = data;
    
    if (!hospitalId || !patientId || !status) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    const success = await queueService.updatePatientStatus(hospitalId, patientId, status);
    
    return NextResponse.json({
      message: `Patient status updated to ${status}`,
      success: true
    });
  } catch (error) {
    console.error('Error updating patient status:', error);
    return NextResponse.json(
      { error: 'Failed to update patient status' },
      { status: 500 }
    );
  }
}

// DELETE to remove a patient from the queue
export async function DELETE(req: Request) {
  const url = new URL(req.url);
  const hospitalId = url.searchParams.get('hospitalId');
  const patientId = url.searchParams.get('patientId');
  
  if (!hospitalId || !patientId) {
    return NextResponse.json(
      { error: 'Hospital ID and Patient ID are required' },
      { status: 400 }
    );
  }
  
  try {
    const success = await queueService.removePatientFromQueue(hospitalId, patientId);
    
    return NextResponse.json({
      message: 'Patient removed from queue',
      success: true
    });
  } catch (error) {
    console.error('Error removing patient from queue:', error);
    return NextResponse.json(
      { error: 'Failed to remove patient from queue' },
      { status: 500 }
    );
  }
} 