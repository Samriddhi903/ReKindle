const SearchBar = ({ searchQuery, onSearchChange, onClearSearch }) => (
  <div className="max-w-4xl mx-auto mb-6">
    <div className="relative">
      <input
        type="text"
        placeholder="Search messages..."
        value={searchQuery}
        onChange={onSearchChange}
        className="w-full rounded-lg px-4 py-3 border-2 border-pastel-mint focus:ring-4 focus:ring-pastel-blue text-lg font-opendyslexic disabled:opacity-50"
      />
      {searchQuery && (
        <button
          onClick={onClearSearch}
          className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
          aria-label="Clear search"
        >
          ✕
        </button>
      )}
    </div>
  </div>
);

export default SearchBar; 