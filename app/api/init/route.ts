import { NextResponse } from 'next/server';
import { SmartQueueManager } from '@/lib/queue/smartQueueManager';
import { queueUpdateWorker } from '@/lib/workers/queueUpdateWorker';
import { UrgencyLevel } from '@/lib/ai/waitTimePredictor';

// Flag to track if system has been initialized
let isInitialized = false;

// GET initialization status
export async function GET(req: Request) {
  return NextResponse.json({
    initialized: isInitialized,
    timestamp: isInitialized ? new Date() : null
  });
}

// POST to initialize the system
export async function POST(req: Request) {
  // Don't initialize if already initialized
  if (isInitialized) {
    return NextResponse.json(
      { message: 'System is already initialized' },
      { status: 400 }
    );
  }
  
  try {
    // Initialize system with some sample data
    initializeSampleData();
    
    // Start worker
    queueUpdateWorker.startWorker();
    
    isInitialized = true;
    
    return NextResponse.json({
      message: 'System initialized successfully',
      initialized: true,
      timestamp: new Date()
    });
  } catch (error) {
    console.error('Error initializing system:', error);
    return NextResponse.json(
      { error: 'Failed to initialize system' },
      { status: 500 }
    );
  }
}

// Helper function to initialize sample data
function initializeSampleData() {
  // Create queue managers for sample hospitals
  const hospitals = ['hosp_1', 'hosp_2', 'hosp_3'];
  
  hospitals.forEach(hospitalId => {
    const queueManager = new SmartQueueManager();
    
    // Add sample patients to the queue
    if (hospitalId === 'hosp_1') {
      // Add some sample patients to the first hospital
      queueManager.addToQueue({
        id: 'pat_1',
        name: 'Rakesh Kumar',
        urgency: UrgencyLevel.NORMAL,
        estimatedWaitTime: 15,
        checkInTime: new Date(Date.now() - 20 * 60000) // 20 minutes ago
      });
      
      queueManager.addToQueue({
        id: 'pat_2',
        name: 'Mary Johnson',
        urgency: UrgencyLevel.HIGH,
        estimatedWaitTime: 10,
        checkInTime: new Date(Date.now() - 15 * 60000) // 15 minutes ago
      });
      
      queueManager.addToQueue({
        id: 'pat_3',
        name: 'Robert Smith',
        urgency: UrgencyLevel.LOW,
        estimatedWaitTime: 25,
        checkInTime: new Date(Date.now() - 10 * 60000) // 10 minutes ago
      });
      
      queueManager.addToQueue({
        id: 'pat_4',
        name: 'Emma Williams',
        urgency: UrgencyLevel.EMERGENCY,
        estimatedWaitTime: 5,
        checkInTime: new Date(Date.now() - 5 * 60000) // 5 minutes ago
      });
    }
    
    // Register the queue manager with the worker
    queueUpdateWorker.registerQueueManager(hospitalId, queueManager);
    
    console.log(`Initialized queue for hospital ${hospitalId}`);
  });
} 