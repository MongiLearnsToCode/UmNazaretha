import React from 'react';
import { Smartphone, Video, Church, Users, BookOpen, Scroll } from 'lucide-react';
import Card from '../ui/Card';

const features = [
  {
    icon: Smartphone,
    title: 'Mobile Access',
    description: 'Connect with our teachings and services from your mobile device'
  },
  {
    icon: Video,
    title: 'Live Services',
    description: 'Experience our sacred gatherings through live streaming'
  },
  {
    icon: BookOpen,
    title: 'Digital Library',
    description: 'Access our collection of teachings and spiritual guidance'
  },
  {
    icon: Users,
    title: 'Virtual Fellowship',
    description: 'Stay connected with our community across distances'
  },
  {
    icon: Church,
    title: 'Sacred Traditions',
    description: 'Learn about our customs and spiritual practices'
  },
  {
    icon: Scroll,
    title: 'Spiritual Resources',
    description: 'Access prayers, hymns, and educational materials'
  }
];

export default function Features() {
  return (
    <section className="py-20 bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-white mb-4">
            Bridging Tradition and Technology
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-emerald-500 to-sky-500 mx-auto mb-6" />
          <p className="text-lg text-gray-400">
            Embracing our heritage while connecting through modern platforms
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="group hover:border-emerald-500/30 transition-colors">
              <feature.icon className="h-10 w-10 text-emerald-500 mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
              <p className="text-gray-400">{feature.description}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}