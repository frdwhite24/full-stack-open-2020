import React, { useState } from "react";

const Blog = ({ blog, addLike, removeBlog }) => {
  const [information, setInformation] = useState(false);
  const baseStyle = {
    border: "1px solid black",
    margin: "5px",
    padding: "10px 5px 10px 5px",
  };
  const hideWhenInformation = {
    ...baseStyle,
    display: information ? "none" : "",
  };
  const showWhenInformation = {
    ...baseStyle,
    display: information ? "" : "none",
  };

  const toggleInformation = () => setInformation(!information);

  const handleAddLike = () => {
    addLike({ ...blog, likes: blog.likes + 1, user: blog.user.id });
  };

  const handleRemoveBlog = () => {
    removeBlog(blog);
  };

  return (
    <>
      <div style={hideWhenInformation}>
        <span>
          {blog.title} {blog.author}
        </span>
        <button onClick={toggleInformation}>view</button>
      </div>
      <div style={showWhenInformation}>
        {blog.title} {blog.author}
        <button onClick={toggleInformation}>hide</button>
        <p>{blog.url}</p>
        <span>likes {blog.likes} </span>
        <button onClick={handleAddLike}>like</button>
        <p>{blog.user.username}</p>
        <button onClick={handleRemoveBlog}>remove</button>
      </div>
    </>
  );
};

export default Blog;
