import React, { useState, useEffect } from "react";
import DisplayRecords from "./components/DisplayRecords";
import Title from "./components/Title";
import AddRecord from "./components/AddRecord";
import SearchFilter from "./components/SearchFilter";
import personsServices from "./services/persons";
import Notification from "./components/Notification";

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [notification, setNotification] = useState(null);
  const [filterValue, setFilterValue] = useState("");

  useEffect(() => {
    personsServices.getAll().then((data) => setPersons(data));
  }, []);

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
    const record = persons.find((person) => person.id === id);
    if (window.confirm(`Do you really want to delete ${name}?`)) {
      personsServices
        .deleteRecord(id)
        .then((response) => {
          if (response.status === 200) {
            setPersons(persons.filter((person) => person.id !== id));
            setNotification({
              status: "success",
              message: `The record for ${record.name} has been deleted.`,
            });
            setTimeout(() => {
              setNotification(null);
            }, 3500);
          }
        })
        .catch((error) => {
          setNotification({
            status: "error",
            message: `The record for ${record.name} was already deleted from the server.`,
          });
          setTimeout(() => {
            setNotification(null);
          }, 3500);
        });
    }
  };

  const checkDuplicate = (name) => {
    return persons.find((person) => person.name === name);
  };

  const addUpdateRecord = (event) => {
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
          setNotification({
            status: "success",
            message: `${newName} has been added.`,
          });
          setTimeout(() => {
            setNotification(null);
          }, 3500);
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
          .then((data) => {
            setPersons(
              persons.map((person) => (person.id === data.id ? data : person))
            );
            setNotification({
              status: "success",
              message: `The number for ${data.name} has been updated to ${data.number}.`,
            });
            setTimeout(() => {
              setNotification(null);
            }, 3500);
          })
          .catch((error) => {
            setNotification({
              status: "error",
              message: `The data for ${duplicate.name} was already deleted from the server.`,
            });
            setTimeout(() => {
              setNotification(null);
            }, 3500);
          });
      }
    }
  };

  return (
    <div>
      <Title text="Phonebook" />
      <Notification message={notification} />
      <SearchFilter handleFilterChange={handleFilterChange} />
      <AddRecord
        handleNameChange={handleNameChange}
        handleNumberChange={handleNumberChange}
        addRecord={addUpdateRecord}
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
