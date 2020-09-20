import React from "react";

const DisplayCountries = ({ countries }) => {
  return (
    <>
      {countries.map((country) => (
        <p key={country.name}>{country.name}</p>
      ))}
    </>
  );
};

export default DisplayCountries;
