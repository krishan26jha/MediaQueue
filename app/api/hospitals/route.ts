import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// GET hospitals
export async function GET(req: Request) {
  const url = new URL(req.url);
  const hospitalId = url.searchParams.get('hospitalId');
  const includeDepartments = url.searchParams.get('includeDepartments') === 'true';
  const includeDoctors = url.searchParams.get('includeDoctors') === 'true';
  
  try {
    // If hospitalId is provided, return specific hospital
    if (hospitalId) {
      const hospital = await prisma.hospital.findUnique({
        where: { id: hospitalId },
        include: {
          departments: includeDepartments,
          doctors: includeDoctors ? {
            include: {
              user: {
                select: {
                  name: true,
                  email: true,
                  image: true,
                },
              },
              department: true,
            },
          } : false,
        },
      });
      
      if (!hospital) {
        return NextResponse.json(
          { error: 'Hospital not found' },
          { status: 404 }
        );
      }
      
      return NextResponse.json({
        success: true,
        hospital,
      });
    }
    
    // Otherwise return all hospitals
    const hospitals = await prisma.hospital.findMany({
      include: {
        departments: includeDepartments,
        doctors: includeDoctors ? {
          include: {
            user: {
              select: {
                name: true,
                email: true,
                image: true,
              },
            },
            department: true,
          },
        } : false,
      },
    });
    
    return NextResponse.json({
      success: true,
      hospitals,
    });
  } catch (error) {
    console.error('Error fetching hospitals:', error);
    return NextResponse.json(
      { error: 'Failed to fetch hospitals' },
      { status: 500 }
    );
  }
} 