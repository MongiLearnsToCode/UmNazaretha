import React from 'react';
import Header from '../components/navigation/Header';
import Hero from '../components/sections/Hero';
import VideoPromo from '../components/sections/VideoPromo';
import Features from '../components/sections/Features';
import Programs from '../components/sections/Programs';
import Testimonials from '../components/sections/Testimonials';
import Community from '../components/sections/Community';
import CallToAction from '../components/sections/CallToAction';
import Footer from '../components/layout/Footer';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gray-900">
      <Header />
      <main>
        <Hero />
        <VideoPromo />
        <Features />
        <Programs />
        <Testimonials />
        <Community />
        <CallToAction />
      </main>
      <Footer />
    </div>
  );
}