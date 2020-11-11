import React from "react";

const Notification = ({ notification }) => {
  let colour;
  if (notification.status === "error") {
    colour = "red";
  } else if (notification.status === "success") {
    colour = "green";
  } else {
    colour = "black";
  }
  const notificationStyle = {
    border: `2px solid ${colour}`,
    borderRadius: "5px",
    color: colour,
    padding: "0 0 0 5px",
  };

  return (
    <>
      {notification.message && (
        <div id="notification" style={notificationStyle}>
          <p>{notification.message}</p>
        </div>
      )}
    </>
  );
};

export default Notification;
