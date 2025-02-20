import React from 'react';
import { Home, Tv, Calendar, Settings, Film, Clock } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import Logo from '../../navigation/Logo';
import { useAuth } from '../../../hooks/useAuth';

const navItems = [
  { icon: Home, label: 'Home', path: '/dashboard' },
  { icon: Tv, label: 'Live TV', path: '/dashboard/live' },
  { icon: Calendar, label: 'Guide', path: '/dashboard/guide' },
  { icon: Settings, label: 'Settings', path: '/dashboard/settings' }
];

const adminItems = [
  { icon: Film, label: 'Shows', path: '/dashboard/admin/shows' },
  { icon: Clock, label: 'Schedule', path: '/dashboard/admin/schedule' }
];

export default function Sidebar() {
  const location = useLocation();
  const { profile } = useAuth();
  const isAdmin = profile?.is_admin ?? false;

  return (
    <aside className="hidden md:flex flex-col w-64 bg-gray-900/95 backdrop-blur-sm border-r border-white/10 h-screen fixed">
      <div className="p-6">
        <Logo />
      </div>
      
      <nav className="flex-1 px-4 py-6">
        {navItems.map(({ icon: Icon, label, path }) => (
          <Link
            key={path}
            to={path}
            className={`flex items-center space-x-3 px-4 py-3 rounded-lg mb-2 ${
              location.pathname === path
                ? 'bg-emerald-500/10 text-emerald-500'
                : 'text-gray-400 hover:bg-white/5 hover:text-emerald-500'
            }`}
          >
            <Icon className="h-5 w-5" />
            <span>{label}</span>
          </Link>
        ))}

        {isAdmin && (
          <div className="mt-8">
            <h3 className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
              Admin
            </h3>
            {adminItems.map(({ icon: Icon, label, path }) => (
              <Link
                key={path}
                to={path}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg mb-2 ${
                  location.pathname === path
                    ? 'bg-emerald-500/10 text-emerald-500'
                    : 'text-gray-400 hover:bg-white/5 hover:text-emerald-500'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span>{label}</span>
              </Link>
            ))}
          </div>
        )}
      </nav>
    </aside>
  );
}