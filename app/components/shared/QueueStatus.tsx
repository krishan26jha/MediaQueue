import { useState, useEffect } from 'react';
import { WaitTimePrediction, UrgencyLevel } from '../lib/ai/waitTimePredictor';

interface QueueStatusProps {
  patientId: string;
  hospitalId: string;
  departmentId: string;
  appointmentTime?: Date;
  position: number;
  totalInQueue: number;
  urgencyLevel: UrgencyLevel;
}

export default function QueueStatus({ 
  patientId, 
  hospitalId, 
  departmentId, 
  appointmentTime, 
  position, 
  totalInQueue, 
  urgencyLevel 
}: QueueStatusProps) {
  const [prediction, setPrediction] = useState<WaitTimePrediction | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPrediction = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch('/api/predictions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            patientId,
            hospitalId,
            departmentId,
            urgencyLevel,
            patientCount: totalInQueue,
            currentPosition: position,
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to fetch prediction');
        }

        const data = await response.json();
        setPrediction(data.prediction);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
        console.error('Error fetching prediction:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPrediction();
    
    // Refresh prediction every 5 minutes
    const interval = setInterval(fetchPrediction, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, [patientId, hospitalId, departmentId, position, totalInQueue, urgencyLevel]);

  // Format time to display
  const formatTime = (minutes: number): string => {
    if (minutes < 60) {
      return `${minutes} min`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours} hr${hours > 1 ? 's' : ''} ${remainingMinutes > 0 ? `${remainingMinutes} min` : ''}`;
  };

  // Determine status based on urgency level
  const getStatusColor = (): string => {
    switch (urgencyLevel) {
      case UrgencyLevel.EMERGENCY:
        return 'bg-red-100 border-red-500 text-red-800';
      case UrgencyLevel.HIGH:
        return 'bg-orange-100 border-orange-500 text-orange-800';
      case UrgencyLevel.NORMAL:
        return 'bg-blue-100 border-blue-500 text-blue-800';
      case UrgencyLevel.LOW:
        return 'bg-green-100 border-green-500 text-green-800';
      default:
        return 'bg-gray-100 border-gray-500 text-gray-800';
    }
  };

  return (
    <div className="p-4 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Queue Status</h2>
      
      <div className={`p-4 rounded-md border-l-4 ${getStatusColor()} mb-4`}>
        <div className="flex items-center justify-between">
          <span className="font-medium">Priority Level:</span>
          <span className="font-bold">{urgencyLevel}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-white p-3 rounded-md shadow-sm">
          <div className="text-gray-500 text-sm">Position</div>
          <div className="text-2xl font-bold">{position} of {totalInQueue}</div>
        </div>
        
        <div className="bg-white p-3 rounded-md shadow-sm">
          <div className="text-gray-500 text-sm">Estimated Wait</div>
          {loading ? (
            <div className="animate-pulse h-8 bg-gray-200 rounded"></div>
          ) : error ? (
            <div className="text-red-500 text-sm">Unable to estimate</div>
          ) : (
            <div className="text-2xl font-bold">{formatTime(prediction?.estimatedWaitTime || 0)}</div>
          )}
        </div>
      </div>

      {appointmentTime && (
        <div className="bg-white p-3 rounded-md shadow-sm mb-4">
          <div className="text-gray-500 text-sm">Appointment Time</div>
          <div className="text-xl font-semibold">
            {appointmentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
          <div className="text-sm text-gray-500">
            {appointmentTime.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' })}
          </div>
        </div>
      )}
      
      {prediction && !loading && !error && (
        <div className="mt-4">
          <div className="text-sm text-gray-500 mb-2">Wait Time Range</div>
          <div className="flex items-center">
            <span className="text-sm font-medium">{formatTime(prediction.minWaitTime)}</span>
            <div className="mx-2 h-1 bg-blue-200 flex-grow rounded-full">
              <div 
                className="h-1 bg-blue-500 rounded-full" 
                style={{ width: `${(prediction.estimatedWaitTime - prediction.minWaitTime) / (prediction.maxWaitTime - prediction.minWaitTime) * 100}%` }}
              ></div>
            </div>
            <span className="text-sm font-medium">{formatTime(prediction.maxWaitTime)}</span>
          </div>
          
          <div className="mt-4 text-xs text-gray-500">
            <div className="mb-1">AI Confidence: {Math.round(prediction.confidenceScore * 100)}%</div>
            <details className="mt-2">
              <summary className="cursor-pointer text-blue-600">Factors affecting wait time</summary>
              <ul className="mt-2 pl-5 list-disc">
                {prediction.factors.map((factor, index) => (
                  <li key={index}>{factor}</li>
                ))}
              </ul>
            </details>
          </div>
        </div>
      )}
      
      <div className="mt-6 pt-4 border-t border-gray-200">
        <button className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded transition duration-150 ease-in-out">
          Refresh Status
        </button>
      </div>
    </div>
  );
} 