'use client';

import { useState } from 'react';

export default function SettingsContent() {
  // General settings
  const [generalSettings, setGeneralSettings] = useState({
    hospitalName: 'MediQueue General Hospital',
    location: 'Delhi, India',
    timezone: 'Asia/Kolkata',
  });
  
  const [contactEmail, setContactEmail] = useState('mediqueue@gmail.com');
  const [contactPhone, setContactPhone] = useState('+91 98765 43210');
  const [address, setAddress] = useState('123 Health Street, Medical District, NY 10001');
  
  // Queue settings
  const [maxWaitTimeAlert, setMaxWaitTimeAlert] = useState(60);
  const [enableAutomaticNotifications, setEnableAutomaticNotifications] = useState(true);
  const [enableSMSNotifications, setEnableSMSNotifications] = useState(true);
  const [enableEmailNotifications, setEnableEmailNotifications] = useState(true);
  const [notificationLeadTime, setNotificationLeadTime] = useState(15);
  
  // AI settings
  const [enableAIPredictions, setEnableAIPredictions] = useState(true);
  const [aiConfidenceThreshold, setAiConfidenceThreshold] = useState(75);
  const [collectFeedbackForAI, setCollectFeedbackForAI] = useState(true);
  
  // Access settings
  const [requireTwoFactorAuth, setRequireTwoFactorAuth] = useState(true);
  const [sessionTimeout, setSessionTimeout] = useState(30);
  const [allowStaffToEditQueue, setAllowStaffToEditQueue] = useState(true);
  
  // Form submission handlers
  const handleGeneralSettingsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would save the settings to the backend
    console.log('Saving general settings');
  };
  
  const handleQueueSettingsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would save the settings to the backend
    console.log('Saving queue settings');
  };
  
  const handleAISettingsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would save the settings to the backend
    console.log('Saving AI settings');
  };
  
  const handleAccessSettingsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would save the settings to the backend
    console.log('Saving access settings');
  };

  return (
    <div className="space-y-6">
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">System Settings</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">Configure your MediQueue instance settings</p>
        </div>
        
        {/* Tabs */}
        <div className="border-b border-gray-200">
          <div className="px-4 sm:px-6">
            <nav className="-mb-px flex flex-wrap gap-x-8 gap-y-2">
              <a href="#general" className="border-blue-500 text-blue-600 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm">
                General
              </a>
              <a href="#queue" className="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm">
                Queue Management
              </a>
              <a href="#ai" className="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm">
                AI Settings
              </a>
              <a href="#access" className="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm">
                Access & Security
              </a>
            </nav>
          </div>
        </div>
        
        {/* General Settings */}
        <div id="general" className="px-4 py-5 sm:px-6">
          <form onSubmit={handleGeneralSettingsSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
              <div className="sm:col-span-4">
                <label htmlFor="hospitalName" className="block text-sm font-medium text-gray-700">
                  Hospital Name
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    id="hospitalName"
                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    value={generalSettings.hospitalName}
                    onChange={(e) => setGeneralSettings({ ...generalSettings, hospitalName: e.target.value })}
                  />
                </div>
              </div>
              
              <div className="sm:col-span-3">
                <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-700">
                  Contact Email
                </label>
                <div className="mt-1">
                  <input
                    type="email"
                    id="contactEmail"
                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="sm:col-span-3">
                <label htmlFor="contactPhone" className="block text-sm font-medium text-gray-700">
                  Contact Phone
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    id="contactPhone"
                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="sm:col-span-6">
                <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                  Address
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    id="address"
                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                </div>
              </div>
            </div>
            
            <div className="flex justify-end">
              <button
                type="submit"
                className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Save General Settings
              </button>
            </div>
          </form>
        </div>
        
        {/* Queue Management Settings */}
        <div id="queue" className="px-4 py-5 sm:px-6 border-t border-gray-200">
          <form onSubmit={handleQueueSettingsSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
              <div className="sm:col-span-3">
                <label htmlFor="maxWaitTimeAlert" className="block text-sm font-medium text-gray-700">
                  Maximum Wait Time Alert (minutes)
                </label>
                <div className="mt-1">
                  <input
                    type="number"
                    id="maxWaitTimeAlert"
                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    value={maxWaitTimeAlert}
                    onChange={(e) => setMaxWaitTimeAlert(parseInt(e.target.value))}
                  />
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  Alert staff when patient wait time exceeds this value
                </p>
              </div>
              
              <div className="sm:col-span-3">
                <label htmlFor="notificationLeadTime" className="block text-sm font-medium text-gray-700">
                  Notification Lead Time (minutes)
                </label>
                <div className="mt-1">
                  <input
                    type="number"
                    id="notificationLeadTime"
                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    value={notificationLeadTime}
                    onChange={(e) => setNotificationLeadTime(parseInt(e.target.value))}
                  />
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  How many minutes before appointment to send notification
                </p>
              </div>
              
              <div className="sm:col-span-6">
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="enableAutomaticNotifications"
                      type="checkbox"
                      className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                      checked={enableAutomaticNotifications}
                      onChange={(e) => setEnableAutomaticNotifications(e.target.checked)}
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="enableAutomaticNotifications" className="font-medium text-gray-700">
                      Enable Automatic Notifications
                    </label>
                    <p className="text-gray-500">
                      Automatically notify patients about their queue status
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="sm:col-span-3">
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="enableSMSNotifications"
                      type="checkbox"
                      className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                      checked={enableSMSNotifications}
                      onChange={(e) => setEnableSMSNotifications(e.target.checked)}
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="enableSMSNotifications" className="font-medium text-gray-700">
                      Enable SMS Notifications
                    </label>
                  </div>
                </div>
              </div>
              
              <div className="sm:col-span-3">
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="enableEmailNotifications"
                      type="checkbox"
                      className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                      checked={enableEmailNotifications}
                      onChange={(e) => setEnableEmailNotifications(e.target.checked)}
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="enableEmailNotifications" className="font-medium text-gray-700">
                      Enable Email Notifications
                    </label>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end">
              <button
                type="submit"
                className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Save Queue Settings
              </button>
            </div>
          </form>
        </div>
        
        {/* AI Settings */}
        <div id="ai" className="px-4 py-5 sm:px-6 border-t border-gray-200">
          <form onSubmit={handleAISettingsSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
              <div className="sm:col-span-6">
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="enableAIPredictions"
                      type="checkbox"
                      className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                      checked={enableAIPredictions}
                      onChange={(e) => setEnableAIPredictions(e.target.checked)}
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="enableAIPredictions" className="font-medium text-gray-700">
                      Enable AI Predictions
                    </label>
                    <p className="text-gray-500">
                      Use AI to predict wait times and optimize queue management
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="sm:col-span-4">
                <label htmlFor="aiConfidenceThreshold" className="block text-sm font-medium text-gray-700">
                  AI Confidence Threshold (%)
                </label>
                <div className="mt-1">
                  <input
                    type="number"
                    id="aiConfidenceThreshold"
                    min="0"
                    max="100"
                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    value={aiConfidenceThreshold}
                    onChange={(e) => setAiConfidenceThreshold(parseInt(e.target.value))}
                  />
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  Minimum confidence level for AI predictions to be used
                </p>
              </div>
              
              <div className="sm:col-span-6">
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="collectFeedbackForAI"
                      type="checkbox"
                      className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                      checked={collectFeedbackForAI}
                      onChange={(e) => setCollectFeedbackForAI(e.target.checked)}
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="collectFeedbackForAI" className="font-medium text-gray-700">
                      Collect Feedback for AI
                    </label>
                    <p className="text-gray-500">
                      Collect user feedback to improve AI predictions
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end">
              <button
                type="submit"
                className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Save AI Settings
              </button>
            </div>
          </form>
        </div>
        
        {/* Access & Security Settings */}
        <div id="access" className="px-4 py-5 sm:px-6 border-t border-gray-200">
          <form onSubmit={handleAccessSettingsSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
              <div className="sm:col-span-6">
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="requireTwoFactorAuth"
                      type="checkbox"
                      className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                      checked={requireTwoFactorAuth}
                      onChange={(e) => setRequireTwoFactorAuth(e.target.checked)}
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="requireTwoFactorAuth" className="font-medium text-gray-700">
                      Require Two-Factor Authentication
                    </label>
                    <p className="text-gray-500">
                      Require two-factor authentication for all staff members
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="sm:col-span-3">
                <label htmlFor="sessionTimeout" className="block text-sm font-medium text-gray-700">
                  Session Timeout (minutes)
                </label>
                <div className="mt-1">
                  <input
                    type="number"
                    id="sessionTimeout"
                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    value={sessionTimeout}
                    onChange={(e) => setSessionTimeout(parseInt(e.target.value))}
                  />
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  Automatically log out users after inactivity
                </p>
              </div>
              
              <div className="sm:col-span-6">
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="allowStaffToEditQueue"
                      type="checkbox"
                      className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                      checked={allowStaffToEditQueue}
                      onChange={(e) => setAllowStaffToEditQueue(e.target.checked)}
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="allowStaffToEditQueue" className="font-medium text-gray-700">
                      Allow Staff to Edit Queue
                    </label>
                    <p className="text-gray-500">
                      Allow staff members to manually modify the queue order
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end">
              <button
                type="submit"
                className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Save Access Settings
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 