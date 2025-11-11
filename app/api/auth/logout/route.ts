import { NextResponse } from 'next/server';

export async function POST() {
  try {
    // Clear the auth cookie
    const response = NextResponse.json({ success: true });
    response.cookies.delete('token');
    
    return response;
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { error: 'Logout failed' },
      { status: 500 }
    );
  }
} 