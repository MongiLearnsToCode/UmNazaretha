import React from 'react';
import { Play } from 'lucide-react';

const programs = [
  {
    title: "Sunday Service",
    image: "https://images.unsplash.com/photo-1438232992991-995b7058bbb3?auto=format&fit=crop&q=80",
    time: "Every Sunday, 10:00 AM"
  },
  {
    title: "Bible Study",
    image: "https://images.unsplash.com/photo-1504052434569-70ad5836ab65?auto=format&fit=crop&q=80",
    time: "Wednesdays, 7:00 PM"
  },
  {
    title: "Youth Ministry",
    image: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&q=80",
    time: "Fridays, 6:00 PM"
  }
];

export default function Programs() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Programs</h2>
          <p className="text-lg text-gray-600">Join us for these uplifting programs</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {programs.map((program, index) => (
            <div key={index} className="group relative rounded-lg overflow-hidden shadow-lg">
              <img
                src={program.image}
                alt={program.title}
                className="w-full h-64 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="text-xl font-semibold text-white mb-2">{program.title}</h3>
                  <p className="text-indigo-200 mb-4">{program.time}</p>
                  <button className="inline-flex items-center px-4 py-2 bg-amber-500 text-white rounded-md hover:bg-amber-600">
                    <Play className="h-4 w-4 mr-2" />
                    Watch Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}