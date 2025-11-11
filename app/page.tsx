'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

// Testimonial interface
interface Testimonial {
  id: number;
  name: string;
  role: string;
  content: string;
  rating: number;
  image: string;
}

// Dummy testimonials data
const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Ananya Sharma",
    role: "Patient",
    content: "MediQueue transformed my healthcare experience! I was able to check in remotely and the wait time estimates were accurate. So convenient!",
    rating: 5,
    image: "/images/testimonials/avatar1.png",
  },
  {
    id: 2,
    name: "Rajesh Patel",
    role: "Regular Visitor",
    content: "Being able to see actual wait times helps me plan my hospital visits. The staff is always prepared when I arrive since I checked in through the app.",
    rating: 4,
    image: "/images/testimonials/avatar2.png",
  },
  {
    id: 3,
    name: "Priya Malhotra",
    role: "Parent",
    content: "As a mother of two, this app has been a lifesaver. No more sitting in waiting rooms with restless children. We just show up when it's our turn!",
    rating: 5,
    image: "/images/testimonials/avatar3.png",
  },
  {
    id: 4,
    name: "Suresh Iyer",
    role: "Senior Citizen",
    content: "Even at my age of 72, I found the app easy to use. The notifications are helpful and keep me informed about when to arrive at the hospital.",
    rating: 5,
    image: "/images/testimonials/avatar4.png",
  },
  {
    id: 5,
    name: "Divya Reddy",
    role: "Chronic Condition Patient",
    content: "For someone who visits AIIMS regularly, MediQueue has reduced my waiting time by at least 50%. Great service for busy professionals!",
    rating: 4,
    image: "/images/testimonials/avatar5.png",
  },
];

