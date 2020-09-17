import React from "react";
import DisplayRecord from "./DisplayRecord";

const DisplayRecords = ({ persons, filter }) => {
  if (filter !== "") {
    const filteredPersons = persons.filter((person) =>
      person.name.toLowerCase().includes(filter.toLowerCase())
    );
    return filteredPersons.map((person) => (
      <div key={person.name}>
        <DisplayRecord person={person} />
      </div>
    ));
  }
  return persons.map((person) => (
    <div key={person.name}>
      <DisplayRecord person={person} />
    </div>
  ));
};

export default DisplayRecords;
