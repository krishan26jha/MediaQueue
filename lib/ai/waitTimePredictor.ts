// Wait Time Predictor AI Model Simulation
// In a real implementation, this would be a machine learning model 
// trained on historical hospital queue data

export enum UrgencyLevel {
  EMERGENCY = 'EMERGENCY',
  HIGH = 'HIGH',
  NORMAL = 'NORMAL',
  LOW = 'LOW'
}

// Interface for queue data sent to the predictor
export interface QueueData {
  hospitalId: string;
  departmentId: string;
  urgencyLevel: UrgencyLevel;
  patientCount?: number; // Total patients in the queue
  currentLoad?: number; // 0.0 to 1.0 representing hospital capacity
  averageServiceTime?: number; // minutes per patient
  timeOfDay?: number; // hour of day (0-23)
  dayOfWeek?: number; // day of week (0=Sun, 6=Sat)
  isHoliday?: boolean; // if it's a holiday
  emergencyCases?: number; // number of emergency cases
  staffCount?: number; // number of available staff
}

// Interface for prediction result
export interface WaitTimePrediction {
  estimatedWaitTime: number; // in minutes
  confidenceScore: number; // 0.0 to 1.0
  minWaitTime: number; // in minutes
  maxWaitTime: number; // in minutes
  factors: string[]; // factors that influenced the prediction
}

// Urgency level weights (higher urgency = faster service)
const URGENCY_WEIGHTS = {
  [UrgencyLevel.LOW]: 1.2,
  [UrgencyLevel.NORMAL]: 1.0,
  [UrgencyLevel.HIGH]: 0.7,
  [UrgencyLevel.EMERGENCY]: 0.3
};

// Time of day impact factors (busier times have higher factors)
const TIME_OF_DAY_FACTORS = [
  0.7, 0.6, 0.5, 0.5, 0.5, 0.6, // 0-5 AM
  0.8, 1.2, 1.5, 1.3, 1.2, 1.3, // 6-11 AM
  1.4, 1.3, 1.2, 1.3, 1.4, 1.5, // 12-5 PM
  1.4, 1.3, 1.2, 1.0, 0.9, 0.8  // 6-11 PM
];

// Day of week impact factors
const DAY_OF_WEEK_FACTORS = [
  0.8, // Sunday
  1.2, // Monday
  1.1, // Tuesday
  1.0, // Wednesday
  1.0, // Thursday
  1.1, // Friday
  0.9  // Saturday
];

/**
 * Predicts wait time based on queue data
 * In a real system, this would call a trained ML model
 */
