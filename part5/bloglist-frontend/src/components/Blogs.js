import React from "react";
import Blog from "./Blog";

const Blogs = ({ user, blogs, addLike, removeBlog }) => {
  return (
    <div id="blogs">
      {blogs
        .sort((a, b) => {
          return b.likes - a.likes;
        })
        .map((blog) => (
          <Blog
            user={user}
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
