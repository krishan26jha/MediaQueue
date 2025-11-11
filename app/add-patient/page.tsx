'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import AddPatientForm from '../components/shared/AddPatientForm';

export default function AddPatientPage() {
  const router = useRouter();
  const [showSuccess, setShowSuccess] = useState(false);
  
  const handleSuccess = () => {
    setShowSuccess(true);
    // Redirect after a brief delay to show success message
    setTimeout(() => {
      router.push('/staff/dashboard');
    }, 2000);
  };
  
  return (
    <div className="container mx-auto px-4 py-8 pt-24">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8 text-primary-800">Patient Registration</h1>
        
        {showSuccess ? (
          <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-6" role="alert">
            <div className="flex items-center">
              <svg className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              <p className="font-bold">Patient Added Successfully!</p>
            </div>
            <p>Redirecting to dashboard...</p>
          </div>
        ) : null}
        
        <AddPatientForm onSuccess={handleSuccess} />
        
        <div className="mt-8 text-center">
          <button
            onClick={() => router.back()}
            className="text-primary-600 hover:underline focus:outline-none"
          >
            ← Back to previous page
          </button>
        </div>
      </div>
    </div>
  );
} 