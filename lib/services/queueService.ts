import { prisma } from "../db";
import { SmartQueueManager, QueuePatient } from "../queue/smartQueueManager";
import { UrgencyLevel } from "../ai/waitTimePredictor";
import { v4 as uuidv4 } from "uuid";

// Map from UrgencyLevel to database UrgencyLevel
const mapUrgencyLevel = (urgency: UrgencyLevel) => {
  switch (urgency) {
    case UrgencyLevel.EMERGENCY:
      return "EMERGENCY";
    case UrgencyLevel.HIGH:
      return "HIGH";
    case UrgencyLevel.NORMAL:
      return "NORMAL";
    case UrgencyLevel.LOW:
      return "LOW";
    default:
      return "NORMAL";
  }
};

// Map database UrgencyLevel to UrgencyLevel
const mapToUrgencyLevel = (urgency: string): UrgencyLevel => {
  switch (urgency) {
    case "EMERGENCY":
      return UrgencyLevel.EMERGENCY;
    case "HIGH":
      return UrgencyLevel.HIGH;
    case "NORMAL":
      return UrgencyLevel.NORMAL;
    case "LOW":
      return UrgencyLevel.LOW;
    default:
      return UrgencyLevel.NORMAL;
  }
};

export class QueueService {
  private queueManagers: Record<string, SmartQueueManager> = {};

  // Get or create queue manager for a hospital
  private getQueueManager(hospitalId: string): SmartQueueManager {
    if (!this.queueManagers[hospitalId]) {
      this.queueManagers[hospitalId] = new SmartQueueManager();
      
      // Load existing queue entries from database
      this.loadQueueFromDatabase(hospitalId);
    }
    return this.queueManagers[hospitalId];
  }

  // Load queue entries from database
  private async loadQueueFromDatabase(hospitalId: string) {
    try {
      const queueEntries = await prisma.queueEntry.findMany({
        where: {
          hospitalId,
          status: {
            in: ["WAITING", "IN_PROGRESS"] // Only load active entries
          }
        },
        include: {
          patient: {
            include: {
              user: true
            }
          }
        }
      });

      const queueManager = this.queueManagers[hospitalId];

      // Convert database entries to QueuePatient objects
      queueEntries.forEach(entry => {
        const status = entry.status === "WAITING" ? "WAITING" : 
                      entry.status === "IN_PROGRESS" ? "IN_PROGRESS" : "COMPLETED";
        
        queueManager.addToQueue({
          id: entry.id,
          name: entry.patient.user.name || "Unknown Patient",
          urgency: mapToUrgencyLevel(entry.urgency),
          estimatedWaitTime: entry.estimatedWaitTime || 15,
          checkInTime: entry.entryTime
        });

        // Update status if needed
        if (status !== "WAITING") {
          queueManager.updatePatientStatus(entry.id, status);
        }
      });
    } catch (error) {
      console.error("Error loading queue from database:", error);
    }
  }

  // Get queue for a hospital
  async getHospitalQueue(hospitalId: string) {
    const queueManager = this.getQueueManager(hospitalId);
    return queueManager.getQueue();
  }

  // Get a specific patient's queue info
  async getPatientQueueInfo(hospitalId: string, patientId: string) {
    const queueManager = this.getQueueManager(hospitalId);
    return queueManager.getPatient(patientId);
  }

  // Add patient to queue
  async addPatientToQueue(
    hospitalId: string,
    patientId: string,
    patientName: string,
    urgency: UrgencyLevel,
    estimatedWaitTime: number
  ) {
    try {
      const queueManager = this.getQueueManager(hospitalId);
      
      // Add to in-memory queue
      const queuePatient = queueManager.addToQueue({
        id: patientId,
        name: patientName,
        urgency,
        estimatedWaitTime,
        checkInTime: new Date()
      });

      // Save to database
      await prisma.queueEntry.create({
        data: {
          id: patientId,
          patientId,
          hospitalId,
          queuePosition: queuePatient.currentPosition,
          estimatedWaitTime: estimatedWaitTime,
          entryTime: queuePatient.checkInTime,
          status: "WAITING",
          urgency: mapUrgencyLevel(urgency)
        }
      });

      return queuePatient;
    } catch (error) {
      console.error("Error adding patient to queue:", error);
      throw new Error("Failed to add patient to queue");
    }
  }

  // Update patient status
  async updatePatientStatus(hospitalId: string, patientId: string, status: string) {
    try {
      const queueManager = this.getQueueManager(hospitalId);
      
      // Map status to database status
      const dbStatus = status === "WAITING" ? "WAITING" :
                       status === "IN_PROGRESS" ? "IN_PROGRESS" :
                       status === "COMPLETED" ? "COMPLETED" : "CANCELLED";
      
      // Update in-memory queue
      const success = queueManager.updatePatientStatus(patientId, status as any);
      
      if (!success) {
        throw new Error("Patient not found in queue");
      }

      // Update database
      await prisma.queueEntry.update({
        where: { id: patientId },
        data: {
          status: dbStatus,
          startTime: status === "IN_PROGRESS" ? new Date() : undefined,
          endTime: (status === "COMPLETED" || status === "CANCELLED") ? new Date() : undefined
        }
      });

      return success;
    } catch (error) {
      console.error("Error updating patient status:", error);
      throw new Error("Failed to update patient status");
    }
  }

  // Remove patient from queue
  async removePatientFromQueue(hospitalId: string, patientId: string) {
    try {
      const queueManager = this.getQueueManager(hospitalId);
      
      // Remove from in-memory queue
      const success = queueManager.removeFromQueue(patientId);
      
      if (!success) {
        throw new Error("Patient not found in queue");
      }

      // Update database
      await prisma.queueEntry.update({
        where: { id: patientId },
        data: {
          status: "CANCELLED",
          endTime: new Date()
        }
      });

      return success;
    } catch (error) {
      console.error("Error removing patient from queue:", error);
      throw new Error("Failed to remove patient from queue");
    }
  }
}

// Create singleton instance
export const queueService = new QueueService(); 