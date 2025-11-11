import { UrgencyLevel } from '@/lib/ai/waitTimePredictor';

export interface QueuePatient {
  id: string;
  name: string;
  urgency: UrgencyLevel;
  initialPosition: number;
  currentPosition: number;
  estimatedWaitTime: number;
  checkInTime: Date;
  notified: boolean;
  status: 'WAITING' | 'READY' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
}

export interface QueueUpdate {
  patientId: string;
  oldPosition: number;
  newPosition: number;
  reason: string;
  timestamp: Date;
}

export class SmartQueueManager {
  private queue: QueuePatient[] = [];
  private updates: QueueUpdate[] = [];
  private notificationThreshold = 2; // Notify when patient is this many positions away
  
  // Add a patient to the queue
  addToQueue(patient: Omit<QueuePatient, 'currentPosition' | 'initialPosition' | 'notified' | 'status'>): QueuePatient {
    // Calculate initial position based on urgency and current queue
    const position = this.calculateInitialPosition(patient.urgency);
    
    const newPatient: QueuePatient = {
      ...patient,
      initialPosition: position,
      currentPosition: position,
      notified: false,
      status: 'WAITING'
    };
    
    // Add patient to queue
    this.queue.push(newPatient);
    
    // Re-sort queue
    this.sortQueue();
    
    return newPatient;
  }
  
  // Remove a patient from the queue
  removeFromQueue(patientId: string): boolean {
    const initialLength = this.queue.length;
    this.queue = this.queue.filter(patient => patient.id !== patientId);
    
    if (this.queue.length < initialLength) {
      // Reorder positions if someone was removed
      this.reorderPositions();
      return true;
    }
    
    return false;
  }
  
  // Update patient status
  updatePatientStatus(patientId: string, status: QueuePatient['status']): boolean {
    const patient = this.queue.find(p => p.id === patientId);
    if (!patient) return false;
    
    patient.status = status;
    
    // If the patient is now in progress, reorder the queue
    if (status === 'IN_PROGRESS' || status === 'COMPLETED' || status === 'CANCELLED') {
      this.reorderPositions();
    }
    
    return true;
  }
  
  // Dynamically adjust queue based on wait times and urgency
  dynamicQueueAdjustment(): QueueUpdate[] {
    const updates: QueueUpdate[] = [];
    
    // Only consider waiting patients
    const waitingPatients = this.queue.filter(p => p.status === 'WAITING');
    
    // Apply dynamic adjustments based on urgency and wait time
    for (let i = 0; i < waitingPatients.length; i++) {
      const patient = waitingPatients[i];
      
      // Skip patients with high urgency - they're already prioritized
      if (patient.urgency === UrgencyLevel.EMERGENCY || patient.urgency === UrgencyLevel.HIGH) {
        continue;
      }
      
      // Check if patient has been waiting too long relative to their urgency
      const waitTimeFactor = this.getWaitTimeFactor(patient);
      if (waitTimeFactor > 1.5 && patient.currentPosition > 3) {
        // Move patient up in the queue
        const oldPosition = patient.currentPosition;
        const newPosition = Math.max(3, Math.floor(patient.currentPosition * 0.7));
        
        if (oldPosition !== newPosition) {
          patient.currentPosition = newPosition;
          
          updates.push({
            patientId: patient.id,
            oldPosition,
            newPosition,
            reason: 'Extended wait time compensation',
            timestamp: new Date()
          });
        }
      }
    }
    
    if (updates.length > 0) {
      this.sortQueue();
      this.updates = [...this.updates, ...updates];
    }
    
    return updates;
  }
  
  // Check which patients should be notified
  checkForNotifications(): QueuePatient[] {
    const patientsToNotify: QueuePatient[] = [];
    
    for (const patient of this.queue) {
      if (
        patient.status === 'WAITING' && 
        !patient.notified && 
        patient.currentPosition <= this.notificationThreshold
      ) {
        patient.notified = true;
        patient.status = 'READY';
        patientsToNotify.push(patient);
      }
    }
    
    return patientsToNotify;
  }
  
