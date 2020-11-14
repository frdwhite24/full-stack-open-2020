import React from "react";
import { useQuery } from "@apollo/client";
import { ALL_BOOKS } from "../queries";

const Books = ({ show }) => {
  const bookQuery = useQuery(ALL_BOOKS);

  if (!show) {
    return null;
  }

  if (bookQuery.loading) {
    return <div>loading...</div>;
  }

  if (!bookQuery.data) {
    return <div>No books found, please add one.</div>;
  }

  return (
    <div>
      <h2>books</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {bookQuery.data.allBooks.map((a) => (
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Books;
