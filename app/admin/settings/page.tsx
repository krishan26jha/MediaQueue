'use client'

import { useState } from 'react'
import Link from 'next/link'

interface HospitalSettings {
  general: {
    name: string
    address: string
    phone: string
    email: string
    website: string
    operatingHours: string
  }
  notifications: {
    emailNotifications: boolean
    smsNotifications: boolean
    pushNotifications: boolean
    appointmentReminders: boolean
    waitTimeUpdates: boolean
  }
  queueSettings: {
    maxWaitTime: number
    emergencyThreshold: number
    autoAssignment: boolean
    priorityLevels: number
  }
  security: {
    requireTwoFactor: boolean
    sessionTimeout: number
    passwordExpiry: number
    loginAttempts: number
  }
}

const DEFAULT_SETTINGS: HospitalSettings = {
  general: {
    name: 'City General Hospital',
    address: '123 Healthcare Ave, Medical District, City, 12345',
    phone: '+91 98765 43210',
    email: 'info@citygeneralhospital.com',
    website: 'www.citygeneralhospital.com',
    operatingHours: '24/7'
  },
  notifications: {
    emailNotifications: true,
    smsNotifications: true,
    pushNotifications: false,
    appointmentReminders: true,
    waitTimeUpdates: true
  },
  queueSettings: {
    maxWaitTime: 120,
    emergencyThreshold: 15,
    autoAssignment: true,
    priorityLevels: 4
  },
  security: {
    requireTwoFactor: true,
    sessionTimeout: 30,
    passwordExpiry: 90,
    loginAttempts: 3
  }
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<HospitalSettings>(DEFAULT_SETTINGS)
  const [activeTab, setActiveTab] = useState('general')
  const [isEditing, setIsEditing] = useState(false)
  const [tempSettings, setTempSettings] = useState<HospitalSettings>(settings)

  const handleSave = () => {
    setSettings(tempSettings)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setTempSettings(settings)
    setIsEditing(false)
  }

  return (
    <div className="min-h-screen bg-gray-100 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">Hospital Settings</h1>
          <Link
            href="/admin/dashboard"
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            Back to Dashboard
          </Link>
        </div>

        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex">
              <button
                onClick={() => setActiveTab('general')}
                className={`py-4 px-6 text-sm font-medium ${
                  activeTab === 'general'
                    ? 'border-b-2 border-primary-500 text-primary-600'
                    : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                General
              </button>
              <button
                onClick={() => setActiveTab('notifications')}
                className={`py-4 px-6 text-sm font-medium ${
                  activeTab === 'notifications'
                    ? 'border-b-2 border-primary-500 text-primary-600'
                    : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Notifications
              </button>
              <button
                onClick={() => setActiveTab('queue')}
                className={`py-4 px-6 text-sm font-medium ${
                  activeTab === 'queue'
                    ? 'border-b-2 border-primary-500 text-primary-600'
                    : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Queue Settings
              </button>
              <button
                onClick={() => setActiveTab('security')}
                className={`py-4 px-6 text-sm font-medium ${
                  activeTab === 'security'
                    ? 'border-b-2 border-primary-500 text-primary-600'
                    : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Security
              </button>
            </nav>
          </div>

          <div className="p-6">
            {/* General Settings */}
            {activeTab === 'general' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Hospital Information</h3>
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Hospital Name</label>
                      <input
                        type="text"
                        value={isEditing ? tempSettings.general.name : settings.general.name}
                        onChange={(e) => setTempSettings({
                          ...tempSettings,
                          general: { ...tempSettings.general, name: e.target.value }
                        })}
                        disabled={!isEditing}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm disabled:bg-gray-50 disabled:text-gray-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Address</label>
                      <input
                        type="text"
                        value={isEditing ? tempSettings.general.address : settings.general.address}
                        onChange={(e) => setTempSettings({
                          ...tempSettings,
                          general: { ...tempSettings.general, address: e.target.value }
                        })}
                        disabled={!isEditing}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm disabled:bg-gray-50 disabled:text-gray-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Phone</label>
                      <input
                        type="text"
                        value={isEditing ? tempSettings.general.phone : settings.general.phone}
                        onChange={(e) => setTempSettings({
                          ...tempSettings,
                          general: { ...tempSettings.general, phone: e.target.value }
                        })}
                        disabled={!isEditing}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm disabled:bg-gray-50 disabled:text-gray-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Email</label>
                      <input
                        type="email"
                        value={isEditing ? tempSettings.general.email : settings.general.email}
                        onChange={(e) => setTempSettings({
                          ...tempSettings,
                          general: { ...tempSettings.general, email: e.target.value }
                        })}
                        disabled={!isEditing}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm disabled:bg-gray-50 disabled:text-gray-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Notification Settings */}
            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Notification Preferences</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">Email Notifications</h4>
                        <p className="text-sm text-gray-500">Receive updates via email</p>
                      </div>
                      <button
                        onClick={() => isEditing && setTempSettings({
                          ...tempSettings,
                          notifications: {
                            ...tempSettings.notifications,
                            emailNotifications: !tempSettings.notifications.emailNotifications
                          }
                        })}
                        disabled={!isEditing}
                        className={`${
                          (isEditing ? tempSettings : settings).notifications.emailNotifications
                            ? 'bg-primary-600'
                            : 'bg-gray-200'
                        } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:cursor-not-allowed`}
                      >
                        <span
                          className={`${
                            (isEditing ? tempSettings : settings).notifications.emailNotifications
                              ? 'translate-x-5'
                              : 'translate-x-0'
                          } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
                        />
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">SMS Notifications</h4>
                        <p className="text-sm text-gray-500">Receive updates via SMS</p>
                      </div>
                      <button
                        onClick={() => isEditing && setTempSettings({
                          ...tempSettings,
                          notifications: {
                            ...tempSettings.notifications,
                            smsNotifications: !tempSettings.notifications.smsNotifications
                          }
                        })}
                        disabled={!isEditing}
                        className={`${
                          (isEditing ? tempSettings : settings).notifications.smsNotifications
                            ? 'bg-primary-600'
                            : 'bg-gray-200'
                        } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:cursor-not-allowed`}
                      >
                        <span
                          className={`${
                            (isEditing ? tempSettings : settings).notifications.smsNotifications
                              ? 'translate-x-5'
                              : 'translate-x-0'
                          } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
                        />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Queue Settings */}
            {activeTab === 'queue' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Queue Management</h3>
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Maximum Wait Time (minutes)</label>
                      <input
                        type="number"
                        value={isEditing ? tempSettings.queueSettings.maxWaitTime : settings.queueSettings.maxWaitTime}
                        onChange={(e) => setTempSettings({
                          ...tempSettings,
                          queueSettings: {
                            ...tempSettings.queueSettings,
                            maxWaitTime: parseInt(e.target.value)
                          }
                        })}
                        disabled={!isEditing}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm disabled:bg-gray-50 disabled:text-gray-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Emergency Threshold (minutes)</label>
                      <input
                        type="number"
                        value={isEditing ? tempSettings.queueSettings.emergencyThreshold : settings.queueSettings.emergencyThreshold}
                        onChange={(e) => setTempSettings({
                          ...tempSettings,
                          queueSettings: {
                            ...tempSettings.queueSettings,
                            emergencyThreshold: parseInt(e.target.value)
                          }
                        })}
                        disabled={!isEditing}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm disabled:bg-gray-50 disabled:text-gray-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Security Settings */}
            {activeTab === 'security' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Security Settings</h3>
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Session Timeout (minutes)</label>
                      <input
                        type="number"
                        value={isEditing ? tempSettings.security.sessionTimeout : settings.security.sessionTimeout}
                        onChange={(e) => setTempSettings({
                          ...tempSettings,
                          security: {
                            ...tempSettings.security,
                            sessionTimeout: parseInt(e.target.value)
                          }
                        })}
                        disabled={!isEditing}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm disabled:bg-gray-50 disabled:text-gray-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Password Expiry (days)</label>
                      <input
                        type="number"
                        value={isEditing ? tempSettings.security.passwordExpiry : settings.security.passwordExpiry}
                        onChange={(e) => setTempSettings({
                          ...tempSettings,
                          security: {
                            ...tempSettings.security,
                            passwordExpiry: parseInt(e.target.value)
                          }
                        })}
                        disabled={!isEditing}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm disabled:bg-gray-50 disabled:text-gray-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="mt-6 flex justify-end space-x-3">
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  Edit Settings
                </button>
              ) : (
                <>
                  <button
                    onClick={handleCancel}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    Save Changes
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 