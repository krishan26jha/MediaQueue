'use client';

import { useState, useEffect } from 'react';

interface EmergencyRequest {
  id: string;
  patientName: string;
  patientPhone: string;
  patientLocation: string;
  emergencyType: string;
  status: string;
  priorityLevel: string;
  description?: string;
  acknowledgedBy?: string;
  acknowledgedAt?: string;
  resolvedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export default function EmergencyContent() {
  const [emergencyRequests, setEmergencyRequests] = useState<EmergencyRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');
  const [refreshInterval, setRefreshInterval] = useState<NodeJS.Timeout | null>(null);

  const fetchEmergencyRequests = async () => {
    try {
      const url = filter === 'ALL' ? '/api/emergency' : `/api/emergency?status=${filter}`;
      const response = await fetch(url);
      const data = await response.json();
      
      if (response.ok) {
        setEmergencyRequests(data.emergencyRequests || []);
      } else {
        console.error('Failed to fetch emergency requests:', data.error);
      }
    } catch (error) {
      console.error('Error fetching emergency requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id: string, newStatus: string) => {
    try {
      const response = await fetch('/api/emergency', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id,
          status: newStatus,
          acknowledgedBy: newStatus === 'ACKNOWLEDGED' ? 'Nurse Anita Sharma' : undefined
        })
      });

      const data = await response.json();
      
      if (response.ok) {
        // Refresh the list
        fetchEmergencyRequests();
      } else {
        console.error('Failed to update emergency request:', data.error);
        alert('Failed to update emergency request');
      }
    } catch (error) {
      console.error('Error updating emergency request:', error);
      alert('Failed to update emergency request');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-red-100 text-red-800';
      case 'ACKNOWLEDGED': return 'bg-yellow-100 text-yellow-800';
      case 'DISPATCHED': return 'bg-blue-100 text-blue-800';
      case 'RESOLVED': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'EMERGENCY': return 'bg-red-600 text-white';
      case 'HIGH': return 'bg-orange-600 text-white';
      default: return 'bg-yellow-600 text-white';
    }
  };

  const formatEmergencyType = (type: string) => {
    const types: { [key: string]: string } = {
      'cardiac': 'Cardiac Emergency',
      'respiratory': 'Respiratory Distress',
      'trauma': 'Trauma/Injury',
      'stroke': 'Stroke Symptoms',
      'allergic': 'Severe Allergic Reaction',
      'other': 'Other Medical Emergency'
    };
    return types[type] || type;
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const getTimeAgo = (dateString: string) => {
    const now = new Date();
    const past = new Date(dateString);
    const diffMinutes = Math.floor((now.getTime() - past.getTime()) / (1000 * 60));
    
    if (diffMinutes < 1) return 'Just now';
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  };

  useEffect(() => {
    fetchEmergencyRequests();

    // Set up real-time refresh every 30 seconds
    const interval = setInterval(fetchEmergencyRequests, 30000);
    setRefreshInterval(interval);

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [filter]);

  const pendingCount = emergencyRequests.filter(req => req.status === 'PENDING').length;
  const acknowledgedCount = emergencyRequests.filter(req => req.status === 'ACKNOWLEDGED').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Emergency Requests</h2>
          <p className="text-gray-600">Monitor and manage emergency assistance requests</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <button
            onClick={fetchEmergencyRequests}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-red-50 p-6 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-red-600">Pending</p>
              <p className="text-3xl font-bold text-red-900">{pendingCount}</p>
            </div>
            <div className="h-12 w-12 bg-red-100 rounded-full flex items-center justify-center">
              <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-yellow-50 p-6 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-yellow-600">Acknowledged</p>
              <p className="text-3xl font-bold text-yellow-900">{acknowledgedCount}</p>
            </div>
            <div className="h-12 w-12 bg-yellow-100 rounded-full flex items-center justify-center">
              <svg className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 p-6 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600">Total Today</p>
              <p className="text-3xl font-bold text-blue-900">{emergencyRequests.length}</p>
            </div>
            <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
              <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-green-50 p-6 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-600">Auto-Refresh</p>
              <p className="text-sm font-bold text-green-900">Every 30s</p>
            </div>
            <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
              <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {['ALL', 'PENDING', 'ACKNOWLEDGED', 'DISPATCHED', 'RESOLVED'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                filter === status
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {status === 'ALL' ? 'All Requests' : status.charAt(0) + status.slice(1).toLowerCase()}
            </button>
          ))}
        </nav>
      </div>

      {/* Emergency Requests List */}
      {loading ? (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-gray-600">Loading emergency requests...</p>
        </div>
      ) : emergencyRequests.length === 0 ? (
        <div className="text-center py-8">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No emergency requests</h3>
          <p className="mt-1 text-sm text-gray-500">
            {filter === 'ALL' ? 'No emergency requests have been submitted.' : `No ${filter.toLowerCase()} emergency requests.`}
          </p>
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {emergencyRequests.map((request) => (
              <li key={request.id} className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(request.priorityLevel)}`}>
                          {request.priorityLevel}
                        </span>
                        <span className={`ml-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                          {request.status}
                        </span>
                        <span className="ml-3 text-sm text-gray-500">
                          {getTimeAgo(request.createdAt)}
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        {request.status === 'PENDING' && (
                          <button
                            onClick={() => handleStatusUpdate(request.id, 'ACKNOWLEDGED')}
                            className="px-3 py-1 bg-yellow-600 text-white text-sm rounded hover:bg-yellow-700"
                          >
                            Acknowledge
                          </button>
                        )}
                        {request.status === 'ACKNOWLEDGED' && (
                          <button
                            onClick={() => handleStatusUpdate(request.id, 'DISPATCHED')}
                            className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                          >
                            Dispatch
                          </button>
                        )}
                        {(request.status === 'DISPATCHED' || request.status === 'ACKNOWLEDGED') && (
                          <button
                            onClick={() => handleStatusUpdate(request.id, 'RESOLVED')}
                            className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
                          >
                            Resolve
                          </button>
                        )}
                      </div>
                    </div>
                    
                    <div className="mt-2">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="text-lg font-medium text-gray-900">{request.patientName}</h4>
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">Emergency:</span> {formatEmergencyType(request.emergencyType)}
                          </p>
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">Phone:</span> {request.patientPhone}
                          </p>
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">Location:</span> {request.patientLocation}
                          </p>
                        </div>
                        
                        <div>
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">Submitted:</span> {formatTime(request.createdAt)}
                          </p>
                          {request.acknowledgedBy && (
                            <p className="text-sm text-gray-600">
                              <span className="font-medium">Acknowledged by:</span> {request.acknowledgedBy}
                            </p>
                          )}
                          {request.acknowledgedAt && (
                            <p className="text-sm text-gray-600">
                              <span className="font-medium">Acknowledged at:</span> {formatTime(request.acknowledgedAt)}
                            </p>
                          )}
                          {request.resolvedAt && (
                            <p className="text-sm text-gray-600">
                              <span className="font-medium">Resolved at:</span> {formatTime(request.resolvedAt)}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
