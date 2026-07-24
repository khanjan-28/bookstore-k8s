import React from "react";
function SearchBar({
  searchKeyword,
  setSearchKeyword,
  categoryFilter,
  setCategoryFilter,
  categories,
}) {
console.log(categories);
const handleKeyPress = (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
  }
};
const clearSearch = () => {
  setSearchKeyword("");
  setCategoryFilter("All");
};
  return (
    <div className="search-bar">

      <input
        type="text"
        placeholder="Search by Title, Author or Category..."
        value={searchKeyword}
        onChange={(e) => setSearchKeyword(e.target.value)}
        onKeyDown={handleKeyPress}
      />
<select
  className="categorySelect"
  value={categoryFilter}
  onChange={(e) => setCategoryFilter(e.target.value)}
>
  {categories.map((category) => (
    <option
      key={category}
      value={category}
    >
      📂 {category}
    </option>
  ))}
</select>
     <button
        className="clear-btn"
        onClick={clearSearch}
      >
        Clear
      </button>

    </div>
  );
}

export default SearchBar;
