import React from 'react';
import { Smartphone, Video, Cross, Users, BookOpen, Heart } from 'lucide-react';

const features = [
  {
    icon: Smartphone,
    title: 'Mobile Streaming',
    description: 'Access faith content anytime, anywhere on your mobile devices'
  },
  {
    icon: Video,
    title: 'Live Services',
    description: 'Join live services remotely and be part of our virtual congregation'
  },
  {
    icon: BookOpen,
    title: 'Faith-Based Content',
    description: 'Access a library of sermons, teachings, and inspiring stories'
  },
  {
    icon: Users,
    title: 'Community Connect',
    description: 'Engage with fellow believers through our digital platform'
  },
  {
    icon: Cross,
    title: 'Daily Devotionals',
    description: 'Start your day with guided spiritual reflections'
  },
  {
    icon: Heart,
    title: 'Prayer Requests',
    description: 'Submit and join in prayer with our online prayer community'
  }
];

export default function Features() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Experience Faith in the Digital Age
          </h2>
          <p className="text-lg text-gray-600">
            Discover how Bethany Streams brings your spiritual journey into the modern era
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="p-6 bg-gray-50 rounded-lg hover:shadow-lg transition-shadow">
              <feature.icon className="h-10 w-10 text-indigo-600 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}