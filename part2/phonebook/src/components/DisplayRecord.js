import React from "react";

const DisplayRecord = ({ person, handleDeleteRecord }) => (
  <div>
    <span>
      {person.name} - {person.number}
    </span>
    <button
      type="submit"
      onClick={() => handleDeleteRecord(person.id, person.name)}
    >
      delete
    </button>
  </div>
);

export default DisplayRecord;
