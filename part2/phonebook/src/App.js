import React, { useState } from "react";
import DisplayRecords from "./components/DisplayRecords";
import Title from "./components/Title";
import AddRecord from "./components/AddRecord";
import SearchFilter from "./components/SearchFilter";

const App = () => {
  const [persons, setPersons] = useState([
    { name: "Arto Hellas", number: "040-123456" },
    { name: "Ada Lovelace", number: "39-44-5323523" },
    { name: "Dan Abramov", number: "12-43-234345" },
    { name: "Mary Poppendieck", number: "39-23-6423122" },
  ]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [filterValue, setFilterValue] = useState("");

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value);
  };

  const handleNameChange = (event) => {
    setNewName(event.target.value);
  };

  const handleFilterChange = (event) => {
    setFilterValue(event.target.value);
  };

  const checkDuplicate = (name) => {
    return persons.map((person) => person.name).includes(name);
  };

  const addRecord = (event) => {
    event.preventDefault();
    const result = checkDuplicate(newName);
    if (newName && !result) {
      setPersons(
        persons.concat({
          name: newName,
          number: newNumber,
        })
      );
    } else if (result) {
      alert(`${newName} is already added to the phonebook`);
    }
  };

  return (
    <div>
      <Title text="Phonebook" />
      <SearchFilter handleFilterChange={handleFilterChange} />
      <AddRecord
        handleNameChange={handleNameChange}
        handleNumberChange={handleNumberChange}
        addRecord={addRecord}
      />
      <Title text="Existing records" />
      <DisplayRecords persons={persons} filter={filterValue} />
    </div>
  );
};

export default App;
