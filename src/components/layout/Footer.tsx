import React from 'react';
import { Facebook, Instagram, Youtube, Mail } from 'lucide-react';
import Logo from '../navigation/Logo';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <Logo />
            <p className="text-gray-400 mt-4">
              Digital ministry platform for the Nazareth Baptist Church of EBuhleni
            </p>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-emerald-500">About Us</a></li>
              <li><a href="#" className="text-gray-400 hover:text-emerald-500">Programs</a></li>
              <li><a href="#" className="text-gray-400 hover:text-emerald-500">Privacy Policy</a></li>
              <li><a href="#" className="text-gray-400 hover:text-emerald-500">Terms of Use</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact</h4>
            <address className="text-gray-400 not-italic">
              123 Faith Avenue<br />
              EBuhleni, KZN<br />
              <a href="tel:+27123456789" className="hover:text-emerald-500">
                +27 12 345 6789
              </a><br />
              <a href="mailto:info@umnazaretha.org" className="hover:text-emerald-500">
                info@umnazaretha.org
              </a>
            </address>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Newsletter</h4>
            <form className="space-y-4">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:border-emerald-500"
              />
              <button className="w-full px-4 py-2 bg-emerald-500 hover:bg-emerald-600 rounded-md transition-colors">
                Subscribe
              </button>
            </form>
            <div className="flex space-x-4 mt-6">
              {[Facebook, Instagram, Youtube].map((Icon, index) => (
                <a
                  key={index}
                  href="#"
                  className="text-gray-400 hover:text-emerald-500 transition-colors"
                >
                  <Icon className="h-6 w-6" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}