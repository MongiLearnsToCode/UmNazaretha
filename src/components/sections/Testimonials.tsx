import React from 'react';
import { Quote } from 'lucide-react';
import Card from '../ui/Card';

const testimonials = [
  {
    name: 'Sipho Mkhize',
    role: 'Church Member',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80',
    quote: 'umNazaretha has brought our sacred traditions into my daily life. I can now connect with our teachings anywhere.'
  },
  {
    name: 'Thembi Ndlovu',
    role: 'Youth Leader',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80',
    quote: 'The digital library has been invaluable for teaching our youth about our heritage and beliefs.'
  },
  {
    name: 'Mandla Zulu',
    role: 'Elder',
    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80',
    quote: 'This platform helps preserve our traditions while making them accessible to the next generation.'
  }
];

export default function Testimonials() {
  return (
    <section className="py-20 bg-gray-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-white mb-4">Our Community Speaks</h2>
          <div className="w-24 h-1 bg-gradient-to-r from-emerald-500 to-sky-500 mx-auto" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="relative">
              <Quote className="absolute top-4 right-4 h-8 w-8 text-emerald-500/20" />
              <img
                src={testimonial.image}
                alt={testimonial.name}
                className="w-16 h-16 rounded-full mb-4"
              />
              <p className="text-gray-300 mb-4 italic">{testimonial.quote}</p>
              <div>
                <p className="text-white font-semibold">{testimonial.name}</p>
                <p className="text-emerald-500 text-sm">{testimonial.role}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}