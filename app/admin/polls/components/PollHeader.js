// components/polls/PollHeader.js
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function PollHeader({ onLogout, currentUser }) {
  const router = useRouter();

  const handleBackToDashboard = () => {
    router.push('/admin/dashboard');
  };

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-4">
            <button
              onClick={handleBackToDashboard}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft size={20} />
              <span>Back to Dashboard</span>
            </button>
            <div className="h-6 border-l border-gray-300"></div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Poll Management</h1>
              <p className="text-sm text-gray-600">Manage daily meal attendance and confirmations</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">{currentUser?.email}</p>
              <p className="text-xs text-gray-600">Admin</p>
            </div>
            <button
              onClick={onLogout}
              className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}