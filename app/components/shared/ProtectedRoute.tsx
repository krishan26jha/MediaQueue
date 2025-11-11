'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState, ReactNode } from 'react';

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: string[];
}

export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  
  useEffect(() => {
    // Check if user is authenticated
    const checkAuth = () => {
      const token = localStorage.getItem('authToken');
      const userString = localStorage.getItem('user');
      
      if (!token || !userString) {
        setIsAuthenticated(false);
        return;
      }
      
      try {
        const user = JSON.parse(userString);
        
        // If specific roles are required, check if user has one of them
        if (allowedRoles && allowedRoles.length > 0) {
          if (!allowedRoles.includes(user.role)) {
            setIsAuthenticated(false);
            return;
          }
        }
        
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Error parsing user data:', error);
        setIsAuthenticated(false);
      }
    };
    
    checkAuth();
  }, [allowedRoles]);
  
  useEffect(() => {
    // Redirect to login if not authenticated
    if (isAuthenticated === false) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);
  
  // Show nothing while checking authentication
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  // If authenticated, render children
  return isAuthenticated ? <>{children}</> : null;
} 