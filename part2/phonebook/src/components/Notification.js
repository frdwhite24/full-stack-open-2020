import React from "react";

const Notification = ({ message }) => {
  if (message === null) {
    return null;
  }

  let colour;
  if (message.status === "success") {
    colour = "green";
  } else if (message.status === "error") {
    colour = "red";
  }

  const style = {
    color: colour,
    size: "17px",
    padding: "1em",
    border: `3px solid ${colour}`,
    borderRadius: "5px",
    margin: "1em",
  };

  return <div style={style}>{message.message}</div>;
};

export default Notification;
