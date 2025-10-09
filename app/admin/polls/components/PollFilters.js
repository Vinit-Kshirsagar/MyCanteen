// components/polls/PollFilters.js
import { Calendar, Filter, X } from 'lucide-react';

export default function PollFilters({ 
  selectedDate, 
  onDateChange, 
  filterStatus, 
  onFilterChange 
}) {
  const filterOptions = [
    { value: 'all', label: 'All Users', count: 'all' },
    { value: 'pending', label: 'Pending', count: 'pending' },
    { value: 'confirmed', label: 'Confirmed', count: 'confirmed' },
    { value: 'no-response', label: 'No Response', count: 'no-response' },
    { value: 'attending', label: 'Attending', count: 'attending' }
  ];

  const getDateOptions = () => {
    const options = [];
    const today = new Date();
    
    // Add today and previous 7 days
    for (let i = 0; i < 8; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateString = date.toISOString().slice(0, 10);
      
      let label;
      if (i === 0) label = 'Today';
      else if (i === 1) label = 'Yesterday';
      else {
        label = date.toLocaleDateString('en-US', { 
          weekday: 'short', 
          month: 'short', 
          day: 'numeric' 
        });
      }
      
      options.push({ value: dateString, label });
    }
    
    return options;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        {/* Main Filters */}
        <div className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
            {/* Date Selector */}
            <div className="flex-shrink-0">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="w-4 h-4 inline mr-1.5" />
                Date
              </label>
              <div className="relative">
                <select
                  value={selectedDate}
                  onChange={(e) => onDateChange(e.target.value)}
                  className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2.5 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors min-w-40"
                >
                  {getDateOptions().map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Status Filter */}
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Filter className="w-4 h-4 inline mr-1.5" />
                Status Filter
              </label>
              <div className="flex flex-wrap gap-2">
                {filterOptions.map(option => (
                  <button
                    key={option.value}
                    onClick={() => onFilterChange(option.value)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 border ${
                      filterStatus === option.value
                        ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                        : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50 hover:border-gray-300'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Active Filter Display */}
        {filterStatus !== 'all' && (
          <div className="px-4 sm:px-6 pb-4 sm:pb-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  <span className="text-sm text-blue-800">
                    Showing: <span className="font-medium">
                      {filterOptions.find(f => f.value === filterStatus)?.label}
                    </span>
                  </span>
                </div>
                <button
                  onClick={() => onFilterChange('all')}
                  className="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors"
                >
                  <X size={14} />
                  Clear
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}