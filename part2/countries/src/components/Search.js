import React from "react";

const Search = ({ handler }) => {
  return (
    <div>
      <label htmlFor="">find countries</label>
      <input onChange={handler} type="text" />
    </div>
  );
};

export default Search;
