import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';

// GET: Fetch all emergency requests (for nurse dashboard)
export async function GET(request: NextRequest) {
  console.log('Emergency API - GET request received');
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    
    console.log('Emergency API - Checking if EmergencyRequest model exists in prisma schema');
    console.log('Available models in prisma:', Object.keys(prisma));
    
    // First try using the model directly
    try {
      console.log('Emergency API - Attempting to use prisma.emergencyRequest');
      const whereCondition = status && status !== 'ALL' 
        ? { status }
        : undefined;
        
      const emergencyRequests = await prisma.emergencyRequest.findMany({
        where: whereCondition,
        orderBy: {
          createdAt: 'desc'
        }
      });
      
      console.log('Emergency API - Successfully fetched data using model:', emergencyRequests.length);
      return NextResponse.json({
        success: true,
        emergencyRequests,
        count: emergencyRequests.length
      });
    } catch (modelError) {
      console.log('Emergency API - Model-based query failed:', modelError);
      
      // If that fails, try with raw SQL using quoted identifiers
      console.log('Emergency API - Trying raw SQL with quoted identifiers');
      const query = status && status !== 'ALL'
        ? `SELECT * FROM "EmergencyRequest" WHERE "status" = $1 ORDER BY "createdAt" DESC`
        : `SELECT * FROM "EmergencyRequest" ORDER BY "createdAt" DESC`;
        
      const params = status && status !== 'ALL' ? [status] : [];
      
      console.log('Emergency API - Executing raw SQL query:', query);
      const emergencyRequests = await prisma.$queryRawUnsafe(query, ...params);
      
      console.log('Emergency API - Raw query result:', emergencyRequests);
      return NextResponse.json({
        success: true,
        emergencyRequests,
        count: Array.isArray(emergencyRequests) ? emergencyRequests.length : 0
      });
    }
  } catch (error) {
    console.error('Error fetching emergency requests:', error);
    return NextResponse.json(
      { error: 'Failed to fetch emergency requests', details: String(error) },
      { status: 500 }
    );
  }
}

// POST: Create a new emergency request
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      patientName,
      patientPhone,
      patientLocation,
      emergencyType,
      description,
      priorityLevel = 'EMERGENCY'
    } = body;

    // Validate required fields
    if (!patientName || !patientPhone || !patientLocation || !emergencyType) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Try with Prisma model first
    try {
      const emergencyRequest = await prisma.emergencyRequest.create({
        data: {
          patientName,
          patientPhone,
          patientLocation,
          emergencyType,
          description,
          priorityLevel,
          status: 'PENDING'
        }
      });
      
      return NextResponse.json({
        success: true,
        emergencyRequest,
        message: 'Emergency request submitted successfully'
      });
    } catch (modelError) {
      console.log('Model-based creation failed, trying raw SQL:', modelError);
      
      // If that fails, try with raw SQL
      const id = 'emergency_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      const now = new Date();
      
      await prisma.$executeRawUnsafe(`
        INSERT INTO "EmergencyRequest" (
          "id", "patientName", "patientPhone", "patientLocation", "emergencyType", 
          "description", "priorityLevel", "status", "createdAt", "updatedAt"
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      `, id, patientName, patientPhone, patientLocation, emergencyType, 
         description || null, priorityLevel, 'PENDING', now, now);
      
      const emergencyRequest = {
        id,
        patientName,
        patientPhone,
        patientLocation,
        emergencyType,
        description,
        priorityLevel,
        status: 'PENDING',
        createdAt: now,
        updatedAt: now
      };
      
      return NextResponse.json({
        success: true,
        emergencyRequest,
        message: 'Emergency request submitted successfully'
      });
    }
  } catch (error) {
    console.error('Error creating emergency request:', error);
    return NextResponse.json(
      { error: 'Failed to create emergency request', details: String(error) },
      { status: 500 }
    );
  }
}

// PUT: Update emergency request status
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, status, acknowledgedBy } = body;

    if (!id || !status) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Try with Prisma model first
    try {
      const updateData = { status };
      
      if (status === 'ACKNOWLEDGED' && acknowledgedBy) {
        Object.assign(updateData, {
          acknowledgedBy,
          acknowledgedAt: new Date()
        });
      } else if (status === 'RESOLVED') {
        Object.assign(updateData, {
          resolvedAt: new Date()
        });
      }
      
      const updatedRequest = await prisma.emergencyRequest.update({
        where: { id },
        data: updateData
      });
      
      return NextResponse.json({
        success: true,
        emergencyRequest: updatedRequest,
        message: `Emergency request ${status.toLowerCase()}`
      });
    } catch (modelError) {
      console.log('Model-based update failed, trying raw SQL:', modelError);
      
      // If that fails, try with raw SQL
      const now = new Date();
      let query = `UPDATE "EmergencyRequest" SET "status" = $1, "updatedAt" = $2`;
      let params = [status, now];
      let paramIndex = 3;
      
      if (status === 'ACKNOWLEDGED' && acknowledgedBy) {
        query += `, "acknowledgedBy" = $${paramIndex++}, "acknowledgedAt" = $${paramIndex++}`;
        params.push(acknowledgedBy, now);
      } else if (status === 'RESOLVED') {
        query += `, "resolvedAt" = $${paramIndex++}`;
        params.push(now);
      }
      
      query += ` WHERE "id" = $${paramIndex}`;
      params.push(id);
      
      await prisma.$executeRawUnsafe(query, ...params);
      
      // Fetch the updated record
      const results = await prisma.$queryRawUnsafe(`SELECT * FROM "EmergencyRequest" WHERE "id" = $1`, id);
      const updatedRequest = Array.isArray(results) && results.length > 0 ? results[0] : null;
      
      return NextResponse.json({
        success: true,
        emergencyRequest: updatedRequest,
        message: `Emergency request ${status.toLowerCase()}`
      });
    }
  } catch (error) {
    console.error('Error updating emergency request:', error);
    return NextResponse.json(
      { error: 'Failed to update emergency request', details: String(error) },
      { status: 500 }
    );
  }
}
