import React, { useState, useEffect } from "react";
import axios from "axios";
import Search from "./components/Search";
import FilterCountries from "./components/FilterCountries";

function App() {
  const [countries, setCountries] = useState([]);
  const [filterVal, setFilterVal] = useState("");

  useEffect(() => {
    axios.get("https://restcountries.eu/rest/v2/all").then((response) => {
      setCountries(response.data);
    });
  });
  const handleFilterValChange = (event) => {
    setFilterVal(event.target.value);
  };
  const handleShowButtonClick = (event) => {
    setFilterVal(event.target.getAttribute('country'))
  }
  return (
    <div className="App">
      <Search handler={handleFilterValChange} />
      <FilterCountries countries={countries} filterVal={filterVal} showButtonHandler={handleShowButtonClick} />
    </div>
  );
}

export default App;
