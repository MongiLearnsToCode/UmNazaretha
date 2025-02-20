import React from 'react';
import { Church, PlayCircle } from 'lucide-react';
import { siteConfig } from '../../config/site';

export default function Logo() {
  return (
    <div className="flex items-center space-x-2">
      <div className="relative">
        <PlayCircle className="h-8 w-8 text-emerald-500" />
        <Church className="h-4 w-4 text-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
      </div>
      <span className="text-xl font-bold bg-gradient-to-r from-emerald-500 to-sky-500 text-transparent bg-clip-text">
        {siteConfig.name}
      </span>
    </div>
  );
}