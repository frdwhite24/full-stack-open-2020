import React from "react";
import Title from "./Title.js";

const AddRecord = ({ handleNameChange, handleNumberChange, addRecord }) => {
  return (
    <div>
      <Title text="Add a new record" />
      <form onSubmit={addRecord}>
        <div>
          name: <input onChange={handleNameChange} />
        </div>
        <div>
          number: <input onChange={handleNumberChange} />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
    </div>
  );
};

export default AddRecord;
