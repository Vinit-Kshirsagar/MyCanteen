// components/dashboard/UserDetailModal.js
'use client'

import { X, Hash, User, Mail, Phone, Shield, Users, Calendar } from 'lucide-react';

const UserDetailModal = ({ user, onClose }) => {
  if (!user) return null;

  const userFields = [
    // { label: 'User ID', value: user.id, icon: Hash },
    { label: 'Full Name', value: user.name, icon: User },
    { label: 'Email Address', value: user.email, icon: Mail },
    { label: 'Phone Number', value: user.contact_number, icon: Phone },
    // { label: 'Role', value: user.role, icon: Shield },
    { label: 'Department', value: user.department || 'N/A', icon: Users },
    { label: 'Year', value: user.academic_year || 'N/A', icon: Calendar }
  ].filter(field => field.value && field.value !== 'N/A');

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">User Details</h2>
              <p className="text-sm text-gray-600">Complete user information</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors duration-150"
          >
            <X size={18} className="text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {userFields.map((field, index) => (
            <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                <field.icon className="w-4 h-4 text-gray-600" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">{field.label}</p>
                <p className="text-sm font-medium text-gray-900 mt-1">{field.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
          <button
            onClick={onClose}
            className="w-full bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-all duration-200 font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserDetailModal;