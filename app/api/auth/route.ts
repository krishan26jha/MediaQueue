import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import * as bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'mediqueue-default-secret-key-change-in-production';

// POST for login
export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    
    console.log('Login attempt for:', email);
    
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }
    
    // Special handling for demo accounts
    const demoAccounts: { [key: string]: { role: string; userId: string; name: string } } = {
      'patient@demo.com': {
        role: 'PATIENT',
        userId: 'demo-patient-id',
        name: 'Rakesh Kumar'
      },
      'doctor@demo.com': {
        role: 'DOCTOR',
        userId: 'demo-doctor-id',
        name: 'Dr. Priya Patel'
      },
      'nurse@demo.com': {
        role: 'STAFF',
        userId: 'demo-nurse-id',
        name: 'Nurse Anita Sharma'
      },
      'lab@demo.com': {
        role: 'STAFF',
        userId: 'demo-lab-id',
        name: 'Lab Tech Vikram Singh'
      },
      'admin@demo.com': {
        role: 'ADMIN',
        userId: 'demo-admin-id',
        name: 'Admin Rakesh Kumar'
      }
    };
    
    // Check if this is a demo account with correct password
    if (demoAccounts[email] && password === 'demo1234') {
      console.log('Demo account login successful for:', email);
      
      const demoAccount = demoAccounts[email];
      
      // Generate JWT token for demo account
      const token = jwt.sign(
        { 
          userId: demoAccount.userId,
          email: email,
          role: demoAccount.role
        }, 
        JWT_SECRET,
        { expiresIn: '24h' }
      );
      
      // Prepare demo user data based on role
      let demoUserData: any = {
        id: demoAccount.userId,
        name: demoAccount.name,
        email: email,
        role: demoAccount.role,
      };
      
      // Add role-specific data for patient demo account
      if (email === 'patient@demo.com') {
        demoUserData = {
          ...demoUserData,
          patientId: 'demo-patient-id',
          dateOfBirth: '1990-05-15',
          gender: 'Male',
          phoneNumber: '+91 9876543210',
          address: '123 ABC, New Delhi, Delhi 110001',
          bloodType: 'O+',
          healthInsurance: {
            provider: 'National Health Insurance',
            policyNumber: 'NHIP-7890123',
            expiryDate: '2024-12-31'
          },
          medicalHistory: [
            {
              id: 'mh-001',
              condition: 'Hypertension',
              diagnosedDate: '2019-03-10',
              status: 'Ongoing',
              notes: 'Controlled with medication'
            }
          ],
          allergies: [
            {
              substance: 'Penicillin',
              severity: 'Severe',
              reaction: 'Rash, difficulty breathing'
            }
          ],
          medications: [
            {
              id: 'med-001',
              name: 'Lisinopril',
              dosage: '10mg',
              frequency: 'Once daily',
              startDate: '2019-03-15',
              endDate: null,
              prescribedBy: 'Dr. Priya Patel'
            }
          ],
          appointments: [
            {
              id: 'apt-001',
              type: 'Regular Checkup',
              date: '2023-05-20',
              time: '10:30 AM',
              doctor: 'Dr. Priya Patel',
              department: 'Internal Medicine',
              status: 'Completed',
              notes: 'Blood pressure well controlled. Continue current medication.'
            }
          ],
          preferredHospital: {
            id: 'hosp-001',
            name: 'Apollo Hospitals',
            address: '456 Sarojini Nagar, New Delhi, Delhi 110023',
            phone: '+91 11 98765432'
          }
        };
      } else if (demoAccount.role === 'DOCTOR') {
        // Add doctor-specific data
        demoUserData.doctorId = 'demo-doctor-id';
        demoUserData.specialization = 'Internal Medicine';
        demoUserData.department = {
          id: 'dept-001',
          name: 'Internal Medicine'
        };
        demoUserData.hospital = {
          id: 'hosp-001',
          name: 'Apollo Hospitals'
        };
      } else if (demoAccount.role === 'ADMIN') {
        // Add admin-specific data
        demoUserData.isAdmin = true;
      }
      
      // Return demo user data
      return NextResponse.json({
        success: true,
        token,
        user: demoUserData
      });
    }
    
    // If email exists in demo accounts but password is wrong
    if (demoAccounts[email] && password !== 'demo1234') {
      console.log('Invalid password for demo account:', email);
      return NextResponse.json(
        { error: 'Invalid email or password', success: false },
        { status: 401 }
      );
    }
    
    // Regular user authentication - check database
    try {
      const user = await prisma.user.findUnique({
        where: { email },
        include: {
          patient: true,
          doctor: true,
        },
      });
      
      if (!user) {
        console.log('User not found:', email);
        return NextResponse.json(
          { error: 'Invalid email or password', success: false },
          { status: 401 }
        );
      }
      
      // Verify password
      console.log('Verifying password for user:', user.id);
      
      if (!user.password) {
        console.log('User has no password set:', user.id);
        return NextResponse.json(
          { error: 'Invalid email or password', success: false },
          { status: 401 }
        );
      }
      
      const passwordMatch = await bcrypt.compare(password, user.password);
      
      if (!passwordMatch) {
        console.log('Password mismatch for user:', user.id);
        return NextResponse.json(
          { error: 'Invalid email or password', success: false },
          { status: 401 }
        );
      }
      
      console.log('Login successful for user:', user.id, 'with role:', user.role);
      
      // Generate JWT token
      const token = jwt.sign(
        { 
          userId: user.id,
          email: user.email,
          role: user.role
        }, 
        JWT_SECRET,
        { expiresIn: '24h' }
      );
      
      // Prepare response object based on user role
      let userData: any = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      };
      
      if (user.patient) {
        userData.patientId = user.patient.id;
        
        // Get patient's preferred hospital if any
        if (user.patient.preferredHospitalId) {
          const hospital = await prisma.hospital.findUnique({
            where: { id: user.patient.preferredHospitalId },
            select: {
              id: true,
              name: true,
            },
          });
          userData.preferredHospital = hospital;
        }
      } else if (user.doctor) {
        userData.doctorId = user.doctor.id;
        userData.specialization = user.doctor.specialization;
        
        // Get doctor's department and hospital
        const doctor = await prisma.doctor.findUnique({
          where: { id: user.doctor.id },
          include: {
            department: true,
            hospital: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        });
        
        userData.department = doctor?.department;
        userData.hospital = doctor?.hospital;
      } else if (user.role === 'STAFF' || user.role === 'ADMIN') {
        // Staff or Admin without special table
        userData.isAdmin = user.role === 'ADMIN';
      }
      
      // Update last login timestamp
      try {
        await prisma.user.update({
          where: { id: user.id },
          data: {
            updatedAt: new Date(),
          },
        });
      } catch (err) {
        console.error('Failed to update last login time', err);
        // Continue with login even if timestamp update fails
      }
      
      return NextResponse.json({
        success: true,
        token,
        user: userData,
      });
    } catch (dbError) {
      console.error('Database error during authentication:', dbError);
      // If database is not available, reject the login
      return NextResponse.json(
        { error: 'Invalid email or password', success: false },
        { status: 401 }
      );
    }
    
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Authentication failed', details: String(error) },
      { status: 500 }
    );
  }
}

// GET to check authentication status
export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'No token provided' },
        { status: 401 }
      );
    }
    
    const token = authHeader.split(' ')[1];
    
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as any;
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
        },
      });
      
      if (!user) {
        return NextResponse.json(
          { error: 'User not found' },
          { status: 404 }
        );
      }
      
      return NextResponse.json({
        success: true,
        user,
      });
    } catch (err) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error('Auth check error:', error);
    return NextResponse.json(
      { error: 'Authentication check failed' },
      { status: 500 }
    );
  }
}
