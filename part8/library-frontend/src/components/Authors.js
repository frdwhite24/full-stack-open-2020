import React, { useState, useEffect } from "react";
import Select from "react-select";
import { useQuery, useMutation } from "@apollo/client";
import { ALL_AUTHORS } from "../queries";
import { EDIT_AUTHOR } from "../mutations";

const Authors = ({ show }) => {
  const authorQuery = useQuery(ALL_AUTHORS);
  const [editAuthor] = useMutation(EDIT_AUTHOR);
  const [name, setName] = useState("");
  const [born, setBorn] = useState("");
  const [options, setOptions] = useState([]);

  useEffect(() => {
    const authorArray = authorQuery?.data?.allAuthors.map((author) => {
      return {
        value: author.name,
        label: author.name,
      };
    });
    setOptions(authorArray);
  }, [authorQuery]);

  if (!show) {
    return null;
  }

  if (authorQuery.loading) {
    return <div>loading...</div>;
  }

  if (!authorQuery.data) {
    return <div>No authors found, please add a book.</div>;
  }

  const handleSubmit = (event) => {
    event.preventDefault();

    editAuthor({ variables: { name: name.value, setBornTo: born } });

    setName("");
    setBorn("");
  };

  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>born</th>
            <th>books</th>
          </tr>
          {authorQuery.data.allAuthors.map((a) => (
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <h2>Set birthyear</h2>
      <form onSubmit={handleSubmit}>
        <Select value={name} onChange={setName} options={options} />
        <div>
          born
          <input
            value={born}
            onChange={({ target }) => setBorn(target.value)}
          />
        </div>
        <button type="submit">update author</button>
      </form>
    </div>
  );
};

export default Authors;
