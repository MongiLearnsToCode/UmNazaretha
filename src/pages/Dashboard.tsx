import React from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import Button from '../components/ui/Button';

export default function Dashboard() {
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-900 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>
          <Button variant="secondary" onClick={handleSignOut}>
            Sign Out
          </Button>
        </div>
        
        <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10">
          <p className="text-white">Welcome to umNazaretha! Your content will appear here.</p>
        </div>
      </div>
    </div>
  );
}