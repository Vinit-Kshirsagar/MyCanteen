// app/admin/dashboard/components/DashboardHeader.js - Professional Client-Ready UI
import { Plus, BarChart3, Package, Menu, X, User } from 'lucide-react';
import { useState } from 'react';

export default function DashboardHeader({ onCreateUser, onManagePolls, onManageInventory, onLogout, currentUser }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 lg:h-18">
          {/* Brand Section */}
          <div className="flex items-center space-x-4">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center shadow-sm">
                <User className="w-4 h-4 lg:w-5 lg:h-5 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-xl lg:text-2xl font-semibold text-gray-900 tracking-tight">
                Admin Dashboard
              </h1>
              <p className="text-xs lg:text-sm text-gray-500 hidden sm:block leading-tight">
                Manage users and system operations
              </p>
            </div>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            <button
              onClick={onManageInventory}
              className="inline-flex items-center gap-2 text-gray-700 hover:text-purple-700 hover:bg-purple-50 px-3 py-2 rounded-lg transition-all duration-150 font-medium text-sm border border-transparent hover:border-purple-200"
            >
              <Package size={16} className="text-purple-600" />
              <span className="hidden xl:inline">Inventory & Expenses</span>
              <span className="xl:hidden">Inventory</span>
            </button>
            
            <button
              onClick={onManagePolls}
              className="inline-flex items-center gap-2 text-gray-700 hover:text-emerald-700 hover:bg-emerald-50 px-3 py-2 rounded-lg transition-all duration-150 font-medium text-sm border border-transparent hover:border-emerald-200"
            >
              <BarChart3 size={16} className="text-emerald-600" />
              <span className="hidden xl:inline">Manage Polls</span>
              <span className="xl:hidden">Polls</span>
            </button>
            
            <button
              onClick={onCreateUser}
              className="inline-flex items-center gap-2 bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-lg transition-all duration-150 font-medium text-sm shadow-sm hover:shadow-md ml-2"
            >
              <Plus size={16} />
              <span className="hidden xl:inline">Create User</span>
              <span className="xl:hidden">Create</span>
            </button>
            
            <div className="w-px h-6 bg-gray-200 mx-3"></div>
            
            <button
              onClick={onLogout}
              className="text-gray-600 hover:text-red-700 hover:bg-red-50 px-3 py-2 rounded-lg transition-all duration-150 font-medium text-sm border border-transparent hover:border-red-200"
            >
              Log Out
            </button>
          </nav>

          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <button
              onClick={toggleMobileMenu}
              className="inline-flex items-center justify-center p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X size={20} />
              ) : (
                <Menu size={20} />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        <div className={`lg:hidden transition-all duration-200 ease-out ${
          isMobileMenuOpen 
            ? 'max-h-80 opacity-100' 
            : 'max-h-0 opacity-0 overflow-hidden'
        }`}>
          <nav className="py-4 space-y-2 border-t border-gray-100">
            <button
              onClick={() => {
                onManageInventory();
                setIsMobileMenuOpen(false);
              }}
              className="w-full flex items-center gap-3 text-gray-700 hover:text-purple-700 hover:bg-purple-50 px-4 py-3 rounded-lg transition-all duration-150 text-left font-medium border border-transparent hover:border-purple-200"
            >
              <Package size={18} className="text-purple-600 flex-shrink-0" />
              Inventory & Expenses
            </button>
            
            <button
              onClick={() => {
                onManagePolls();
                setIsMobileMenuOpen(false);
              }}
              className="w-full flex items-center gap-3 text-gray-700 hover:text-emerald-700 hover:bg-emerald-50 px-4 py-3 rounded-lg transition-all duration-150 text-left font-medium border border-transparent hover:border-emerald-200"
            >
              <BarChart3 size={18} className="text-emerald-600 flex-shrink-0" />
              Manage Polls
            </button>
            
            <button
              onClick={() => {
                onCreateUser();
                setIsMobileMenuOpen(false);
              }}
              className="w-full flex items-center gap-3 bg-blue-600 text-white hover:bg-blue-700 px-4 py-3 rounded-lg transition-all duration-150 text-left font-medium shadow-sm"
            >
              <Plus size={18} className="flex-shrink-0" />
              Create User
            </button>
            
            <div className="pt-3 mt-3 border-t border-gray-100">
              <button
                onClick={() => {
                  onLogout();
                  setIsMobileMenuOpen(false);
                }}
                className="w-full text-gray-600 hover:text-red-700 hover:bg-red-50 px-4 py-3 rounded-lg transition-all duration-150 text-left font-medium border border-transparent hover:border-red-200"
              >
                Log Out
              </button>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}