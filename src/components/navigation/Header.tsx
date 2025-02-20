import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Logo from './Logo';
import Button from '../ui/Button';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`fixed w-full z-50 transition-all duration-300 ${
      isScrolled ? 'bg-gray-900/95 backdrop-blur-sm' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Logo />
          
          <nav className="hidden md:flex items-center space-x-8">
            {['Home', 'About', 'Programs', 'Donate', 'Contact'].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="text-gray-300 hover:text-amber-500 transition-colors"
              >
                {item}
              </a>
            ))}
          </nav>

          <div className="hidden md:flex items-center space-x-4">
            <Button 
              variant="ghost"
              onClick={() => navigate('/auth')}
            >
              Login
            </Button>
            <Button 
              variant="primary"
              onClick={() => navigate('/auth')}
            >
              Get Started
            </Button>
          </div>

          <button 
            className="md:hidden text-white"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-gray-900/95 backdrop-blur-sm">
          <div className="px-4 pt-2 pb-6 space-y-4">
            {['Home', 'About', 'Programs', 'Donate', 'Contact'].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="block text-gray-300 hover:text-amber-500 py-2"
              >
                {item}
              </a>
            ))}
            <div className="space-y-2 pt-4">
              <Button 
                variant="secondary" 
                className="w-full"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  navigate('/auth');
                }}
              >
                Login
              </Button>
              <Button 
                variant="primary" 
                className="w-full"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  navigate('/auth');
                }}
              >
                Get Started
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}