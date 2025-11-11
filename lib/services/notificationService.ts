import { prisma } from "../db";
import { queueService } from "./queueService";

interface QueueNotification {
  id: string;
  userId: string;
  title: string;
  message: string;
  isRead: boolean;
  type: string;
  createdAt: Date;
}

export class NotificationService {
  // Get notifications for a user
  async getUserNotifications(userId: string): Promise<QueueNotification[]> {
    try {
      const notifications = await prisma.notification.findMany({
        where: {
          userId
        },
        orderBy: {
          createdAt: 'desc'
        }
      });
      
      return notifications.map(notification => ({
        id: notification.id,
        userId: notification.userId,
        title: notification.title,
        message: notification.message,
        isRead: notification.isRead,
        type: notification.type,
        createdAt: notification.createdAt
      }));
    } catch (error) {
      console.error('Error fetching notifications:', error);
      return [];
    }
  }
  
  // Create a new notification
  async createNotification(
    userId: string,
    title: string,
    message: string,
    type: 'INFO' | 'WARNING' | 'URGENT' | 'QUEUE_UPDATE'
  ): Promise<QueueNotification | null> {
    try {
      const notification = await prisma.notification.create({
        data: {
          userId,
          title,
          message,
          type,
          isRead: false
        }
      });
      
      return {
        id: notification.id,
        userId: notification.userId,
        title: notification.title,
        message: notification.message,
        isRead: notification.isRead,
        type: notification.type,
        createdAt: notification.createdAt
      };
    } catch (error) {
      console.error('Error creating notification:', error);
      return null;
    }
  }
  
  // Mark notification as read
  async markAsRead(notificationId: string): Promise<boolean> {
    try {
      await prisma.notification.update({
        where: { id: notificationId },
        data: { isRead: true }
      });
      
      return true;
    } catch (error) {
      console.error('Error marking notification as read:', error);
      return false;
    }
  }
  
  // Mark all notifications as read for a user
  async markAllAsRead(userId: string): Promise<number> {
    try {
      const result = await prisma.notification.updateMany({
        where: { 
          userId,
          isRead: false
        },
        data: { isRead: true }
      });
      
      return result.count;
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      return 0;
    }
  }
  
  // Create queue position notification
  async createQueueUpdateNotification(
    userId: string,
    patientName: string,
    position: number,
    estimatedWaitTime: number
  ): Promise<QueueNotification | null> {
    const title = 'Queue Update';
    let message = '';
    
    if (position <= 2) {
      message = `${patientName}, it's almost your turn! You are now ${position === 1 ? 'next' : 'position #2'} in line. Please proceed to the waiting area.`;
    } else if (position <= 5) {
      message = `${patientName}, you've moved up in the queue. Your current position is #${position} with approximately ${estimatedWaitTime} minutes remaining.`;
    } else {
      message = `${patientName}, your queue position has been updated to #${position}. Estimated wait time is ${estimatedWaitTime} minutes.`;
    }
    
    return this.createNotification(userId, title, message, 'QUEUE_UPDATE');
  }
  
  // Send queue position update to all patients
  async sendQueueUpdates(hospitalId: string): Promise<number> {
    try {
      // Get all active patients in the queue
      const queue = await queueService.getHospitalQueue(hospitalId);
      const waitingPatients = queue.filter(p => p.status === 'WAITING' || p.status === 'READY');
      
      let notificationsCreated = 0;
      
      // Find patients who need to be notified
      for (const patient of waitingPatients) {
        // Get corresponding patient entity from database
        const patientEntity = await prisma.patient.findFirst({
          where: {
            queueEntries: {
              some: {
                id: patient.id
              }
            }
          },
          include: {
            user: true
          }
        });
        
        if (!patientEntity) continue;
        
        // Notify patients who are next in line or have just changed position
        if (patient.currentPosition <= 2 || patient.currentPosition !== patient.initialPosition) {
          const notification = await this.createQueueUpdateNotification(
            patientEntity.userId,
            patientEntity.user.name || 'Patient',
            patient.currentPosition,
            patient.estimatedWaitTime
          );
          
          if (notification) notificationsCreated++;
        }
      }
      
      return notificationsCreated;
    } catch (error) {
      console.error('Error sending queue updates:', error);
      return 0;
    }
  }
}

// Create singleton instance
export const notificationService = new NotificationService(); 