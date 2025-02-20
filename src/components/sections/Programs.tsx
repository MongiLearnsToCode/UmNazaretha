import React from 'react';
import { Play } from 'lucide-react';
import Card from '../ui/Card';
import Button from '../ui/Button';

const programs = [
  {
    title: 'Sacred Gatherings',
    image: 'https://images.unsplash.com/photo-1438232992991-995b7058bbb3?auto=format&fit=crop&q=80',
    time: 'Sundays, 10:00 AM'
  },
  {
    title: 'Traditional Teachings',
    image: 'https://images.unsplash.com/photo-1490127252417-7c393f993ee4?auto=format&fit=crop&q=80',
    time: 'Wednesdays, 7:00 PM'
  },
  {
    title: 'Youth Fellowship',
    image: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&q=80',
    time: 'Fridays, 6:00 PM'
  }
];

export default function Programs() {
  return (
    <section className="py-20 bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-white mb-4">Featured Programs</h2>
          <div className="w-24 h-1 bg-gradient-to-r from-emerald-500 to-sky-500 mx-auto mb-6" />
          <p className="text-lg text-gray-400">Join us in our spiritual journey</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {programs.map((program, index) => (
            <div key={index} className="group relative rounded-2xl overflow-hidden">
              <img
                src={program.image}
                alt={program.title}
                className="w-full h-64 object-cover transform group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="text-xl font-semibold text-white mb-2">{program.title}</h3>
                  <p className="text-emerald-300 mb-4">{program.time}</p>
                  <Button variant="primary" icon={Play} className="w-full">
                    Watch Now
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}