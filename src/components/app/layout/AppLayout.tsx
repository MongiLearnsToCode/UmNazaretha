import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../navigation/Sidebar';
import BottomNav from '../navigation/BottomNav';

export default function AppLayout() {
  return (
    <div className="min-h-screen bg-gray-900">
      <Sidebar />
      <main className="md:ml-64 pb-16 md:pb-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Outlet />
        </div>
      </main>
      <BottomNav />
    </div>
  );
}