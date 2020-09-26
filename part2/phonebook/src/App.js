import React, { useState } from "react";
import DisplayRecords from "./components/DisplayRecords";
import Title from "./components/Title";
import AddRecord from "./components/AddRecord";
import SearchFilter from "./components/SearchFilter";
import personsServices from "./services/persons";

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [filterValue, setFilterValue] = useState("");

  personsServices.getAll().then((data) => setPersons(data));

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value);
  };

  const handleNameChange = (event) => {
    setNewName(event.target.value);
  };

  const handleFilterChange = (event) => {
    setFilterValue(event.target.value);
  };

  const handleDeleteRecord = (id, name) => {
    if (window.confirm(`Do you really want to delete ${name}?`)) {
      personsServices.deleteRecord(id).then((response) => {
        if (response.status === 200) {
          setPersons(persons.filter((person) => person.id !== id));
        }
      });
    }
  };

  const checkDuplicate = (name) => {
    return persons.find((person) => person.name === name);
  };

  const addRecord = (event) => {
    event.preventDefault();
    const duplicate = checkDuplicate(newName);
    if (newName && !duplicate) {
      personsServices
        .addNew({
          name: newName,
          number: newNumber,
        })
        .then((newRecord) => {
          setPersons(persons.concat(newRecord));
        });
    } else if (duplicate) {
      if (
        window.confirm(
          `${newName} is already in the phonebook, replace the old number with a new one?`
        )
      ) {
        personsServices
          .updateNumber(duplicate.id, {
            ...duplicate,
            number: newNumber,
          })
          .then((data) =>
            setPersons(
              persons.map((person) => (person.id === data.id ? data : person))
            )
          );
      }
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
      <DisplayRecords
        persons={persons}
        filter={filterValue}
        handleDeleteRecord={handleDeleteRecord}
      />
    </div>
  );
};

export default App;
