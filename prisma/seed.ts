import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting database seeding...');
  
  // Check if data already exists to avoid deleting manually registered users
  const existingUsers = await prisma.user.count();
  const existingPatients = await prisma.patient.count();
  
  if (existingUsers > 0 || existingPatients > 0) {
    console.log(`Database already has ${existingUsers} users and ${existingPatients} patients.`);
    console.log('Skipping cleanup to preserve existing data.');
    console.log('If you want to reset the database, please run: npx prisma migrate reset');
    return;
  }
  
  console.log('Database is empty, proceeding with seeding...');
  
  // Clean up existing data (only if database is empty)
  await prisma.notification.deleteMany();
  await prisma.queueEntry.deleteMany();
  await prisma.feedback.deleteMany();
  await prisma.appointment.deleteMany();
  await prisma.availability.deleteMany();
  await prisma.doctor.deleteMany();
  await prisma.patient.deleteMany();
  await prisma.department.deleteMany();
  await prisma.hospital.deleteMany();
  await prisma.user.deleteMany();
  
  // Create hospital
  const hospital = await prisma.hospital.create({
    data: {
      name: 'AIIMS General Hospital',
      address: '123 Medical Center Drive',
      city: 'New Delhi',
      state: 'Delhi',
      zipCode: '110029',
      country: 'India',
      phone: '+91 11 2658 8500',
      email: 'info@generalhospital.com',
      website: 'https://generalhospital.com',
      capacity: 500,
      currentLoad: 320,
    }
  });
  
  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 10);
  const adminUser = await prisma.user.create({
    data: {
      name: 'Raj Kumar',
      email: 'admin@example.com',
      password: adminPassword,
      role: 'ADMIN',
    }
  });
  
  // Create departments
  const departments = await Promise.all([
    prisma.department.create({
      data: {
        name: 'General Medicine',
        hospitalId: hospital.id,
        description: 'Primary care and general health concerns',
      }
    }),
    prisma.department.create({
      data: {
        name: 'Cardiology',
        hospitalId: hospital.id,
        description: 'Heart and cardiovascular health',
      }
    }),
    prisma.department.create({
      data: {
        name: 'Orthopedics',
        hospitalId: hospital.id,
        description: 'Bone, joint, and musculoskeletal issues',
      }
    }),
    prisma.department.create({
      data: {
        name: 'Pediatrics',
        hospitalId: hospital.id,
        description: 'Health care for children and adolescents',
      }
    }),
    prisma.department.create({
      data: {
        name: 'Emergency',
        hospitalId: hospital.id,
        description: 'Urgent and emergency care',
      }
    }),
  ]);
  
  // Create doctor users
  const doctorUsers = await Promise.all([
    prisma.user.create({
      data: {
        name: 'Dr. Vikram Patel',
        email: 'dr.patel@example.com',
        password: await bcrypt.hash('doctor123', 10),
        role: 'DOCTOR',
      }
    }),
    prisma.user.create({
      data: {
        name: 'Dr. Kavya Sharma',
        email: 'dr.sharma@example.com',
        password: await bcrypt.hash('doctor123', 10),
        role: 'DOCTOR',
      }
    }),
    prisma.user.create({
      data: {
        name: 'Dr. Arjun Singh',
        email: 'dr.singh@example.com',
        password: await bcrypt.hash('doctor123', 10),
        role: 'DOCTOR',
      }
    }),
  ]);
  
  // Create doctors
  const doctors = await Promise.all([
    prisma.doctor.create({
      data: {
        userId: doctorUsers[0].id,
        specialization: 'General Medicine',
        hospitalId: hospital.id,
        departmentId: departments[0].id,
        experience: 10,
      }
    }),
    prisma.doctor.create({
      data: {
        userId: doctorUsers[1].id,
        specialization: 'Cardiology',
        hospitalId: hospital.id,
        departmentId: departments[1].id,
        experience: 15,
      }
    }),
    prisma.doctor.create({
      data: {
        userId: doctorUsers[2].id,
        specialization: 'Orthopedics',
        hospitalId: hospital.id,
        departmentId: departments[2].id,
        experience: 8,
      }
    }),
  ]);
  
  // Create patient users
  const patientUsers = await Promise.all([
    prisma.user.create({
      data: {
        name: 'Arjun Sharma',
        email: 'arjun.sharma@example.com',
        password: await bcrypt.hash('patient123', 10),
        role: 'PATIENT',
      }
    }),
    prisma.user.create({
      data: {
        name: 'Neha Agarwal',
        email: 'neha.agarwal@example.com',
        password: await bcrypt.hash('patient123', 10),
        role: 'PATIENT',
      }
    }),
    prisma.user.create({
      data: {
        name: 'Vikram Patel',
        email: 'vikram.patel@example.com',
        password: await bcrypt.hash('patient123', 10),
        role: 'PATIENT',
      }
    }),
    prisma.user.create({
      data: {
        name: 'Priya Kapoor',
        email: 'priya.kapoor@example.com',
        password: await bcrypt.hash('patient123', 10),
        role: 'PATIENT',
      }
    }),
    prisma.user.create({
      data: {
        name: 'Rohit Jain',
        email: 'rohit.jain@example.com',
        password: await bcrypt.hash('patient123', 10),
        role: 'PATIENT',
      }
    }),
  ]);
  
  // Create patients
  const patients = await Promise.all([
    prisma.patient.create({
      data: {
        userId: patientUsers[0].id,
        medicalHistory: 'Hypertension, Type 2 Diabetes',
        allergies: 'Penicillin',
        emergencyContact: 'Kavya Sharma, +91 98987 65432',
        preferredHospitalId: hospital.id,
      }
    }),
    prisma.patient.create({
      data: {
        userId: patientUsers[1].id,
        medicalHistory: 'Asthma',
        allergies: 'Pollen, Dust',
        emergencyContact: 'Arjun Patel, +91 99087 65432',
        preferredHospitalId: hospital.id,
      }
    }),
    prisma.patient.create({
      data: {
        userId: patientUsers[2].id,
        medicalHistory: 'None',
        allergies: 'None',
        emergencyContact: 'Priya Mehta, +91 99176 54321',
        preferredHospitalId: hospital.id,
      }
    }),
    prisma.patient.create({
      data: {
        userId: patientUsers[3].id,
        medicalHistory: 'Migraines',
        allergies: 'Shellfish',
        emergencyContact: 'Rajesh Kumar, +91 99265 43210',
        preferredHospitalId: hospital.id,
      }
    }),
    prisma.patient.create({
      data: {
        userId: patientUsers[4].id,
        medicalHistory: 'Broken arm (2022)',
        allergies: 'None',
        emergencyContact: 'Sneha Gupta, +91 99354 32109',
        preferredHospitalId: hospital.id,
      }
    }),
  ]);
  
  // Create queue entries
  const queueEntries = await Promise.all([
    prisma.queueEntry.create({
      data: {
        patientId: patients[0].id,
        hospitalId: hospital.id,
        doctorId: doctors[0].id,
        queuePosition: 1,
        estimatedWaitTime: 10,
        status: 'WAITING',
        priority: 7,
        symptoms: 'Chest pain and shortness of breath',
        urgency: 'HIGH',
      }
    }),
    prisma.queueEntry.create({
      data: {
        patientId: patients[1].id,
        hospitalId: hospital.id,
        doctorId: doctors[0].id,
        queuePosition: 2,
        estimatedWaitTime: 25,
        status: 'WAITING',
        priority: 5,
        symptoms: 'Migraine headache',
        urgency: 'NORMAL',
      }
    }),
    prisma.queueEntry.create({
      data: {
        patientId: patients[2].id,
        hospitalId: hospital.id,
        doctorId: doctors[1].id,
        queuePosition: 1,
        estimatedWaitTime: 15,
        status: 'WAITING',
        priority: 4,
        symptoms: 'Follow-up appointment for hypertension',
        urgency: 'LOW',
      }
    }),
    prisma.queueEntry.create({
      data: {
        patientId: patients[3].id,
        hospitalId: hospital.id,
        doctorId: doctors[0].id,
        queuePosition: 3,
        estimatedWaitTime: 40,
        status: 'WAITING',
        priority: 5,
        symptoms: 'Persistent cough for 2 weeks',
        urgency: 'NORMAL',
      }
    }),
    prisma.queueEntry.create({
      data: {
        patientId: patients[4].id,
        hospitalId: hospital.id,
        doctorId: doctors[2].id,
        queuePosition: 1,
        estimatedWaitTime: 20,
        status: 'WAITING',
        priority: 5,
        symptoms: 'Wrist pain after fall',
        urgency: 'NORMAL',
      }
    }),
  ]);
  
  // Create notifications
  await Promise.all([
    prisma.notification.create({
      data: {
        userId: patientUsers[0].id,
        title: 'Queue Update',
        message: 'John, you are now next in line. Please proceed to the waiting area.',
        isRead: false,
        type: 'QUEUE_UPDATE',
      }
    }),
    prisma.notification.create({
      data: {
        userId: patientUsers[1].id,
        title: 'Queue Update',
        message: 'Emily, your queue position has been updated to #2. Estimated wait time is 25 minutes.',
        isRead: false,
        type: 'QUEUE_UPDATE',
      }
    }),
    prisma.notification.create({
      data: {
        userId: adminUser.id,
        title: 'System Notification',
        message: 'Database successfully seeded with test data.',
        isRead: false,
        type: 'INFO',
      }
    }),
  ]);
  
  console.log('Database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('Error during database seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 