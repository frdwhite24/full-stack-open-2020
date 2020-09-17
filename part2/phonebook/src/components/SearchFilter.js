import React from "react";

const SearchFilter = ({ handleFilterChange }) => {
  return (
    <div>
      filter shown with <input onChange={handleFilterChange} />
    </div>
  );
};

export default SearchFilter;
