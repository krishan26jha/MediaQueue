'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50 pt-8">
      {/* Hero Section with Background */}
      <div className="relative bg-gradient-to-r from-blue-600 to-indigo-700 py-16">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl font-bold text-white sm:text-5xl md:text-6xl mb-6">
              About <span className="text-blue-200">MediQueue</span>
            </h1>
            <p className="max-w-3xl mx-auto text-xl text-blue-100 mb-8">
              Revolutionizing healthcare queue management with intelligent technology
            </p>
          </motion.div>
        </div>
        {/* Wave Shape Divider */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-16 text-gray-50">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" fill="currentColor"></path>
          </svg>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Mission and Vision */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-xl shadow-md p-8"
          >
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-blue-600">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Our Mission</h2>
            <p className="text-gray-600">
              At MediQueue, we're committed to transforming the healthcare experience by eliminating long wait times
              and streamlining patient flow. Our innovative queue management system combines cutting-edge technology
              with intuitive design to create a more efficient and pleasant healthcare environment for both patients
              and medical professionals.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white rounded-xl shadow-md p-8"
          >
            <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-indigo-600">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Our Vision</h2>
            <p className="text-gray-600">
              We envision a future where waiting rooms are stress-free zones, where patients receive timely care,
              and where healthcare providers can focus on what matters most - providing excellent medical care.
              Through continuous innovation and dedication to service, we're making this vision a reality.
            </p>
          </motion.div>
        </div>

        {/* Key Features Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-lg shadow-lg p-6 mb-12"
        >
          <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">Our Innovative Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-blue-50 rounded-lg p-6 transform transition duration-300 hover:scale-105">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-blue-600">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                </svg>
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">Smart Queue Management</h3>
              <p className="text-gray-600">
                AI-powered system that optimizes patient flow and reduces wait times by up to 40%
              </p>
            </div>
            <div className="bg-indigo-50 rounded-lg p-6 transform transition duration-300 hover:scale-105">
              <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-indigo-600">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
                </svg>
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">Real-time Updates</h3>
              <p className="text-gray-600">
                Keep patients informed with accurate wait time estimates and mobile notifications
              </p>
            </div>
            <div className="bg-purple-50 rounded-lg p-6 transform transition duration-300 hover:scale-105">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-purple-600">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
                </svg>
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">Analytics Dashboard</h3>
              <p className="text-gray-600">
                Comprehensive insights for healthcare providers to improve service efficiency
              </p>
            </div>
          </div>
        </motion.div>

        {/* Team Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-3 text-center">Our Leadership Team</h2>
          <p className="text-lg text-gray-600 mb-10 text-center max-w-3xl mx-auto">
            Meet the talented individuals who are revolutionizing healthcare queue management
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-md overflow-hidden transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
              >
                <div className="h-60 w-full relative bg-gray-100">
                  <Image 
                    src={member.imagePath}
                    alt={member.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover object-center"
                    priority
                    quality={90}
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-medium text-gray-900">{member.name}</h3>
                  <p className="text-blue-600 mb-3">{member.role}</p>
                  <p className="text-gray-600">{member.bio}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-8 text-center"
        >
          <h2 className="text-2xl font-semibold text-white mb-6">Join Us in Transforming Healthcare</h2>
          <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
            Whether you're a healthcare provider looking to improve patient experience or a patient seeking
            better healthcare service, MediQueue is here to help.
          </p>
          <Link 
            href="/contact" 
            className="inline-block bg-white text-blue-600 font-semibold px-8 py-3 rounded-lg shadow-md hover:bg-blue-50 transition-colors"
          >
            Contact Us Today
          </Link>
        </motion.div>
      </div>
    </div>
  );
}

// Team members data
const teamMembers = [
  {
    name: 'Dr. Kavya Sharma',
    role: 'Founder & CEO',
    bio: 'Former Chief of Medicine with 15+ years of experience who founded MediQueue to solve patient wait time challenges. Dr. Sharma combines medical expertise with innovative thinking to transform healthcare delivery.',
    imagePath: '/images/kavya.jpg',
  },
  {
    name: 'Arjun Patel',
    role: 'CTO',
    bio: 'AI and machine learning expert with a passion for applying technology to solve healthcare challenges. Arjun has led the development of our predictive algorithms that have reduced patient wait times by 40%.',
    imagePath: '/images/arjun.jpg',
  },
  {
    name: 'Dr. Vikram Singh',
    role: 'Medical Director',
    bio: 'Board-certified physician who ensures our solutions meet real clinical needs and improve patient outcomes. Dr. Singh bridges the gap between clinical practice and technological innovation.',
    imagePath: '/images/vikram.jpg',
  },
];

// Timeline data - removed as we're not using it in this updated design
const timeline = [
  {
    year: '2020',
    title: 'Foundation',
    description: 'MediQueue was founded in response to the healthcare challenges highlighted by the global pandemic.',
  },
  {
    year: '2021',
    title: 'First Hospital Partnership',
    description: 'Successfully implemented our queue management system at General Hospital, reducing wait times by 35%.',
  },
  {
    year: '2022',
    title: 'AI Enhancement',
    description: 'Launched predictive analytics features to forecast patient volume and optimize staffing.',
  },
  {
    year: '2023',
    title: 'Global Expansion',
    description: 'Expanded to 250+ hospitals across 15 countries, becoming a leader in healthcare queue management solutions.',
  },
]; 