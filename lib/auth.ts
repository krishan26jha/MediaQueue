import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { prisma } from '@/lib/db';

// Secret key for JWT should be provided in environment variables
export const JWT_SECRET = process.env.JWT_SECRET || process.env.NEXTAUTH_SECRET || '';

// Check that secret is available at startup
if (!JWT_SECRET) {
  console.error('Warning: No JWT_SECRET or NEXTAUTH_SECRET environment variable set');
}

/**
 * Verifies JWT token from authorization header
 * @param authHeader Authorization header value
 * @returns Object containing success status, user data if successful, and error message if failed
 */
export async function verifyAuthToken(authHeader: string | null) {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return { 
      success: false, 
      error: 'No token provided or invalid format' 
    };
  }

  const token = authHeader.split(' ')[1];
  
  try {
    // Make sure we have a secret key
    if (!JWT_SECRET) {
      return {
        success: false,
        error: 'JWT_SECRET is not configured. Please check your environment variables.'
      };
    }

    // Verify the token
    const decoded = jwt.verify(token, JWT_SECRET) as unknown as { userId: string, exp: number };
    
    // Check if token is expired
    if (decoded.exp && decoded.exp < Math.floor(Date.now() / 1000)) {
      return {
        success: false,
        error: 'Token has expired'
      };
    }
    
    // Get user from database
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
      }
    });
    
    if (!user) {
      return {
        success: false,
        error: 'User not found'
      };
    }
    
    // Return success with user data
    return {
      success: true,
      user: {
        userId: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    };
  } catch (error) {
    console.error('Token verification error:', error);
    return {
      success: false,
      error: 'Invalid token'
    };
  }
}

/**
 * Middleware to check if a user is authenticated
 * @param req The Next.js request object
 * @param allowedRoles Array of roles that are allowed to access the resource
 * @returns Object containing success status and error message if failed
 */
export async function isAuthenticated(req: NextRequest, allowedRoles?: string[]) {
  // Get authorization header
  const authHeader = req.headers.get('authorization');
  const authResult = await verifyAuthToken(authHeader);
  
  if (!authResult.success) {
    return {
      success: false,
      error: authResult.error || 'Authentication failed'
    };
  }
  
  // If roles are specified, check if user has one of the allowed roles
  if (allowedRoles && allowedRoles.length > 0 && authResult.user) {
    if (!allowedRoles.includes(authResult.user.role)) {
      return {
        success: false,
        error: 'You do not have permission to access this resource'
      };
    }
  }
  
  // Set user information in request headers if user exists
  if (authResult.user) {
    const userInfo = JSON.stringify(authResult.user);
    const headers = new Headers(req.headers);
    headers.set('x-user-info', userInfo);
    
    // Create a new request with the updated headers
    const newRequest = new NextRequest(req.url, {
      method: req.method,
      headers: headers,
      body: req.body,
    });
    
    return {
      success: true,
      request: newRequest
    };
  }
  
  return {
    success: true,
    request: req
  };
} 