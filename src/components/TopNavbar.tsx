'use client';

import { UserButton } from '@clerk/nextjs';
import Image from 'next/image';
import { Menu, X } from 'lucide-react';

interface TopNavbarProps {
  showProfileButton?: boolean;
  showMenuButton?: boolean;
  onMenuClick?: () => void;
  isSidebarOpen?: boolean;
}

export default function TopNavbar({ 
  showProfileButton = true, 
  showMenuButton = false, 
  onMenuClick,
  isSidebarOpen = false
}: TopNavbarProps) {
  return (
    <nav className="w-screen bg-gray-800 shadow-sm border-b border-gray-700 h-16">
      <div className="px-4 md:px-0 md:pr-12 h-full">
        <div className="flex items-center justify-between h-full">
          {/* Logo and Name */}
          <div className="flex items-center">
            <Image 
                src="/logo.png" 
                alt="CloudyFiles Logo" 
                width={52} 
                height={52} 
                className="w-10 h-10 md:w-16 md:h-16"
            />
            <span className="text-lg md:text-2xl font-bold text-neutral-50 ml-2">
              CloudyFiles
            </span>
          </div>

          {/* Right side - Menu/Close Button and User Button */}
          <div className="flex items-center gap-2">
            {/* Menu/Close Button - Only on mobile */}
            {showMenuButton && (
              <button
                onClick={onMenuClick}
                className="md:hidden p-2 text-white rounded-md transition-all duration-75"
              >
                {isSidebarOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            )}
            {/* User Button - Always visible */}
            <div className='hidden md:block'>
              {showProfileButton && <UserButton />}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
