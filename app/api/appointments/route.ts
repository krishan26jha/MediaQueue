import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { UrgencyLevel } from '@/lib/types';
import { verifyAuthToken } from '@/lib/auth';

// Utility function to find an available doctor
async function findAvailableDoctor(
  departmentId: string, 
  hospitalId: string, 
  appointmentDate: Date, 
  startTime: Date, 
  endTime: Date
) {
  // 1. Find all doctors in the specified department and hospital
  const departmentDoctors = await prisma.doctor.findMany({
    where: {
      departmentId,
      hospitalId,
      active: true,
    },
    include: {
      user: {
        select: {
          name: true,
        },
      },
      hospital: {
        select: {
          name: true,
        },
      },
    },
  });
  
  if (departmentDoctors.length === 0) {
    return null;
  }
  
  // 2. For each doctor, check if they have overlapping appointments
  for (const doctor of departmentDoctors) {
    const overlappingAppointments = await prisma.appointment.findFirst({
      where: {
        doctorId: doctor.id,
        OR: [
          {
            // Starts during another appointment
            startTime: {
              lte: endTime.toISOString(),
            },
            endTime: {
              gt: startTime.toISOString(),
            },
          },
          {
            // Ends during another appointment
            startTime: {
              lt: endTime.toISOString(),
            },
            endTime: {
              gte: startTime.toISOString(),
            },
          },
        ],
        status: {
          not: 'CANCELLED',
        },
      },
    });
    
    // If no overlapping appointments, this doctor is available
    if (!overlappingAppointments) {
      return doctor;
    }
  }
  
  // If no available doctor found
  return null;
}

// GET appointments
export async function GET(req: Request) {
  // Verify authentication
  const authHeader = req.headers.get('authorization');
  const authResult = await verifyAuthToken(authHeader);
  
  if (!authResult.success) {
    return NextResponse.json(
      { error: 'Unauthorized access' },
      { status: 401 }
    );
  }
  
  const url = new URL(req.url);
  const appointmentId = url.searchParams.get('appointmentId');
  const patientIdParam = url.searchParams.get('patientId');
  const doctorId = url.searchParams.get('doctorId');
  const hospitalId = url.searchParams.get('hospitalId');
  const departmentId = url.searchParams.get('departmentId');
  const date = url.searchParams.get('date');
  const status = url.searchParams.get('status');
  
  // If user is a patient, they should only see their own appointments
  let patientId = patientIdParam;
  
  if (authResult.user && authResult.user.role === 'PATIENT' && !patientId) {
    const patient = await prisma.patient.findFirst({
      where: { userId: authResult.user.userId },
    });
    
    if (!patient) {
      return NextResponse.json(
        { error: 'Patient record not found' },
        { status: 404 }
      );
    }
    
    if (appointmentId) {
      // Verify the appointment belongs to this patient
      const appointmentCheck = await prisma.appointment.findUnique({
        where: { id: appointmentId },
      });
      
      if (!appointmentCheck || appointmentCheck.patientId !== patient.id) {
        return NextResponse.json(
          { error: 'Appointment not found or access denied' },
          { status: 403 }
        );
      }
    } else {
      // Force patientId filter for patients viewing appointments
      patientId = patient.id;
    }
  }
  
  try {
    const query: any = {};
    
    if (appointmentId) {
      query.id = appointmentId;
    }
    
    if (patientId) {
      query.patientId = patientId;
    }
    
    if (doctorId) {
      query.doctorId = doctorId;
    }
    
    if (hospitalId) {
      query.doctor = {
        hospitalId
      };
    }
    
    if (departmentId) {
      query.doctor = {
        ...(query.doctor || {}),
        departmentId
      };
    }
    
    if (date) {
      const startDate = new Date(date);
      startDate.setHours(0, 0, 0, 0);
      
      const endDate = new Date(date);
      endDate.setHours(23, 59, 59, 999);
      
      query.appointmentDate = {
        gte: startDate,
        lte: endDate
      };
    }
    
    if (status) {
      query.status = status;
    }
    
    // If appointmentId is provided, return a specific appointment
    if (appointmentId) {
      const appointment = await prisma.appointment.findUnique({
        where: { id: appointmentId },
        include: {
          patient: {
            include: {
              user: {
                select: {
                  name: true,
                  email: true,
                  phone: true,
                }
              }
            }
          },
          doctor: {
            include: {
              user: {
                select: {
                  name: true,
                  email: true,
                }
              },
              department: true,
              hospital: {
                select: {
                  name: true,
                }
              }
            }
          }
        }
      });
      
      if (!appointment) {
        return NextResponse.json(
          { error: 'Appointment not found' },
          { status: 404 }
        );
      }
      
      return NextResponse.json({
        success: true,
        appointment,
      });
    }
    
    // Otherwise, return appointments matching the query
    const appointments = await prisma.appointment.findMany({
      where: query,
      include: {
        patient: {
          include: {
            user: {
              select: {
                name: true,
                email: true,
                phone: true,
              }
            }
          }
        },
        doctor: {
          include: {
            user: {
              select: {
                name: true,
                email: true,
              }
            },
            department: true,
            hospital: {
              select: {
                name: true,
              }
            }
          }
        }
      },
      orderBy: {
        startTime: 'asc',
      }
    });
    
    return NextResponse.json({
      success: true,
      appointments,
    });
  } catch (error) {
    console.error('Error fetching appointments:', error);
    return NextResponse.json(
      { error: 'Failed to fetch appointments' },
      { status: 500 }
    );
  }
}

