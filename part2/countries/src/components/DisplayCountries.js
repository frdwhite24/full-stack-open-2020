import React from "react";

const DisplayCountries = ({ countries, showButtonHandler }) => {
  return (
    <ul>
      {countries.map((country) => (
        <li key={country.name}>
          <span>{country.name} </span>
          <button country={country.name} type="button" onClick={showButtonHandler}>Show</button>
        </li>
      ))}
    </ul>
  );
};

export default DisplayCountries;
