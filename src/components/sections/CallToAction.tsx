import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../ui/Button';
import { Play } from 'lucide-react';

export default function CallToAction() {
  const navigate = useNavigate();

  return (
    <section className="py-20 bg-gradient-to-r from-emerald-900 to-sky-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-4xl font-bold text-white mb-6">
          Join Our Digital Congregation
        </h2>
        <p className="text-xl text-gray-300 mb-8">
          Experience the richness of our traditions and teachings from anywhere in the world.
          Start your spiritual journey with umNazaretha today.
        </p>
        <Button 
          variant="primary" 
          icon={Play} 
          className="text-lg px-8 py-4"
          onClick={() => navigate('/auth')}
        >
          Begin Your Journey
        </Button>
      </div>
    </section>
  );
}