// src/components/common/SearchFilter.jsx
import React from 'react';
import { Search, Filter } from 'lucide-react';

const SearchFilter = ({ searchTerm, setSearchTerm }) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <div className="flex-1 relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
      <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
        <Filter className="h-4 w-4 mr-2" />
        Filter
      </button>
    </div>
  );
};

export default SearchFilter ;