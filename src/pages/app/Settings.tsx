import React from 'react';
import { Bell, Globe, Shield, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';

const settingSections = [
  {
    title: 'Notifications',
    icon: Bell,
    items: [
      { label: 'Live Service Alerts', enabled: true },
      { label: 'Daily Verse', enabled: true },
      { label: 'Community Updates', enabled: false }
    ]
  },
  {
    title: 'Language & Region',
    icon: Globe,
    items: [
      { label: 'Language', value: 'English' },
      { label: 'Time Zone', value: 'UTC+2' }
    ]
  },
  {
    title: 'Privacy',
    icon: Shield,
    items: [
      { label: 'Profile Visibility', value: 'Public' },
      { label: 'Prayer Request Privacy', value: 'Private' }
    ]
  }
];

export default function Settings() {
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white mb-8">Settings</h1>

      {settingSections.map((section, index) => (
        <Card key={index} className="p-6">
          <div className="flex items-center space-x-3 mb-6">
            <section.icon className="h-6 w-6 text-emerald-500" />
            <h2 className="text-xl font-semibold text-white">{section.title}</h2>
          </div>

          <div className="space-y-4">
            {section.items.map((item, itemIndex) => (
              <div
                key={itemIndex}
                className="flex items-center justify-between py-3 border-b border-white/10 last:border-0"
              >
                <span className="text-gray-300">{item.label}</span>
                {'enabled' in item ? (
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={item.enabled}
                      onChange={() => {}}
                    />
                    <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                  </label>
                ) : (
                  <span className="text-gray-400">{item.value}</span>
                )}
              </div>
            ))}
          </div>
        </Card>
      ))}

      <div className="pt-6">
        <Button
          variant="secondary"
          icon={LogOut}
          className="w-full"
          onClick={handleSignOut}
        >
          Sign Out
        </Button>
      </div>
    </div>
  );
}