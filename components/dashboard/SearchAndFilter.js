// components/dashboard/SearchBar.js
'use client'

import { Search } from 'lucide-react'

const SearchBar = ({ searchTerm, setSearchTerm }) => {
  return (
    <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <input
          type="text"
          placeholder="Search users by name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg 
                     focus:ring-2 focus:ring-blue-500 focus:border-transparent 
                     transition-all duration-200"
        />
      </div>
    </div>
  )
}

export default SearchBar
