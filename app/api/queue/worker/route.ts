import { NextResponse } from 'next/server';
import { queueUpdateWorker } from '@/lib/workers/queueUpdateWorker';
import { notificationService } from '@/lib/services/notificationService';
import { queueService } from '@/lib/services/queueService';
import { prisma } from '@/lib/db';

// Flag to track if worker is running
let isWorkerRunning = false;

// GET worker status
export async function GET(req: Request) {
  return NextResponse.json({
    status: isWorkerRunning ? 'running' : 'stopped',
    startTime: isWorkerRunning ? new Date() : null
  });
}

// POST to start worker
export async function POST(req: Request) {
  try {
    const data = await req.json();
    const { hospitalId } = data;
    
    if (!hospitalId) {
      return NextResponse.json(
        { error: 'Hospital ID is required' },
        { status: 400 }
      );
    }
    
    // Get hospital details
    const hospital = await prisma.hospital.findUnique({
      where: { id: hospitalId }
    });
    
    if (!hospital) {
      return NextResponse.json(
        { error: 'Hospital not found' },
        { status: 404 }
      );
    }

    // Process queue updates - simulate dynamic queue adjustments
    await processQueueUpdates(hospitalId);
    
    // Send notifications to patients
    const notificationCount = await notificationService.sendQueueUpdates(hospitalId);
    
    return NextResponse.json({
      message: 'Queue worker ran successfully',
      hospitalName: hospital.name,
      notificationsSent: notificationCount,
      timestamp: new Date()
    });
  } catch (error) {
    console.error('Error running queue worker:', error);
    return NextResponse.json(
      { error: 'Failed to run queue worker' },
      { status: 500 }
    );
  }
}

// DELETE to stop worker
export async function DELETE(req: Request) {
  // Can't stop if not running
  if (!isWorkerRunning) {
    return NextResponse.json(
      { message: 'Worker is not running' },
      { status: 400 }
    );
  }
  
  try {
    // Stop worker
    queueUpdateWorker.stopWorker();
    isWorkerRunning = false;
    
    return NextResponse.json({
      message: 'Queue update worker stopped',
      status: 'stopped'
    });
  } catch (error) {
    console.error('Error stopping queue worker:', error);
    return NextResponse.json(
      { error: 'Failed to stop queue worker' },
      { status: 500 }
    );
  }
}

// Private helper function to process queue updates
async function processQueueUpdates(hospitalId: string) {
  try {
    // Get current queue entries
    const queueEntries = await prisma.queueEntry.findMany({
      where: {
        hospitalId,
        status: {
          in: ['WAITING', 'IN_PROGRESS']
        }
      },
      orderBy: {
        priority: 'desc'
      }
    });
    
    // Update estimation times based on current conditions
    for (const entry of queueEntries) {
      // Skip entries in progress
      if (entry.status === 'IN_PROGRESS') continue;
      
      // Calculate time spent in queue
      const timeInQueue = Math.floor(
        (new Date().getTime() - entry.entryTime.getTime()) / (1000 * 60)
      );
      
      // If waited too long relative to urgency level, boost priority
      if (
        (entry.urgency === 'NORMAL' && timeInQueue > 30) ||
        (entry.urgency === 'LOW' && timeInQueue > 45)
      ) {
        await prisma.queueEntry.update({
          where: { id: entry.id },
          data: {
            priority: entry.priority + 1
          }
        });
      }
      
      // Update estimated wait time based on queue position
      if (entry.queuePosition !== null) {
        const updatedEstimate = Math.max(5, entry.queuePosition * 10 - timeInQueue);
        
        await prisma.queueEntry.update({
          where: { id: entry.id },
          data: {
            estimatedWaitTime: updatedEstimate
          }
        });
      }
    }
    
    return queueEntries.length;
  } catch (error) {
    console.error('Error processing queue updates:', error);
    return 0;
  }
} 