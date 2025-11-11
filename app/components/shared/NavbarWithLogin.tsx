'use client';

import { useState } from 'react';
import Link from 'next/link';
import LoginModal from './LoginModal';

export default function NavbarWithLogin() {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const openLoginModal = () => {
    setIsLoginModalOpen(true);
  };

  const closeLoginModal = () => {
    setIsLoginModalOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <img 
              src="/images/logo.png" 
              alt="MediQueue Logo" 
              width={32} 
              height={32} 
              className="w-8 h-8 object-contain"
            />
            <Link href="/" className="font-bold text-xl text-blue-600">MediQueue</Link>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link href="/" prefetch={true} className="text-gray-700 hover:text-blue-600">Home</Link>
            <Link href="/about" prefetch={true} className="text-gray-700 hover:text-blue-600">About</Link>
            <Link href="/contact" prefetch={true} className="text-gray-700 hover:text-blue-600">Contact</Link>
          </nav>
          
          <div className="flex items-center space-x-4">
            <button 
              onClick={openLoginModal}
              className="hidden md:inline-block px-4 py-2 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50"
            >
              Login
            </button>
            <Link
              href="/register"
              prefetch={true}
              className="hidden md:inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Register
            </Link>
            <button 
              onClick={toggleMobileMenu}
              className="md:hidden text-gray-600"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
        
        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <Link 
                href="/"
                prefetch={true}
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50"
              >
                Home
              </Link>
              <Link 
                href="/about"
                prefetch={true}
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50"
              >
                About
              </Link>
              <Link 
                href="/contact"
                prefetch={true}
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50"
              >
                Contact
              </Link>
              <button
                onClick={openLoginModal}
                className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-blue-600 hover:text-blue-800 hover:bg-gray-50"
              >
                Login
              </button>
              <Link
                href="/register"
                prefetch={true}
                className="block px-3 py-2 rounded-md text-base font-medium text-white bg-blue-600 hover:bg-blue-700"
              >
                Register
              </Link>
            </div>
          </div>
        )}
      </header>
      
      {isLoginModalOpen && <LoginModal onClose={closeLoginModal} />}
    </>
  );
} 