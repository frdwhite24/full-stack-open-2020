import React from "react";
import DisplayCountries from "./DisplayCountries";
import DisplayCountry from "./DisplayCountry";

const FilterCountries = ({ countries, filterVal }) => {
  if (filterVal === "") {
    return (
      <div>
        <p>Filter the list of countries to show results.</p>
      </div>
    );
  }
  const filteredCountries = countries.filter((country) =>
    country.name.toLowerCase().includes(filterVal.toLowerCase())
  );
  if (filteredCountries.length === 0) {
    return (
      <div>
        <p>No countries found.</p>
      </div>
    );
  } else if (filteredCountries.length === 1) {
    return (
      <>
        <DisplayCountry country={filteredCountries[0]} />
      </>
    );
  } else if (filteredCountries.length > 1 && filteredCountries.length <= 10) {
    return (
      <>
        <DisplayCountries countries={filteredCountries} />
      </>
    );
  } else if (filteredCountries.length > 10) {
    return (
      <div>
        <p>Too many matches, specify another filter.</p>
      </div>
    );
  }
};

export default FilterCountries;
