// components/dashboard/DashboardHeader.js
'use client'

import { UserPlus, LogOut, Users } from 'lucide-react';

const DashboardHeader = ({ onCreateUser, onLogout, currentUser }) => {
  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
            <Users className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-sm text-gray-600">Manage users and system operations</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={onCreateUser}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition-all duration-200 font-medium"
          >
            <UserPlus size={18} />
            <span className="hidden sm:inline">Create User</span>
          </button>
          <button
            onClick={onLogout}
            className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg shadow hover:bg-red-700 transition-all duration-200 font-medium"
          >
            <LogOut size={18} />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;