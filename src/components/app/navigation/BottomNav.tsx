import React from 'react';
import { Home, Tv, Calendar, Film, Clock } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';

const navItems = [
  { icon: Home, label: 'Home', path: '/dashboard' },
  { icon: Tv, label: 'Live TV', path: '/dashboard/live' },
  { icon: Calendar, label: 'Guide', path: '/dashboard/guide' }
];

const adminItems = [
  { icon: Film, label: 'Shows', path: '/dashboard/admin/shows' },
  { icon: Clock, label: 'Schedule', path: '/dashboard/admin/schedule' }
];

export default function BottomNav() {
  const location = useLocation();
  const { profile } = useAuth();
  const isAdmin = profile?.is_admin ?? false;

  // Combine navigation items based on admin status
  const displayItems = isAdmin ? [...navItems, ...adminItems] : navItems;

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-gray-900/95 backdrop-blur-sm border-t border-white/10 md:hidden">
      <div className="flex justify-around items-center h-16">
        {displayItems.map(({ icon: Icon, label, path }) => (
          <Link
            key={path}
            to={path}
            className={`flex flex-col items-center space-y-1 px-4 py-2 ${
              location.pathname === path
                ? 'text-emerald-500'
                : 'text-gray-400 hover:text-emerald-500'
            }`}
          >
            <Icon className="h-5 w-5" />
            <span className="text-xs">{label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}