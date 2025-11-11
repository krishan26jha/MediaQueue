import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// GET doctors
export async function GET(req: Request) {
  const url = new URL(req.url);
  const doctorId = url.searchParams.get('doctorId');
  const userId = url.searchParams.get('userId');
  const hospitalId = url.searchParams.get('hospitalId');
  const departmentId = url.searchParams.get('departmentId');
  const includeAvailability = url.searchParams.get('includeAvailability') === 'true';
  
  try {
    const query: any = {};
    
    if (doctorId) {
      query.id = doctorId;
    }
    
    if (userId) {
      query.userId = userId;
    }
    
    if (hospitalId) {
      query.hospitalId = hospitalId;
    }
    
    if (departmentId) {
      query.departmentId = departmentId;
    }
    
    // If doctorId is provided, return a specific doctor
    if (doctorId) {
      const doctor = await prisma.doctor.findUnique({
        where: { id: doctorId },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true,
              image: true,
            },
          },
          department: true,
          hospital: {
            select: {
              id: true,
              name: true,
              address: true,
              city: true,
              state: true,
            },
          },
          availability: includeAvailability,
        },
      });
      
      if (!doctor) {
        return NextResponse.json(
          { error: 'Doctor not found' },
          { status: 404 }
        );
      }
      
      return NextResponse.json({
        success: true,
        doctor,
      });
    }
    
    // Otherwise, return doctors matching the query
    const doctors = await prisma.doctor.findMany({
      where: query,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            image: true,
          },
        },
        department: true,
        hospital: {
          select: {
            id: true,
            name: true,
            address: true,
            city: true,
            state: true,
          },
        },
        availability: includeAvailability,
      },
    });
    
    return NextResponse.json({
      success: true,
      doctors,
    });
  } catch (error) {
    console.error('Error fetching doctors:', error);
    return NextResponse.json(
      { error: 'Failed to fetch doctors' },
      { status: 500 }
    );
  }
}

// POST to create doctor availability
export async function POST(req: Request) {
  try {
    const data = await req.json();
    const { doctorId, dayOfWeek, startTime, endTime, isAvailable = true } = data;
    
    if (!doctorId || dayOfWeek === undefined || !startTime || !endTime) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Validate doctor exists
    const doctor = await prisma.doctor.findUnique({
      where: { id: doctorId },
    });
    
    if (!doctor) {
      return NextResponse.json(
        { error: 'Doctor not found' },
        { status: 404 }
      );
    }
    
    // Check for existing availability on that day and time
    const existingAvailability = await prisma.availability.findFirst({
      where: {
        doctorId,
        dayOfWeek: Number(dayOfWeek),
        startTime,
        endTime,
      },
    });
    
    if (existingAvailability) {
      // Update existing availability
      const updated = await prisma.availability.update({
        where: { id: existingAvailability.id },
        data: { isAvailable },
      });
      
      return NextResponse.json({
        success: true,
        message: 'Availability updated successfully',
        availability: updated,
      });
    }
    
    // Create new availability
    const availability = await prisma.availability.create({
      data: {
        doctorId,
        dayOfWeek: Number(dayOfWeek),
        startTime,
        endTime,
        isAvailable,
      },
    });
    
    return NextResponse.json({
      success: true,
      message: 'Availability created successfully',
      availability,
    });
  } catch (error) {
    console.error('Error creating availability:', error);
    return NextResponse.json(
      { error: 'Failed to create availability' },
      { status: 500 }
    );
  }
} 