// POST to create a new appointment
export async function POST(req: Request) {
  // Verify authentication
  const authHeader = req.headers.get('authorization');
  const authResult = await verifyAuthToken(authHeader);
  
  if (!authResult.success || !authResult.user) {
    return NextResponse.json(
      { error: 'Unauthorized access' },
      { status: 401 }
    );
  }
  
  // Only patients and staff can create appointments
  if (authResult.user.role !== 'PATIENT' && authResult.user.role !== 'STAFF') {
    return NextResponse.json(
      { error: 'You do not have permission to create appointments' },
      { status: 403 }
    );
  }
  
  try {
    const data = await req.json();
    let {
      patientId,
      doctorId,
      hospitalId,
      departmentId,
      departmentName,
      appointmentDate,
      startTime,
      endTime,
      reasonForVisit,
      urgencyLevel = UrgencyLevel.NORMAL,
      notes,
    } = data;
    
    // If the user is a patient, set patientId based on their user account
    if (authResult.user.role === 'PATIENT' && !patientId) {
      const patient = await prisma.patient.findFirst({
        where: { userId: authResult.user.userId },
      });
      
      if (!patient) {
        return NextResponse.json(
          { error: 'Patient record not found for your account' },
          { status: 404 }
        );
      }
      
      patientId = patient.id;
    }

    // If no hospitalId provided, get the first hospital (default)
    if (!hospitalId) {
      const defaultHospital = await prisma.hospital.findFirst();
      if (!defaultHospital) {
        return NextResponse.json(
          { error: 'No hospitals available' },
          { status: 404 }
        );
      }
      hospitalId = defaultHospital.id;
    }

    // If departmentName is provided instead of departmentId, look up the department
    if (departmentName && !departmentId) {
      const department = await prisma.department.findFirst({
        where: {
          name: departmentName,
          hospitalId: hospitalId
        }
      });
      
      if (!department) {
        return NextResponse.json(
          { error: `Department '${departmentName}' not found in the selected hospital` },
          { status: 404 }
        );
      }
      
      departmentId = department.id;
    }
    
    // Validate required fields
    if (!patientId || !appointmentDate || !startTime || !endTime || !reasonForVisit) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Requires either a specific doctor OR a department+hospital combination
    if (!doctorId && (!departmentId || !hospitalId)) {
      return NextResponse.json(
        { error: 'Either a doctor or a department and hospital must be specified' },
        { status: 400 }
      );
    }
    
    // Validate patient exists
    const patient = await prisma.patient.findUnique({
      where: { id: patientId },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          }
        }
      }
    });
    
    if (!patient) {
      return NextResponse.json(
        { error: 'Patient not found' },
        { status: 404 }
      );
    }
    
    // Parse date and times
    const apptDate = new Date(appointmentDate);
    
    let startDateTime, endDateTime;
    
    // Handle time ranges from the form
    if (typeof startTime === 'string' && startTime.includes('(')) {
      // Time range format like "Morning (9:00 AM - 12:00 PM)"
      if (startTime.includes('Morning')) {
        startDateTime = new Date(apptDate);
        startDateTime.setHours(9, 0, 0, 0);
        endDateTime = new Date(apptDate);
        endDateTime.setHours(10, 0, 0, 0); // 1 hour appointment
      } else if (startTime.includes('Afternoon')) {
        startDateTime = new Date(apptDate);
        startDateTime.setHours(12, 0, 0, 0);
        endDateTime = new Date(apptDate);
        endDateTime.setHours(13, 0, 0, 0);
      } else if (startTime.includes('Evening')) {
        startDateTime = new Date(apptDate);
        startDateTime.setHours(15, 0, 0, 0);
        endDateTime = new Date(apptDate);
        endDateTime.setHours(16, 0, 0, 0);
      } else {
        return NextResponse.json(
          { error: 'Invalid time slot selected' },
          { status: 400 }
        );
      }
    } else {
      // Standard time format
      const [startHour, startMinute] = startTime.split(':').map(Number);
      const [endHour, endMinute] = endTime.split(':').map(Number);
      
      // Set start and end times
      startDateTime = new Date(apptDate);
      startDateTime.setHours(startHour, startMinute, 0, 0);
      
      endDateTime = new Date(apptDate);
      endDateTime.setHours(endHour, endMinute, 0, 0);
    }
    
    // Check if the requested time is in the future
    if (startDateTime < new Date()) {
      return NextResponse.json(
        { error: 'Appointment time must be in the future' },
        { status: 400 }
      );
    }
    
    // If doctorId is not provided, auto-assign a doctor based on availability
    let doctor;
    
    if (!doctorId) {
      // Find an available doctor in the specified department and hospital
      doctor = await findAvailableDoctor(departmentId, hospitalId, apptDate, startDateTime, endDateTime);
      
      if (!doctor) {
        return NextResponse.json(
          { error: 'No available doctors found for the selected time slot. Please choose a different time.' },
          { status: 400 }
        );
      }
      
      doctorId = doctor.id;
    } else {
      // Validate doctor exists
      doctor = await prisma.doctor.findUnique({
        where: { id: doctorId },
        include: {
          user: {
            select: {
              name: true,
            }
          },
          department: true,
          hospital: true,
        }
      });
      
      if (!doctor) {
        return NextResponse.json(
          { error: 'Doctor not found' },
          { status: 404 }
        );
      }
      
      // Check for doctor availability
      const overlappingAppointment = await prisma.appointment.findFirst({
        where: {
          doctorId,
          OR: [
            {
              // Starts during another appointment
              startTime: {
                lte: endDateTime.toISOString(),
              },
              endTime: {
                gt: startDateTime.toISOString(),
              },
            },
            {
              // Ends during another appointment
              startTime: {
                lt: endDateTime.toISOString(),
              },
              endTime: {
                gte: startDateTime.toISOString(),
              },
            },
          ],
          status: {
            not: 'CANCELLED',
          },
        },
      });
      
      if (overlappingAppointment) {
        return NextResponse.json(
          { error: 'The selected doctor is not available at the specified time' },
          { status: 400 }
        );
      }
    }
    
    // Create the appointment
    const appointment = await prisma.appointment.create({
      data: {
        appointmentDate: apptDate,
        startTime: startDateTime.toISOString(),
        endTime: endDateTime.toISOString(),
        reasonForVisit,
        urgencyLevel,
        notes: notes || undefined,
        status: 'REQUESTED',
        patient: {
          connect: { id: patientId },
        },
        doctor: {
          connect: { id: doctorId },
        },
        hospital: {
          connect: { id: hospitalId }, // ✅ make sure you have hospitalId
        },
        department: {
          connect: { id: departmentId }, // ✅ make sure you have departmentId
        },
        user: {
          connect: { id: authResult.user.userId },
        },
      },
      include: {
        patient: {
          include: {
            user: {
              select: {
                name: true,
                email: true,
              },
            },
          },
        },
        doctor: {
          include: {
            user: {
              select: {
                name: true,
              },
            },
            department: true,
            hospital: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });

    
    // Create notification for patient
    await prisma.notification.create({
      data: {
        userId: patient.userId,
        title: 'Appointment Requested',
        message: `Your appointment request with Dr. ${doctor.user.name} at ${doctor.hospital.name} for ${apptDate.toLocaleDateString()} at ${startTime} has been submitted and is pending approval.`,
        type: 'APPOINTMENT',
        isRead: false,
      }
    });
    
    // Find staff members at the hospital to notify them about the appointment request
    const staffMembers = await prisma.staff.findMany({
      where: {
        hospitalId: doctor.hospitalId,
        active: true,
      },
      include: {
        user: {
          select: {
            id: true,
          }
        }
      }
    });
    
    // Create notifications for all active staff members
    for (const staff of staffMembers) {
      await prisma.notification.create({
        data: {
          userId: staff.user.id,
          title: 'New Appointment Request',
          message: `New appointment request for patient ${patient.user.name} with Dr. ${doctor.user.name} on ${apptDate.toLocaleDateString()} at ${startTime}. Please review and confirm.`,
          type: 'APPOINTMENT_REQUEST',
          isRead: false,
        }
      });
    }
    
    // Return success response
    return NextResponse.json({
      success: true,
      appointment,
      message: 'Appointment request submitted successfully and awaiting confirmation.',
    });
  } catch (error) {
    console.error('Error creating appointment:', error);
    return NextResponse.json(
      { error: 'Failed to create appointment' },
      { status: 500 }
    );
  }
}

// PATCH to update an appointment
export async function PATCH(req: Request) {
  // Verify authentication
  const authHeader = req.headers.get('authorization');
  const authResult = await verifyAuthToken(authHeader);
  
  if (!authResult.success || !authResult.user) {
    return NextResponse.json(
      { error: 'Unauthorized access' },
      { status: 401 }
    );
  }
  
  try {
    const data = await req.json();
    const {
      appointmentId,
      appointmentDate,
      startTime,
      endTime,
      reasonForVisit,
      urgencyLevel,
      notes,
      status,
    } = data;
    
    if (!appointmentId) {
      return NextResponse.json(
        { error: 'Appointment ID is required' },
        { status: 400 }
      );
    }
    
    // Check if the appointment exists
    const existingAppointment = await prisma.appointment.findUnique({
      where: { id: appointmentId },
      include: {
        patient: {
          include: {
            user: true
          }
        },
        doctor: {
          include: {
            user: true,
            hospital: true,
          }
        }
      }
    });
    
    if (!existingAppointment) {
      return NextResponse.json(
        { error: 'Appointment not found' },
        { status: 404 }
      );
    }
    
    // Authorization check based on user role
    if (authResult.user.role === 'PATIENT') {
      // Patients can only update their own appointments and can't change status
      const patient = await prisma.patient.findFirst({
        where: { userId: authResult.user.userId },
      });
      
      if (!patient || patient.id !== existingAppointment.patientId) {
        return NextResponse.json(
          { error: 'You do not have permission to update this appointment' },
          { status: 403 }
        );
      }
      
      // Patients can't change appointment status
      if (status) {
        return NextResponse.json(
          { error: 'Patients cannot change appointment status' },
          { status: 403 }
        );
      }
    } else if (authResult.user.role === 'DOCTOR') {
      // Doctors can only update their own appointments
      const doctor = await prisma.doctor.findFirst({
        where: { userId: authResult.user.userId },
      });
      
      if (!doctor || doctor.id !== existingAppointment.doctorId) {
        return NextResponse.json(
          { error: 'You do not have permission to update this appointment' },
          { status: 403 }
        );
      }
    }
    // Staff and admin can update any appointment
    
    // Prepare update data
    const updateData: any = {};
    
    if (appointmentDate) {
      updateData.appointmentDate = new Date(appointmentDate);
    }
    
    if (startTime && appointmentDate) {
      const apptDate = new Date(appointmentDate);
      const [startHour, startMinute] = startTime.split(':').map(Number);
      
      const startDateTime = new Date(apptDate);
      startDateTime.setHours(startHour, startMinute, 0, 0);
      updateData.startTime = startDateTime;
    } else if (startTime) {
      const [startHour, startMinute] = startTime.split(':').map(Number);
      
      const startDateTime = new Date(existingAppointment.appointmentDate);
      startDateTime.setHours(startHour, startMinute, 0, 0);
      updateData.startTime = startDateTime;
    }
    
    if (endTime && appointmentDate) {
      const apptDate = new Date(appointmentDate);
      const [endHour, endMinute] = endTime.split(':').map(Number);
      
      const endDateTime = new Date(apptDate);
      endDateTime.setHours(endHour, endMinute, 0, 0);
      updateData.endTime = endDateTime;
    } else if (endTime) {
      const [endHour, endMinute] = endTime.split(':').map(Number);
      
      const endDateTime = new Date(existingAppointment.appointmentDate);
      endDateTime.setHours(endHour, endMinute, 0, 0);
      updateData.endTime = endDateTime;
    }
    
    if (reasonForVisit) {
      updateData.reasonForVisit = reasonForVisit;
    }
    
    if (urgencyLevel) {
      updateData.urgencyLevel = urgencyLevel;
    }
    
    if (notes !== undefined) {
      updateData.notes = notes;
    }
    
    if (status) {
      updateData.status = status;
      
      // Create notification for status change
      if (status !== existingAppointment.status) {
        let notificationMessage = '';
        let notificationType = 'APPOINTMENT';
        
        switch(status) {
          case 'CONFIRMED':
            notificationMessage = `Your appointment with Dr. ${existingAppointment.doctor.user.name} on ${existingAppointment.appointmentDate.toLocaleDateString()} at ${existingAppointment.startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} has been confirmed.`;
            break;
          case 'CANCELLED':
            notificationMessage = `Your appointment with Dr. ${existingAppointment.doctor.user.name} on ${existingAppointment.appointmentDate.toLocaleDateString()} has been cancelled.`;
            break;
          case 'RESCHEDULED':
            notificationMessage = `Your appointment with Dr. ${existingAppointment.doctor.user.name} has been rescheduled. Please check the updated details.`;
            break;
          case 'COMPLETED':
            notificationMessage = `Your appointment with Dr. ${existingAppointment.doctor.user.name} has been marked as completed.`;
            break;
          default:
            notificationMessage = `The status of your appointment with Dr. ${existingAppointment.doctor.user.name} has been updated to ${status}.`;
        }
        
        if (notificationMessage) {
          await prisma.notification.create({
            data: {
              userId: existingAppointment.patient.userId,
              title: `Appointment ${status.toLowerCase()}`,
              message: notificationMessage,
              type: notificationType,
              isRead: false,
            }
          });
        }
        
        // If appointment is confirmed, also notify the doctor
        if (status === 'CONFIRMED') {
          await prisma.notification.create({
            data: {
              userId: existingAppointment.doctor.user.id,
              title: 'New Appointment Confirmed',
              message: `You have a new confirmed appointment with ${existingAppointment.patient.user.name} on ${existingAppointment.appointmentDate.toLocaleDateString()} at ${existingAppointment.startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}.`,
              type: 'APPOINTMENT',
              isRead: false,
            }
          });
        }
      }
    }
    
    // Check for doctor availability if time is being updated
    if ((updateData.startTime || updateData.endTime) && status !== 'CANCELLED') {
      const startTimeToCheck = updateData.startTime || existingAppointment.startTime;
      const endTimeToCheck = updateData.endTime || existingAppointment.endTime;
      
      const overlappingAppointment = await prisma.appointment.findFirst({
        where: {
          doctorId: existingAppointment.doctorId,
          id: { not: appointmentId }, // exclude current appointment
          OR: [
            {
              startTime: {
                lte: endTimeToCheck,
              },
              endTime: {
                gt: startTimeToCheck,
              },
            },
            {
              startTime: {
                lt: endTimeToCheck,
              },
              endTime: {
                gte: startTimeToCheck,
              },
            },
          ],
          status: {
            not: 'CANCELLED',
          },
        },
      });
      
      if (overlappingAppointment) {
        return NextResponse.json(
          { error: 'The doctor is not available at the selected time' },
          { status: 400 }
        );
      }
    }
    
    // Update the appointment
    const updatedAppointment = await prisma.appointment.update({
      where: { id: appointmentId },
      data: updateData,
      include: {
        patient: {
          include: {
            user: {
              select: {
                name: true,
                email: true,
              }
            }
          }
        },
        doctor: {
          include: {
            user: {
              select: {
                name: true,
              }
            },
            department: true,
            hospital: true,
          }
        }
      }
    });
    
    return NextResponse.json({
      success: true,
      appointment: updatedAppointment,
    });
  } catch (error) {
    console.error('Error updating appointment:', error);
    return NextResponse.json(
      { error: 'Failed to update appointment' },
      { status: 500 }
    );
  }
} 
