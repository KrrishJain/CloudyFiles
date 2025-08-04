'use client';

import { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import TopNavbar from '@/components/TopNavbar';

interface DashboardLayoutProps {
  children: React.ReactNode;
  currentPath?: string;
  onRefresh?: () => void;
  selectedFilter?: string;
  onFilterChange?: (filter: string) => void;
}

export default function DashboardLayout({ 
  children, 
  currentPath, 
  onRefresh, 
  selectedFilter, 
  onFilterChange 
}: DashboardLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col overflow-hidden">
      {/* Top Navbar - Full Width */}
      <TopNavbar 
        showProfileButton={true}
        showMenuButton={true}
        onMenuClick={toggleSidebar}
        isSidebarOpen={isSidebarOpen}
      />

      {/* Mobile Overlay - Only for mobile */}
      {isSidebarOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-30 top-16"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Content Area with Sidebar */}
      <div className="flex flex-1">
        {/* Sidebar - Hidden on mobile unless toggled */}
        <div className={`${
          isSidebarOpen ? 'block' : 'hidden'
        } md:block fixed md:relative z-40 top-16 md:top-0 left-0 h-full`}>
          <Sidebar 
            currentPath={currentPath} 
            onRefresh={onRefresh}
            selectedFilter={selectedFilter}
            onFilterChange={onFilterChange}
          />
        </div>

        {/* Main Content */}
        <main className="flex-1 px-4 py-4 md:px-8  min-h-screen overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
