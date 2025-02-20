import React from 'react';
import { Play, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from '../ui/Button';
import { siteConfig } from '../../config/site';

export default function Hero() {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-gray-900/50 to-gray-900" />
        <img
          src="https://images.unsplash.com/photo-1682687982501-1e58ab814714"
          alt="Samela gathering - Nazareth Baptist Church"
          className="w-full h-full object-cover"
        />
      </div>
      
      <div className="relative flex flex-col min-h-screen">
        <div className="flex-1 flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
            <div className="max-w-3xl">
              <h1 className="text-5xl md:text-7xl font-bold text-white mb-8 leading-tight">
                Preserving Tradition in the
                <span className="bg-gradient-to-r from-emerald-500 to-sky-500 text-transparent bg-clip-text">
                  {' '}Digital Era
                </span>
              </h1>
              <p className="text-xl text-gray-300 mb-12 leading-relaxed">
                Join {siteConfig.organization}'s digital ministry and stay connected 
                with our teachings, traditions, and community from anywhere.
              </p>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <Button 
                  variant="primary" 
                  icon={Play}
                  onClick={() => navigate('/auth')}
                >
                  Start Streaming
                </Button>
                <Button 
                  variant="secondary"
                  onClick={() => navigate('/auth')}
                >
                  View Programs
                </Button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ChevronDown className="h-8 w-8 text-emerald-500" />
        </div>
      </div>
    </div>
  );
}