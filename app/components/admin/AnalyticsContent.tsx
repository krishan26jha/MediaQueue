'use client';

import { useState, useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

export default function AnalyticsContent() {
  const [selectedTimeRange, setSelectedTimeRange] = useState('weekly');
  const [selectedMetric, setSelectedMetric] = useState('waitTime');
  
  // References for chart canvases
  const waitTimeChartRef = useRef<HTMLCanvasElement>(null);
  const patientVolumeChartRef = useRef<HTMLCanvasElement>(null);
  
  // Charts instances references
  const waitTimeChartInstance = useRef<Chart | null>(null);
  const patientVolumeChartInstance = useRef<Chart | null>(null);

  // Mock data for analytics
  const analyticsData = {
    waitTimeByHour: [
      { hour: '08:00', current: 28, previous: 25 },
      { hour: '09:00', current: 35, previous: 30 },
      { hour: '10:00', current: 42, previous: 38 },
      { hour: '11:00', current: 38, previous: 35 },
      { hour: '12:00', current: 32, previous: 30 },
      { hour: '13:00', current: 40, previous: 36 },
      { hour: '14:00', current: 45, previous: 42 },
      { hour: '15:00', current: 48, previous: 45 },
      { hour: '16:00', current: 40, previous: 38 },
      { hour: '17:00', current: 32, previous: 30 },
    ],
    patientVolumeByDay: [
      { day: 'Mon', current: 75, previous: 68 },
      { day: 'Tue', current: 82, previous: 75 },
      { day: 'Wed', current: 78, previous: 80 },
      { day: 'Thu', current: 85, previous: 82 },
      { day: 'Fri', current: 92, previous: 88 },
      { day: 'Sat', current: 68, previous: 65 },
      { day: 'Sun', current: 58, previous: 52 },
    ],
    staffUtilization: [
      { name: 'Dr. Rajesh Sharma', utilization: 85, patients: 28 },
      { name: 'Dr. Priya Patel', utilization: 92, patients: 32 },
      { name: 'Dr. Vikram Singh', utilization: 78, patients: 24 },
      { name: 'Dr. Ananya Mehta', utilization: 88, patients: 30 },
      { name: 'Dr. Sunil Verma', utilization: 72, patients: 22 },
    ],
    departmentPerformance: [
      { name: 'General Medicine', waitTime: 42, satisfaction: 78 },
      { name: 'Pediatrics', waitTime: 31, satisfaction: 85 },
      { name: 'Orthopedics', waitTime: 45, satisfaction: 74 },
      { name: 'Cardiology', waitTime: 52, satisfaction: 72 },
      { name: 'Neurology', waitTime: 60, satisfaction: 68 },
    ],
    insightsAndRecommendations: [
      {
        id: 1,
        title: 'Wait Time Reduction',
        description: 'Wait times have increased by 12% during peak hours. Consider adding 2 more staff members between 2pm-4pm.',
        impact: 'high',
        category: 'staffing'
      },
      {
        id: 2,
        title: 'Department Efficiency',
        description: 'Pediatrics department has improved efficiency by 15% after implementing the new triage system.',
        impact: 'medium',
        category: 'process'
      },
      {
        id: 3,
        title: 'Patient Satisfaction',
        description: 'Satisfaction scores decreased by 8% for patients waiting longer than 45 minutes. Consider improving communication during wait times.',
        impact: 'high',
        category: 'experience'
      },
      {
        id: 4,
        title: 'Resource Allocation',
        description: 'Room utilization is suboptimal on weekends. Consider reducing staff on weekend mornings and increasing for afternoons.',
        impact: 'medium',
        category: 'staffing'
      },
      {
        id: 5,
        title: 'Prediction Accuracy',
        description: 'AI prediction model accuracy has improved to 92% for wait time estimates, reducing patient complaints by 18%.',
        impact: 'medium',
        category: 'technology'
      },
    ]
  };

  // Initialize charts when component mounts
  useEffect(() => {
    // Create Wait Time chart
    if (waitTimeChartRef.current) {
      const ctx = waitTimeChartRef.current.getContext('2d');
      if (ctx) {
        // Destroy previous chart instance if it exists
        if (waitTimeChartInstance.current) {
          waitTimeChartInstance.current.destroy();
        }
        
        // Create new chart
        waitTimeChartInstance.current = new Chart(ctx, {
          type: 'bar',
          data: {
            labels: analyticsData.waitTimeByHour.map(item => item.hour),
            datasets: [
              {
                label: 'Current Week',
                data: analyticsData.waitTimeByHour.map(item => item.current),
                backgroundColor: 'rgba(79, 70, 229, 0.8)',
                borderColor: 'rgba(79, 70, 229, 1)',
                borderWidth: 1
              },
              {
                label: 'Previous Week',
                data: analyticsData.waitTimeByHour.map(item => item.previous),
                backgroundColor: 'rgba(209, 213, 219, 0.5)',
                borderColor: 'rgba(209, 213, 219, 1)',
                borderWidth: 1
              }
            ]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: 'top',
              },
              title: {
                display: true,
                text: 'Average Wait Time by Hour (Minutes)'
              },
              tooltip: {
                callbacks: {
                  label: function(context) {
                    return `${context.dataset.label}: ${context.parsed.y} min`;
                  }
                }
              }
            },
            scales: {
              y: {
                beginAtZero: true,
                title: {
                  display: true,
                  text: 'Wait Time (Minutes)'
                }
              },
              x: {
                title: {
                  display: true,
                  text: 'Hour of Day'
                }
              }
            }
          }
        });
      }
    }
    
    // Create Patient Volume chart
    if (patientVolumeChartRef.current) {
      const ctx = patientVolumeChartRef.current.getContext('2d');
      if (ctx) {
        // Destroy previous chart instance if it exists
        if (patientVolumeChartInstance.current) {
          patientVolumeChartInstance.current.destroy();
        }
        
        // Create new chart
        patientVolumeChartInstance.current = new Chart(ctx, {
          type: 'line',
          data: {
            labels: analyticsData.patientVolumeByDay.map(item => item.day),
            datasets: [
              {
                label: 'Current Week',
                data: analyticsData.patientVolumeByDay.map(item => item.current),
                fill: false,
                backgroundColor: 'rgba(16, 185, 129, 1)',
                borderColor: 'rgba(16, 185, 129, 1)',
                tension: 0.3,
                pointBackgroundColor: 'rgba(16, 185, 129, 1)',
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: 'rgba(16, 185, 129, 1)'
              },
              {
                label: 'Previous Week',
                data: analyticsData.patientVolumeByDay.map(item => item.previous),
                fill: false,
                backgroundColor: 'rgba(209, 213, 219, 1)',
                borderColor: 'rgba(209, 213, 219, 1)',
                tension: 0.3,
                pointBackgroundColor: 'rgba(209, 213, 219, 1)',
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: 'rgba(209, 213, 219, 1)'
              }
            ]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: 'top',
              },
              title: {
                display: true,
                text: 'Patient Volume by Day'
              },
              tooltip: {
                callbacks: {
                  label: function(context) {
                    return `${context.dataset.label}: ${context.parsed.y} patients`;
                  }
                }
              }
            },
            scales: {
              y: {
                beginAtZero: true,
                title: {
                  display: true,
                  text: 'Number of Patients'
                }
              },
              x: {
                title: {
                  display: true,
                  text: 'Day of Week'
                }
              }
            }
          }
        });
      }
    }
    
    // Cleanup on component unmount
    return () => {
      if (waitTimeChartInstance.current) {
        waitTimeChartInstance.current.destroy();
      }
      if (patientVolumeChartInstance.current) {
        patientVolumeChartInstance.current.destroy();
      }
    };
  }, [selectedTimeRange]); // Re-render charts when time range changes

  const getImpactColor = (impact: string) => {
    switch(impact) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryColor = (category: string) => {
    switch(category) {
      case 'staffing': return 'bg-blue-100 text-blue-800';
      case 'process': return 'bg-purple-100 text-purple-800';
      case 'experience': return 'bg-green-100 text-green-800';
      case 'technology': return 'bg-indigo-100 text-indigo-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Filter options */}
      <div className="bg-white shadow rounded-lg p-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h2 className="text-lg font-medium text-gray-900">Analytics & Insights</h2>
            <p className="text-sm text-gray-500">Track key metrics and trends for your hospital queue</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <div>
              <label htmlFor="timeRange" className="block text-sm font-medium text-gray-700 mb-1">Time Range</label>
              <select
                id="timeRange"
                className="w-full sm:w-auto rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                value={selectedTimeRange}
                onChange={(e) => setSelectedTimeRange(e.target.value)}
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="quarterly">Quarterly</option>
              </select>
            </div>
            <div>
              <label htmlFor="metric" className="block text-sm font-medium text-gray-700 mb-1">Primary Metric</label>
              <select
                id="metric"
                className="w-full sm:w-auto rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                value={selectedMetric}
                onChange={(e) => setSelectedMetric(e.target.value)}
              >
                <option value="waitTime">Wait Time</option>
                <option value="patientVolume">Patient Volume</option>
                <option value="staffUtilization">Staff Utilization</option>
                <option value="satisfaction">Patient Satisfaction</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Key metrics summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white shadow rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Avg. Wait Time</p>
              <p className="text-3xl font-bold text-gray-900">38 min</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <svg className="h-6 w-6 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <div className="mt-2">
            <div className="flex items-center text-sm">
              <span className="text-red-500">↑ 5%</span>
              <span className="ml-1 text-gray-500">from last week</span>
            </div>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Daily Patient Volume</p>
              <p className="text-3xl font-bold text-gray-900">78</p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <svg className="h-6 w-6 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
          </div>
          <div className="mt-2">
            <div className="flex items-center text-sm">
              <span className="text-green-500">↑ 8%</span>
              <span className="ml-1 text-gray-500">from last week</span>
            </div>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Staff Utilization</p>
              <p className="text-3xl font-bold text-gray-900">83%</p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-full">
              <svg className="h-6 w-6 text-yellow-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <div className="mt-2">
            <div className="flex items-center text-sm">
              <span className="text-yellow-500">~ 2%</span>
              <span className="ml-1 text-gray-500">steady rate</span>
            </div>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Patient Satisfaction</p>
              <p className="text-3xl font-bold text-gray-900">76%</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <svg className="h-6 w-6 text-purple-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <div className="mt-2">
            <div className="flex items-center text-sm">
              <span className="text-red-500">↓ 3%</span>
              <span className="ml-1 text-gray-500">from last week</span>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="bg-white shadow rounded-lg p-4">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Wait Time by Hour</h3>
          <div className="h-64 sm:h-80">
            <canvas ref={waitTimeChartRef}></canvas>
          </div>
          <div className="mt-4 text-sm text-gray-500 text-center">
            Compare wait times throughout the day with previous periods
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-4">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Patient Volume by Day</h3>
          <div className="h-64 sm:h-80">
            <canvas ref={patientVolumeChartRef}></canvas>
          </div>
          <div className="mt-4 text-sm text-gray-500 text-center">
            Track patient load patterns across different days of the week
          </div>
        </div>
      </div>

      {/* Staff and Department Performance */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-4 py-5 sm:px-6 bg-gray-50 border-b">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Staff Utilization</h3>
          </div>
          <div className="p-4">
            <ul className="divide-y divide-gray-200">
              {analyticsData.staffUtilization.map((staff, index) => (
                <li key={index} className="py-3">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{staff.name}</p>
                      <p className="text-sm text-gray-500">{staff.patients} patients</p>
                    </div>
                    <div className="flex-shrink-0">
                      <div className="flex items-center">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          staff.utilization > 90 ? 'bg-red-100 text-red-800' :
                          staff.utilization > 80 ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {staff.utilization}%
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        staff.utilization > 90 ? 'bg-red-500' :
                        staff.utilization > 80 ? 'bg-yellow-500' :
                        'bg-green-500'
                      }`} 
                      style={{ width: `${staff.utilization}%` }}
                    ></div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-4 py-5 sm:px-6 bg-gray-50 border-b">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Department Performance</h3>
          </div>
          <div className="p-4">
            <ul className="divide-y divide-gray-200">
              {analyticsData.departmentPerformance.map((dept, index) => (
                <li key={index} className="py-3">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <p className="text-sm font-medium text-gray-900">{dept.name}</p>
                  </div>
                  <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-500">Wait Time</p>
                      <div className="flex items-center">
                        <p className="text-sm font-medium text-gray-900">{dept.waitTime} min</p>
                        <span className={`ml-2 text-xs ${
                          dept.waitTime > 45 ? 'text-red-500' :
                          dept.waitTime > 30 ? 'text-yellow-500' :
                          'text-green-500'
                        }`}>
                          {dept.waitTime > 45 ? '↑' : dept.waitTime > 30 ? '~' : '↓'}
                        </span>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Satisfaction</p>
                      <div className="flex items-center">
                        <p className="text-sm font-medium text-gray-900">{dept.satisfaction}%</p>
                        <span className={`ml-2 text-xs ${
                          dept.satisfaction < 70 ? 'text-red-500' :
                          dept.satisfaction < 80 ? 'text-yellow-500' :
                          'text-green-500'
                        }`}>
                          {dept.satisfaction < 70 ? '↓' : dept.satisfaction < 80 ? '~' : '↑'}
                        </span>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* AI Insights and Recommendations */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:px-6 bg-gray-50 border-b">
          <h3 className="text-lg leading-6 font-medium text-gray-900">AI Insights & Recommendations</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">Actionable insights based on your queue data</p>
        </div>
        <div className="p-4">
          <ul className="divide-y divide-gray-200">
            {analyticsData.insightsAndRecommendations.map((insight) => (
              <li key={insight.id} className="py-4">
                <div className="flex flex-col sm:flex-row sm:items-start gap-3">
                  <div className="flex-shrink-0 pt-1">
                    <svg className="h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      <h4 className="text-sm font-medium text-gray-900">{insight.title}</h4>
                      <div className="flex flex-wrap gap-2">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getImpactColor(insight.impact)}`}>
                          {insight.impact}
                        </span>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(insight.category)}`}>
                          {insight.category}
                        </span>
                      </div>
                    </div>
                    <p className="mt-2 text-sm text-gray-600">{insight.description}</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
} 