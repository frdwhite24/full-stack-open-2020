import React from "react";
import Blog from "./Blog";

const Blogs = ({ blogs, addLike, removeBlog }) => {
  return (
    <div>
      {blogs
        .sort((a, b) => {
          return b.likes - a.likes;
        })
        .map((blog) => (
          <Blog
            key={blog.id}
            blog={blog}
            addLike={addLike}
            removeBlog={removeBlog}
          />
        ))}
    </div>
  );
};

export default Blogs;
