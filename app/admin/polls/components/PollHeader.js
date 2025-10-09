// components/polls/PollHeader.js
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function PollHeader() {
  const router = useRouter();

  const handleBackToDashboard = () => {
    router.push('/admin/dashboard');
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4 py-4">
          <button
            onClick={handleBackToDashboard}
            className="flex items-center justify-center w-10 h-10 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Back to Dashboard"
          >
            <ArrowLeft size={20} />
          </button>
          
          <div className="flex-1">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Poll Management</h1>
            <p className="text-sm text-gray-600 mt-0.5">
              Manage daily meal attendance and confirmations
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}