  // Get current queue
  getQueue(): QueuePatient[] {
    return [...this.queue];
  }
  
  // Get queue updates
  getUpdates(): QueueUpdate[] {
    return [...this.updates];
  }
  
  // Get a specific patient
  getPatient(patientId: string): QueuePatient | undefined {
    return this.queue.find(p => p.id === patientId);
  }
  
  // Calculate wait time factor (how long relative to expected wait)
  private getWaitTimeFactor(patient: QueuePatient): number {
    const waitTimeMs = Date.now() - patient.checkInTime.getTime();
    const waitTimeMinutes = waitTimeMs / (1000 * 60);
    return waitTimeMinutes / patient.estimatedWaitTime;
  }
  
  // Calculate initial position based on urgency
  private calculateInitialPosition(urgency: UrgencyLevel): number {
    // Get waiting patients
    const waitingPatients = this.queue.filter(p => p.status === 'WAITING');
    
    // Insert based on urgency
    switch (urgency) {
      case UrgencyLevel.EMERGENCY:
        // Emergency cases go to the front of the queue (position 1 or 2)
        return Math.min(2, waitingPatients.length + 1);
        
      case UrgencyLevel.HIGH:
        // High urgency goes near the front but after emergencies
        return Math.min(4, waitingPatients.length + 1);
        
      case UrgencyLevel.NORMAL:
        // Normal urgency goes in the middle
        return waitingPatients.length + 1;
        
      case UrgencyLevel.LOW:
        // Low urgency goes to the back unless queue is empty
        return waitingPatients.length + 1;
        
      default:
        return waitingPatients.length + 1;
    }
  }
  
  // Sort the queue based on current positions
  private sortQueue(): void {
    this.queue.sort((a, b) => {
      // First sort by status (in progress comes first)
      if (a.status === 'IN_PROGRESS' && b.status !== 'IN_PROGRESS') return -1;
      if (a.status !== 'IN_PROGRESS' && b.status === 'IN_PROGRESS') return 1;
      
      // Then sort by position
      return a.currentPosition - b.currentPosition;
    });
    
    // Update positions
    this.reorderPositions();
  }
  
  // Reorder positions after a change
  private reorderPositions(): void {
    // Group by status
    const inProgress = this.queue.filter(p => p.status === 'IN_PROGRESS');
    const ready = this.queue.filter(p => p.status === 'READY');
    const waiting = this.queue.filter(p => p.status === 'WAITING');
    const completed = this.queue.filter(p => ['COMPLETED', 'CANCELLED'].includes(p.status));
    
    // Order by urgency within each status group
    const orderByUrgency = (patients: QueuePatient[]): QueuePatient[] => {
      return patients.sort((a, b) => {
        // Emergency first, then High, then Normal, then Low
        const urgencyOrder = { 
          [UrgencyLevel.EMERGENCY]: 0, 
          [UrgencyLevel.HIGH]: 1, 
          [UrgencyLevel.NORMAL]: 2, 
          [UrgencyLevel.LOW]: 3 
        };
        
        return urgencyOrder[a.urgency] - urgencyOrder[b.urgency];
      });
    };
    
    const orderedWaiting = orderByUrgency(waiting);
    const orderedReady = orderByUrgency(ready);
    
    // Reassign positions
    let position = 1;
    
    // In progress are always first but don't have positions
    for (const patient of inProgress) {
      patient.currentPosition = 0; // In progress has position 0
    }
    
    // Ready patients come next
    for (const patient of orderedReady) {
      patient.currentPosition = position++;
    }
    
    // Then waiting patients
    for (const patient of orderedWaiting) {
      patient.currentPosition = position++;
    }
    
    // Completed and cancelled patients don't have positions
    for (const patient of completed) {
      patient.currentPosition = -1;
    }
    
    // Update the queue
    this.queue = [...inProgress, ...orderedReady, ...orderedWaiting, ...completed];
  }
} 