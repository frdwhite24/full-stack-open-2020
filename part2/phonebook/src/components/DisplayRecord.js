import React from "react";

const DisplayRecord = ({ person }) => (
  <p>
    {person.name} - {person.number}
  </p>
);

export default DisplayRecord;
