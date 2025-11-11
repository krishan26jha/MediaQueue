import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import * as bcrypt from 'bcryptjs';
import { PrismaClient, Prisma } from '@prisma/client';

// GET patients data
export async function GET(req: Request) {
  const url = new URL(req.url);
  const userId = url.searchParams.get('userId');
  const patientId = url.searchParams.get('patientId');
  const hospitalId = url.searchParams.get('hospitalId');
  
  try {
    const query: any = {};
    
    if (userId) {
      query.userId = userId;
    }
    
    if (patientId) {
      query.id = patientId;
    }
    
    if (hospitalId) {
      query.preferredHospitalId = hospitalId;
    }
    
    const patients = await prisma.patient.findMany({
      where: query,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            image: true,
            role: true,
            createdAt: true,
          },
        },
        preferredHospital: {
          select: {
            id: true,
            name: true,
            address: true,
            city: true,
            state: true,
          },
        },
      },
    });
    
    if (patientId && patients.length === 0) {
      return NextResponse.json(
        { error: 'Patient not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      patients: patientId ? patients[0] : patients,
    });
  } catch (error) {
    console.error('Error fetching patients:', error);
    return NextResponse.json(
      { error: 'Failed to fetch patients' },
      { status: 500 }
    );
  }
}

// POST to register a new patient
export async function POST(req: Request) {
  try {
    const data = await req.json();
    const {
      name,
      email,
      password,
      phone,
      medicalHistory,
      allergies,
      emergencyContact,
      preferredHospitalId,
      dateOfBirth,
      address,
      city,
      state,
      zipCode
    } = data;
    
    console.log('Patient registration attempt:', { name, email, phone });
    
    if (!name || !email || !password) {
      console.log('Missing required fields for registration');
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Check if user with email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });
    
    if (existingUser) {
      console.log('Registration failed: Email already in use:', email);
      return NextResponse.json(
        { error: 'Email already in use' },
        { status: 400 }
      );
    }
    
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('Password hashed successfully for:', email);
    
    // Create user and patient in a transaction
    const result = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      // Create user
      console.log('Creating user account for:', email);
      const user = await tx.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          role: 'PATIENT',
          phone: phone || null,
        },
      });
      
      console.log('User created successfully:', user.id);
      
      // Create patient
      console.log('Creating patient record for user:', user.id);
      
      // Get default hospital if none provided
      let hospitalId = preferredHospitalId;
      if (!hospitalId) {
        const defaultHospital = await tx.hospital.findFirst();
        if (defaultHospital) {
          hospitalId = defaultHospital.id;
        }
      }
      
      const patientData: any = {
        userId: user.id,
        medicalHistory: medicalHistory || null,
        allergies: allergies || null,
        emergencyContact: emergencyContact || null,
        preferredHospitalId: hospitalId || null,
      };
      
      // Note: dateOfBirth, address, city, state, zipCode are not in the current schema
      // These would need to be added to the Patient model if needed
      
      const patient = await tx.patient.create({
        data: patientData,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true,
              role: true,
            },
          },
          preferredHospital: hospitalId ? {
            select: {
              id: true,
              name: true,
            },
          } : false,
        },
      });
      
      console.log('Patient record created successfully:', patient.id);
      
      // Create welcome notification
      await tx.notification.create({
        data: {
          userId: user.id,
          title: 'Welcome to MediQueue',
          message: `Hello ${name}, your patient account has been created successfully. You can now schedule appointments and track your medical history.`,
          type: 'INFO',
        },
      });
      
      return { user, patient };
    });
    
    console.log('Registration complete for:', email);
    
    return NextResponse.json({
      success: true,
      message: 'Patient registered successfully',
      patient: result.patient,
    });
  } catch (error) {
    console.error('Error registering patient:', error);
    
    // More detailed error logging
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    
    // Check if it's a Prisma error
    if (error && typeof error === 'object' && 'code' in error) {
      console.error('Prisma error code:', (error as any).code);
      console.error('Prisma error meta:', (error as any).meta);
    }
    
    return NextResponse.json(
      { 
        error: 'Failed to register patient', 
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// PATCH to update patient details
export async function PATCH(req: Request) {
  try {
    const data = await req.json();
    const {
      patientId,
      name,
      phone,
      medicalHistory,
      allergies,
      emergencyContact,
      preferredHospitalId,
    } = data;
    
    if (!patientId) {
      return NextResponse.json(
        { error: 'Patient ID is required' },
        { status: 400 }
      );
    }
    
    // Get the patient
    const patient = await prisma.patient.findUnique({
      where: { id: patientId },
      include: {
        user: true,
      },
    });
    
    if (!patient) {
      return NextResponse.json(
        { error: 'Patient not found' },
        { status: 404 }
      );
    }
    
    // Update patient in a transaction
    const result = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      // Update user if name or phone changed
      if (name || phone) {
        await tx.user.update({
          where: { id: patient.userId },
          data: {
            name: name || undefined,
            phone: phone || undefined,
          },
        });
      }
      
      // Update patient details
      const updatedPatient = await tx.patient.update({
        where: { id: patientId },
        data: {
          medicalHistory: medicalHistory !== undefined ? medicalHistory : undefined,
          allergies: allergies !== undefined ? allergies : undefined,
          emergencyContact: emergencyContact !== undefined ? emergencyContact : undefined,
          preferredHospitalId: preferredHospitalId !== undefined ? preferredHospitalId : undefined,
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true,
              role: true,
            },
          },
          preferredHospital: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });
      
      return updatedPatient;
    });
    
    return NextResponse.json({
      success: true,
      message: 'Patient updated successfully',
      patient: result,
    });
  } catch (error) {
    console.error('Error updating patient:', error);
    return NextResponse.json(
      { error: 'Failed to update patient' },
      { status: 500 }
    );
  }
} 