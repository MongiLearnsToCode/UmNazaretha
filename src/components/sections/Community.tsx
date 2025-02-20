import React from 'react';
import { Calendar } from 'lucide-react';
import Button from '../ui/Button';

const events = [
  {
    title: 'Annual Gathering',
    date: 'July 15-17, 2024',
    image: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&q=80',
    description: 'Join us for three days of prayer, teaching, and celebration.'
  },
  {
    title: 'Youth Conference',
    date: 'August 5-7, 2024',
    image: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&q=80',
    description: 'Empowering the next generation with our traditions and values.'
  }
];

export default function Community() {
  return (
    <section className="py-20 bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-white mb-4">Community Events</h2>
          <div className="w-24 h-1 bg-gradient-to-r from-emerald-500 to-sky-500 mx-auto mb-6" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {events.map((event, index) => (
            <div key={index} className="relative rounded-2xl overflow-hidden group">
              <img
                src={event.image}
                alt={event.title}
                className="w-full h-64 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/60 to-transparent p-6 flex flex-col justify-end">
                <h3 className="text-xl font-bold text-white mb-2">{event.title}</h3>
                <p className="text-emerald-300 mb-2 flex items-center">
                  <Calendar className="h-4 w-4 mr-2" />
                  {event.date}
                </p>
                <p className="text-gray-300 mb-4">{event.description}</p>
                <Button variant="secondary" className="self-start">
                  Learn More
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}