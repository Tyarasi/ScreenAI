import React from 'react';
import Link from 'next/link';
import { LucideFileSearch, LucideHome, LucideSettings, LucideUsers } from 'lucide-react';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-md">
        <div className="p-4 border-b">
          <h1 className="text-xl font-bold">Resume Screener AI</h1>
        </div>
        <nav className="p-4">
          <ul className="space-y-2">
            <li>
              <Link 
                href="/" 
                className="flex items-center p-2 rounded-md hover:bg-gray-100 transition-colors"
              >
                <LucideHome className="mr-2 h-5 w-5" />
                Dashboard
              </Link>
            </li>
            <li>
              <Link 
                href="/resumes" 
                className="flex items-center p-2 rounded-md hover:bg-gray-100 transition-colors"
              >
                <LucideFileSearch className="mr-2 h-5 w-5" />
                Resume Analysis
              </Link>
            </li>
            <li>
              <Link 
                href="/candidates" 
                className="flex items-center p-2 rounded-md hover:bg-gray-100 transition-colors"
              >
                <LucideUsers className="mr-2 h-5 w-5" />
                Candidates
              </Link>
            </li>
            <li>
              <Link 
                href="/settings" 
                className="flex items-center p-2 rounded-md hover:bg-gray-100 transition-colors"
              >
                <LucideSettings className="mr-2 h-5 w-5" />
                Settings
              </Link>
            </li>
          </ul>
        </nav>
      </div>
      
      {/* Main content */}
      <div className="flex-1 overflow-auto">
        <header className="bg-white shadow-sm p-4 flex justify-between items-center">
          <h2 className="text-lg font-semibold">Resume Screening Dashboard</h2>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">Offline Mode</span>
            <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
              U
            </div>
          </div>
        </header>
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
