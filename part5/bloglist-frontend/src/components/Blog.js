import React, { useState } from "react";

const Blog = ({ user, blog, addLike, removeBlog }) => {
  const [information, setInformation] = useState(false);
  const blogStyle = {
    border: "1px solid black",
    margin: "5px",
    padding: "10px 5px 10px 5px",
  };

  const toggleInformation = () => setInformation(!information);

  return (
    <div className="blog">
      {!information ? (
        <div style={blogStyle} className="JS__no-info-blog">
          <span>
            {blog.title} {blog.author}
          </span>
          <button className="view-button" onClick={toggleInformation}>
            view
          </button>
        </div>
      ) : (
        <div style={blogStyle} className="JS__full-info-blog">
          {blog.title} {blog.author}
          <button onClick={toggleInformation}>hide</button>
          {blog?.url && <p>{blog.url}</p>}
          <span className="number-likes">likes {blog.likes} </span>
          <button
            id="like-button"
            onClick={() =>
              addLike({
                ...blog,
                likes: blog.likes + 1,
                user: blog.user.id,
              })
            }
          >
            like
          </button>
          {blog?.user?.username && <p>{blog.user.username}</p>}
          {user?.username === blog?.user?.username && (
            <button id="delete-button" onClick={() => removeBlog(blog)}>
              remove
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default Blog;
