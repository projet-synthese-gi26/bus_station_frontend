// Modifiez le fichier SearchBar.tsx dans @/components/faqs-page-component/

import React, { useState, useEffect, useRef } from 'react';
import { Search } from 'lucide-react';

// Définir correctement l'interface des props
interface SearchBarProps {
  initialQuery?: string;
  onSearch: (query: string) => void;
  placeholder?: string;
  recentSearches?: string[]; // Changé de never[] à string[]
  onSaveRecentSearch?: (query: string) => void; // Ajout du paramètre query
  className?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({
  initialQuery = '',
  onSearch,
  placeholder = 'Rechercher...',
  recentSearches = [],
  onSaveRecentSearch,
  className = '',
}) => {
  const [query, setQuery] = useState(initialQuery);
  const [showRecent, setShowRecent] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const handleSearch = () => {
    if (query.trim()) {
      onSearch(query);
      if (onSaveRecentSearch) {
        onSaveRecentSearch(query);
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const selectRecentSearch = (recentQuery: string) => {
    setQuery(recentQuery);
    onSearch(recentQuery);
    setShowRecent(false);
  };

  // Fermer la liste des recherches récentes lorsqu'on clique en dehors
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowRecent(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div ref={searchRef} className={`relative ${className}`}>
      <div className="flex items-center relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => recentSearches.length > 0 && setShowRecent(true)}
          placeholder={placeholder}
          className="w-full py-3 px-4 pr-12 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <div className="absolute right-4">
          <button
            onClick={handleSearch}
            className="text-blue-600 hover:text-blue-800"
            aria-label="Rechercher"
          >
            <Search className="h-5 w-5" />
          </button>
        </div>
      </div>
      
      {/* Recherches récentes */}
      {showRecent && recentSearches.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200">
          <div className="p-2">
            <p className="text-xs text-gray-500 mb-1 px-2">Recherches récentes</p>
            {recentSearches.map((item, index) => (
              <div
                key={index}
                onClick={() => selectRecentSearch(item)}
                className="p-2 hover:bg-gray-100 rounded cursor-pointer text-sm"
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;