export default function HomePage() {
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Render stars based on rating
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <svg
        key={i}
        className={`h-5 w-5 ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ));
  };

  return (
    <main className="w-full overflow-x-hidden">
      {/* Hero Section */}
      <section className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-2 sm:py-6 lg:py-20 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center">
            <div className="lg:w-1/2 lg:pr-12 mb-3 sm:mb-4 lg:mb-0">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                Care Begins <br />
                <span className="text-blue-200">Before You Arrive</span>
              </h1>
              <p className="mt-2 sm:mt-3 lg:mt-6 text-lg sm:text-xl lg:text-xl text-blue-100 leading-relaxed">
                MediQueue brings the human touch back to healthcare. We transform stressful waits into
                respectful experiences with real-time updates and personalized care.
              </p>
              <div className="mt-3 sm:mt-4 lg:mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4">
                <Link 
                  href="/register" 
                  className="px-6 py-3 sm:px-8 sm:py-4 bg-white text-blue-700 rounded-lg font-medium shadow-lg hover:bg-blue-50 transition duration-300 text-center text-lg sm:text-lg"
                >
                  Register Now
                </Link>
                <Link 
                  href="/about" 
                  className="px-6 py-3 sm:px-8 sm:py-4 bg-transparent border-2 border-white text-white rounded-lg font-medium hover:bg-white hover:text-blue-700 transition duration-300 text-center text-lg sm:text-lg"
                >
                  Learn More
                </Link>
              </div>
            </div>
            <div className="lg:w-1/2 animate-float">
              <div className="relative overflow-hidden">
                <div className="relative h-32 sm:h-48 md:h-56 lg:h-[400px] w-full max-w-lg mx-auto">
                  <div className="absolute inset-0 bg-blue-900 bg-opacity-20 rounded-xl shadow-2xl overflow-hidden">
                    <div className="absolute right-0 top-0 w-32 h-32 bg-blue-400 rounded-full opacity-20 transform translate-x-8 -translate-y-8"></div>
                    <div className="absolute left-0 bottom-0 w-32 h-32 bg-indigo-400 rounded-full opacity-20 transform -translate-x-8 translate-y-8"></div>
                    <div className="absolute inset-0 flex items-center justify-center p-1 sm:p-4">
                      <div className="text-center w-full">
                        <div className="text-sm sm:text-lg lg:text-2xl font-bold text-white mb-1 sm:mb-2 lg:mb-4">Live Status</div>
                        <div className="flex flex-col sm:flex-row justify-between items-center gap-1 sm:gap-2 lg:gap-4 bg-white bg-opacity-10 p-1 sm:p-2 lg:p-4 rounded-lg backdrop-blur-sm mb-1 sm:mb-3 lg:mb-6">
                          <div className="text-center">
                            <div className="text-white text-xs sm:text-sm mb-0 sm:mb-1">Current Capacity</div>
                            <div className="text-lg sm:text-2xl lg:text-4xl font-bold text-white">65%</div>
                          </div>
                          <div className="hidden sm:block h-10 w-px bg-blue-200 opacity-30"></div>
                          <div className="text-center">
                            <div className="text-white text-xs sm:text-sm mb-0 sm:mb-1">Patients Waiting</div>
                            <div className="text-lg sm:text-2xl lg:text-4xl font-bold text-white">18</div>
                          </div>
                        </div>
                        <div className="bg-white bg-opacity-10 p-1 sm:p-2 lg:p-4 rounded-lg backdrop-blur-sm">
                          <div className="text-white font-medium mb-1 sm:mb-2 lg:mb-3 text-xs sm:text-sm lg:text-base">Est. Wait Time: <span className="text-green-300">~15 min</span></div>
                          <div className="flex items-center gap-1 sm:gap-2">
                            <div className="flex-1 bg-blue-200 bg-opacity-30 h-1 sm:h-2 rounded-full">
                              <div className="w-2/3 h-full bg-green-400 rounded-full"></div>
                            </div>
                            <div className="text-xs text-blue-100">Moderate</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full py-8 sm:py-12 lg:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12 lg:mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Why Choose MediQueue?</h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Our innovative platform transforms the hospital waiting experience for patients and healthcare providers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Feature 1 */}
            <div className="bg-white p-6 lg:p-8 rounded-xl shadow-md hover:shadow-lg transition duration-300 transform hover:-translate-y-1">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Real-Time Wait Times</h3>
              <p className="text-gray-600 leading-relaxed">
                Know exactly how long you'll wait. Our system provides accurate, real-time estimates updated constantly.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white p-6 lg:p-8 rounded-xl shadow-md hover:shadow-lg transition duration-300 transform hover:-translate-y-1">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Smart Notifications</h3>
              <p className="text-gray-600 leading-relaxed">
                Receive alerts when it's almost your turn, allowing you to arrive just in time for your appointment.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white p-6 lg:p-8 rounded-xl shadow-md hover:shadow-lg transition duration-300 transform hover:-translate-y-1">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Priority Queueing</h3>
              <p className="text-gray-600 leading-relaxed">
                Our intelligent system prioritizes cases based on urgency, ensuring critical patients receive immediate attention.
              </p>
            </div>
      
            {/* Feature 4 */}
            <div className="bg-white p-6 lg:p-8 rounded-xl shadow-md hover:shadow-lg transition duration-300 transform hover:-translate-y-1">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Secure & Private</h3>
              <p className="text-gray-600 leading-relaxed">
                Your health information is protected with enterprise-grade security and strict privacy controls.
              </p>
            </div>
        
            {/* Feature 5 */}
            <div className="bg-white p-6 lg:p-8 rounded-xl shadow-md hover:shadow-lg transition duration-300 transform hover:-translate-y-1">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Smart Scheduling</h3>
              <p className="text-gray-600 leading-relaxed">
                AI-powered scheduling optimizes hospital resources and minimizes patient waiting times.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-white p-6 lg:p-8 rounded-xl shadow-md hover:shadow-lg transition duration-300 transform hover:-translate-y-1">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2"></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">User-Friendly Interface</h3>
              <p className="text-gray-600 leading-relaxed">
                Intuitive design makes it easy for patients of all ages and technical abilities to use MediQueue.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Carousel - Enhanced version */}
      <section className="w-full py-8 sm:py-12 lg:py-20 bg-gradient-to-b from-white to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12 lg:mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">What Our Users Say</h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Don't just take our word for it—hear from the patients and healthcare providers who use MediQueue every day.
            </p>
          </div>

          <div className="relative overflow-hidden">
            {/* Background decorations */}
            <div className="hidden lg:block absolute top-0 left-0 w-32 h-32 transform -translate-x-8 -translate-y-8">
              <div className="absolute w-full h-full bg-blue-100 rounded-full opacity-30 animate-pulse"></div>
              <div className="absolute w-3/4 h-3/4 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-blue-200 rounded-full opacity-40"></div>
            </div>
            <div className="hidden lg:block absolute bottom-0 right-0 w-40 h-40 transform translate-x-8 translate-y-8">
              <div className="absolute w-full h-full bg-indigo-100 rounded-full opacity-30 animate-pulse" style={{ animationDelay: '1s' }}></div>
              <div className="absolute w-3/4 h-3/4 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-indigo-200 rounded-full opacity-40"></div>
            </div>

            {/* Testimonial Cards */}
            <div className="overflow-hidden">
              <div 
                className="flex transition-transform duration-700 ease-in-out" 
                style={{ transform: `translateX(-${activeTestimonial * 100}%)` }}
              >
                {testimonials.map((testimonial) => (
                  <div key={testimonial.id} className="w-full flex-shrink-0 px-2 sm:px-4">
                    <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 relative overflow-hidden transform transition-all duration-300 hover:scale-[1.02] hover:shadow-xl">
                      {/* Quote icon decorations */}
                      <div className="absolute top-2 left-2 sm:top-4 sm:left-4 text-blue-100 opacity-50">
                        <svg width="40" height="40" className="sm:w-16 sm:h-16" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                        </svg>
                      </div>
                      
                      {/* Rating stars */}
                      <div className="flex items-center space-x-1 mb-6 relative">
                        {renderStars(testimonial.rating)}
                        <span className="ml-2 text-sm text-blue-600 font-medium">{testimonial.rating}.0</span>
                      </div>
                      
                      {/* Testimonial content */}
                      <p className="text-gray-700 text-base sm:text-lg font-light italic mb-8 relative leading-relaxed">"{testimonial.content}"</p>
                      
                      {/* User info with staggered animation */}
                      <div className="flex items-center">
                        <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-full overflow-hidden flex items-center justify-center bg-gradient-to-r from-blue-400 to-indigo-500 text-white text-lg sm:text-xl font-bold">
                          {testimonial.name.charAt(0)}
                        </div>
                        <div className="ml-4">
                          <h4 className="font-bold text-gray-900 text-sm sm:text-base">{testimonial.name}</h4>
                          <p className="text-blue-600 text-sm">{testimonial.role}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation arrows */}
            <div className="mt-8 flex justify-between items-center">
              <button
                onClick={() => setActiveTestimonial((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1))}
                className="p-2 sm:p-3 rounded-full bg-white shadow-md hover:bg-blue-50 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Previous testimonial"
              >
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              
              {/* Navigation Dots */}
              <div className="flex justify-center space-x-2 sm:space-x-3">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveTestimonial(index)}
                    className={`h-2 w-2 sm:h-3 sm:w-3 rounded-full focus:outline-none transition-all duration-300 transform ${
                      activeTestimonial === index 
                        ? 'bg-blue-600 scale-125' 
                        : 'bg-gray-300 hover:bg-blue-300'
                    }`}
                    aria-label={`Go to testimonial ${index + 1}`}
                  />
                ))}
              </div>
              
              <button
                onClick={() => setActiveTestimonial((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1))}
                className="p-2 sm:p-3 rounded-full bg-white shadow-md hover:bg-blue-50 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Next testimonial"
              >
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-8 sm:py-12 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">Ready to transform your healthcare experience?</h2>
          <p className="text-lg sm:text-xl text-indigo-100 max-w-3xl mx-auto mb-6 sm:mb-8 lg:mb-10 leading-relaxed">
            Join thousands of patients who have reclaimed their time and improved their healthcare experience with MediQueue.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6">
            <Link 
              href="/register" 
              className="px-8 py-4 bg-white text-indigo-700 rounded-lg font-medium shadow-lg hover:bg-indigo-50 transition duration-300 text-lg"
            >
              Get Started Today
            </Link>
            <Link 
              href="/login" 
              className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-lg font-medium hover:bg-white hover:text-indigo-700 transition duration-300 text-lg"
            >
              Login to Your Account
            </Link>
          </div>
        </div>
      </section>

      {/* Add some custom styles for animations */}
      <style jsx>{`
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
          100% { transform: translateY(0px); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
    </main>
  );
} 