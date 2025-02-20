import React from 'react';
import { Play } from 'lucide-react';

export default function Hero() {
  return (
    <div className="relative min-h-screen">
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1510936111840-65e151ad71bb?auto=format&fit=crop&q=80"
          alt="Church interior"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-900/90 to-indigo-600/80" />
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-16">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Bringing Faith Closer to You
            <span className="block text-2xl md:text-4xl mt-2 text-indigo-200">
              Anytime, Anywhere
            </span>
          </h1>
          <p className="max-w-2xl mx-auto text-xl text-indigo-100 mb-8">
            Join our growing community of believers and experience worship in a whole new way
            through Sacred Light Baptist Church of Edenridge's digital ministry.
          </p>
          <button className="inline-flex items-center px-8 py-3 bg-amber-500 text-white rounded-md hover:bg-amber-600 transition-colors">
            <Play className="h-5 w-5 mr-2" />
            Start Streaming Now
          </button>
        </div>
      </div>
    </div>
  );
}