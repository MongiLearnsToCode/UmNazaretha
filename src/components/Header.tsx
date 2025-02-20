import React from 'react';
import { Cross, PlayCircle, Menu } from 'lucide-react';

export default function Header() {
  return (
    <header className="fixed w-full bg-white/95 backdrop-blur-sm shadow-sm z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-2">
            <PlayCircle className="h-8 w-8 text-indigo-600" />
            <Cross className="h-6 w-6 text-indigo-600" />
            <span className="text-xl font-bold text-gray-900">Bethany Streams</span>
          </div>
          
          <nav className="hidden md:flex space-x-8">
            <a href="#" className="text-gray-700 hover:text-indigo-600">Home</a>
            <a href="#" className="text-gray-700 hover:text-indigo-600">About Us</a>
            <a href="#" className="text-gray-700 hover:text-indigo-600">Programs</a>
            <a href="#" className="text-gray-700 hover:text-indigo-600">Donate</a>
            <a href="#" className="text-gray-700 hover:text-indigo-600">Contact</a>
          </nav>

          <div className="flex items-center space-x-4">
            <button className="hidden md:block px-4 py-2 text-indigo-600 hover:text-indigo-700">
              Login
            </button>
            <button className="hidden md:block px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
              Sign Up
            </button>
            <Menu className="h-6 w-6 md:hidden text-gray-700" />
          </div>
        </div>
      </div>
    </header>
  );
}