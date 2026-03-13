import { useState, useEffect, useRef, useMemo } from 'react';

const SearchBar = ({ allTours, onSelect, onClear }) => {
  const [inputValue, setInputValue] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const wrapperRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  // Filter suggestions locally
  const suggestions = useMemo(() => {
    if (!allTours || inputValue.length === 0) return [];
    return allTours.filter(t =>
      t.name.toLowerCase().includes(inputValue.toLowerCase())
    );
  }, [inputValue, allTours]);

  const handleSelect = (tour) => {
    setInputValue(tour.name);
    setDropdownOpen(false);
    onSelect(tour);
  };

  const handleClear = () => {
    setInputValue('');
    setDropdownOpen(false);
    onClear();
  };

  return (
    <div ref={wrapperRef} className="mb-8 relative">
      {/* Search emoji — same as before */}
      <div className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-600 text-xl z-10">
        🔍
      </div>

      {/* Input — exactly same styling as before */}
      <input
        type="text"
        value={inputValue}
        placeholder="Search destinations..."
        className="w-full pl-14 pr-10 py-4 rounded-full bg-white border-2 border-emerald-300 focus:outline-none focus:border-emerald-500 transition-colors duration-200 text-gray-800 font-semibold shadow-lg"
        onChange={(e) => { setInputValue(e.target.value); setDropdownOpen(true); }}
        onFocus={() => inputValue && setDropdownOpen(true)}
      />

      {/* Clear button */}
      {inputValue && (
        <button
          onClick={handleClear}
          className="absolute right-5 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 text-lg"
        >
          ✕
        </button>
      )}

      {/* Dropdown */}
      {dropdownOpen && suggestions.length > 0 && (
        <div className="absolute top-[110%] left-0 right-0 bg-white rounded-2xl shadow-xl border border-emerald-100 z-50 overflow-hidden">
          {suggestions.map(tour => (
            <div
              key={tour._id}
              onClick={() => handleSelect(tour)}
              className="px-6 py-3 cursor-pointer hover:bg-emerald-50 text-gray-800 font-semibold text-sm border-b border-gray-100 last:border-none transition-colors duration-150 text-left"
            >
              {tour.name}
            </div>
          ))}
        </div>
      )}

      {/* No results */}
      {dropdownOpen && inputValue.length > 0 && suggestions.length === 0 && (
        <div className="absolute top-[110%] left-0 right-0 bg-white rounded-2xl shadow-xl border border-emerald-100 z-50 px-6 py-4 text-center text-gray-400 text-sm">
          No tours found for "{inputValue}"
        </div>
      )}
    </div>
  );
};

export default SearchBar;