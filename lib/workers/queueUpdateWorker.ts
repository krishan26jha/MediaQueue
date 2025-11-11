import { SmartQueueManager, QueuePatient } from '@/lib/queue/smartQueueManager';

// In memory store for demo purposes
// In a real app, this would be persistent storage or database
const queueManagers: Record<string, SmartQueueManager> = {};

// In-memory notification store
// In a real app, these would be sent via email, SMS, or push notifications
interface QueueNotification {
  patientId: string;
  patientName: string;
  message: string;
  timestamp: Date;
  read: boolean;
}

const patientNotifications: Record<string, QueueNotification[]> = {};

/**
 * Queue Update Worker class
 * Handles periodic updates to queues, dynamic adjustments, and notifications
 */
export class QueueUpdateWorker {
  private updateInterval: number = 60000; // 1 minute
  private intervalId?: NodeJS.Timeout;
  
  // Start the update worker
  startWorker(): void {
    console.log('Starting Queue Update Worker...');
    
    // Initial update
    this.updateAllQueues();
    
    // Set interval for regular updates
    this.intervalId = setInterval(() => {
      this.updateAllQueues();
    }, this.updateInterval);
  }
  
  // Stop the update worker
  stopWorker(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = undefined;
      console.log('Queue Update Worker stopped');
    }
  }
  
  // Update all hospital queues
  private updateAllQueues(): void {
    const hospitals = Object.keys(queueManagers);
    
    console.log(`Updating queues for ${hospitals.length} hospitals...`);
    
    hospitals.forEach(hospitalId => {
      this.updateHospitalQueue(hospitalId);
    });
  }
  
  // Update a specific hospital's queue
  private updateHospitalQueue(hospitalId: string): void {
    const queueManager = queueManagers[hospitalId];
    
    if (!queueManager) {
      return;
    }
    
    // Apply dynamic adjustments to queue positions
    const updates = queueManager.dynamicQueueAdjustment();
    
    // Check for patients who need notification
    const patientsToNotify = queueManager.checkForNotifications();
    
    // Send notifications to patients
    this.sendNotifications(hospitalId, patientsToNotify);
    
    // Log updates
    if (updates.length > 0) {
      console.log(`Updated ${updates.length} positions in queue for hospital ${hospitalId}`);
    }
    
    if (patientsToNotify.length > 0) {
      console.log(`Sent notifications to ${patientsToNotify.length} patients for hospital ${hospitalId}`);
    }
  }
  
  // Send notifications to patients
  private sendNotifications(hospitalId: string, patients: QueuePatient[]): void {
    patients.forEach(patient => {
      const message = `It's almost your turn! Your current position in the queue is ${patient.currentPosition}. Please proceed to the waiting area.`;
      
      // Create notification
      const notification: QueueNotification = {
        patientId: patient.id,
        patientName: patient.name,
        message,
        timestamp: new Date(),
        read: false
      };
      
      // Store notification
      if (!patientNotifications[patient.id]) {
        patientNotifications[patient.id] = [];
      }
      
      patientNotifications[patient.id].push(notification);
      
      // In a real app, this would trigger an SMS, email, or push notification
      console.log(`Notification sent to ${patient.name}: ${message}`);
    });
  }
  
  // Get notifications for a patient
  getPatientNotifications(patientId: string): QueueNotification[] {
    return patientNotifications[patientId] || [];
  }
  
  // Mark notification as read
  markNotificationAsRead(patientId: string, index: number): boolean {
    const notifications = patientNotifications[patientId];
    
    if (!notifications || !notifications[index]) {
      return false;
    }
    
    notifications[index].read = true;
    return true;
  }
  
  // Register a queue manager for a hospital
  registerQueueManager(hospitalId: string, queueManager: SmartQueueManager): void {
    queueManagers[hospitalId] = queueManager;
  }
}

// Singleton instance
export const queueUpdateWorker = new QueueUpdateWorker(); 