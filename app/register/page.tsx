'use client';

import RegisterForm from '@/components/shared/RegisterForm';

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8 pt-20">
      <div className="max-w-md mx-auto">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Register as a Patient
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Create an account to manage your healthcare appointments
          </p>
        </div>
        
        <div className="mt-8">
          <RegisterForm />
        </div>
      </div>
    </div>
  );
} 