export function predictWaitTime(queueData: QueueData): WaitTimePrediction {
  // Set defaults for optional parameters
  const patientCount = queueData.patientCount ?? 10;
  const currentLoad = queueData.currentLoad ?? 0.5;
  const averageServiceTime = queueData.averageServiceTime ?? 15; // 15 min per patient average
  const timeOfDay = queueData.timeOfDay ?? new Date().getHours();
  const dayOfWeek = queueData.dayOfWeek ?? new Date().getDay();
  const isHoliday = queueData.isHoliday ?? false;
  const emergencyCases = queueData.emergencyCases ?? 0;
  const staffCount = queueData.staffCount ?? 3;
  
  // Store factors that influence the prediction
  const factors: string[] = [];
  
  // Base wait time calculation based on patient count and service time
  let baseWaitTime = Math.round(patientCount * averageServiceTime / staffCount);
  factors.push(`Base calculation: ${patientCount} patients × ${averageServiceTime} min average service time ÷ ${staffCount} staff`);
  
  // Adjust for urgency level
  let urgencyFactor = 1.0;
  switch (queueData.urgencyLevel) {
    case UrgencyLevel.EMERGENCY:
      urgencyFactor = 0.2; // 80% reduction in wait time
      factors.push('Emergency priority: 80% reduction');
      break;
    case UrgencyLevel.HIGH:
      urgencyFactor = 0.5; // 50% reduction
      factors.push('High urgency: 50% reduction');
      break;
    case UrgencyLevel.NORMAL:
      urgencyFactor = 1.0; // No change
      factors.push('Normal urgency: Standard wait time');
      break;
    case UrgencyLevel.LOW:
      urgencyFactor = 1.3; // 30% increase
      factors.push('Low urgency: 30% longer wait');
      break;
  }
  baseWaitTime *= urgencyFactor;
  
  // Adjust for hospital load
  const loadFactor = 1 + (currentLoad - 0.5) * 2; // 0.0=0.0, 0.5=1.0, 1.0=2.0
  baseWaitTime *= loadFactor;
  factors.push(`Hospital at ${Math.round(currentLoad * 100)}% capacity: ${loadFactor > 1 ? 'increased' : 'decreased'} wait time`);
  
  // Adjust for time of day (peak hours: 10-12, 14-16)
  let timeOfDayFactor = 1.0;
  if ((timeOfDay >= 10 && timeOfDay <= 12) || (timeOfDay >= 14 && timeOfDay <= 16)) {
    timeOfDayFactor = 1.2; // 20% increase during peak hours
    factors.push('Peak hours: 20% longer wait');
  } else if (timeOfDay >= 22 || timeOfDay <= 6) {
    timeOfDayFactor = 0.8; // 20% decrease during night
    factors.push('Off-peak hours: 20% shorter wait');
  }
  baseWaitTime *= timeOfDayFactor;
  
  // Adjust for day of week (weekends and Mondays are busier)
  let dayFactor = 1.0;
  if (dayOfWeek === 0 || dayOfWeek === 6) { // weekend
    dayFactor = 1.3; // 30% increase
    factors.push('Weekend: 30% longer wait');
  } else if (dayOfWeek === 1) { // Monday
    dayFactor = 1.2; // 20% increase
    factors.push('Monday: 20% longer wait');
  }
  baseWaitTime *= dayFactor;
  
  // Adjust for holidays
  if (isHoliday) {
    baseWaitTime *= 1.5; // 50% increase
    factors.push('Holiday: 50% longer wait');
  }
  
  // Adjust for emergency cases
  if (emergencyCases > 0) {
    const emergencyFactor = 1 + (emergencyCases * 0.1); // 10% increase per emergency
    baseWaitTime *= emergencyFactor;
    factors.push(`${emergencyCases} emergency cases: ${Math.round((emergencyFactor - 1) * 100)}% longer wait`);
  }
  
  // Calculate confidence score (in a real system this would be more sophisticated)
  // More factors considered = lower confidence
  const confidenceScore = Math.max(0.5, 1 - (factors.length * 0.05));
  
  // Calculate min and max wait times based on confidence
  const variability = (1 - confidenceScore) * baseWaitTime;
  const minWaitTime = Math.max(1, Math.round(baseWaitTime - variability));
  const maxWaitTime = Math.round(baseWaitTime + variability);
  
  // Round to nearest 5 minutes for better UX
  const roundedWaitTime = Math.max(1, Math.round(baseWaitTime / 5) * 5);
  
  return {
    estimatedWaitTime: roundedWaitTime,
    confidenceScore: parseFloat(confidenceScore.toFixed(2)),
    minWaitTime,
    maxWaitTime,
    factors
  };
}

/**
 * Get historical accuracy of the model
 * @returns The model's historical accuracy metrics
 */
export function getModelMetrics() {
  return {
    meanAbsoluteError: 8.4, // minutes
    accuracy: 0.86, // percentage of predictions within acceptable range
    sampleSize: 25000, // number of historical predictions analyzed
    lastUpdated: new Date('2023-12-01').toISOString(),
  };
}

/**
 * Recalculate wait time as conditions change
 * 
 * @param currentPrediction The current prediction
 * @param updates New queue data updates
 * @returns Updated prediction
 */
export function updatePrediction(
  currentPrediction: WaitTimePrediction, 
  updates: Partial<QueueData>
): WaitTimePrediction {
  // In a real system, this would use the updates to refine the prediction
  // For simulation, we'll just add some variability
  
  const variationFactor = 0.85 + (Math.random() * 0.3); // 0.85 to 1.15
  const newEstimatedTime = Math.round(currentPrediction.estimatedWaitTime * variationFactor);
  
  // If patient count decreased, reduce wait time
  if (updates.patientCount !== undefined && updates.patientCount < 0) {
    return {
      ...currentPrediction,
      estimatedWaitTime: Math.max(1, newEstimatedTime - 5),
      confidenceScore: Math.min(0.95, currentPrediction.confidenceScore + 0.03),
      minWaitTime: Math.max(1, Math.round(newEstimatedTime * 0.8)),
      maxWaitTime: Math.round(newEstimatedTime * 1.2)
    };
  }
  
  // If emergency cases increased, increase wait time
  if (updates.emergencyCases !== undefined && updates.emergencyCases > 0) {
    return {
      ...currentPrediction,
      estimatedWaitTime: newEstimatedTime + 10,
      confidenceScore: Math.max(0.6, currentPrediction.confidenceScore - 0.05),
      minWaitTime: Math.max(1, Math.round(newEstimatedTime * 0.7)),
      maxWaitTime: Math.round(newEstimatedTime * 1.4)
    };
  }
  
  // Default case: slight refinement of current prediction
  return {
    ...currentPrediction,
    estimatedWaitTime: newEstimatedTime,
    confidenceScore: Math.min(0.95, currentPrediction.confidenceScore + 0.01),
    minWaitTime: Math.max(1, Math.round(newEstimatedTime * 0.85)),
    maxWaitTime: Math.round(newEstimatedTime * 1.15)
  };
} 