import React, { useState, useEffect, useRef } from "react";
import Login from "./components/Login";
import Notification from "./components/Notification";
import Blogs from "./components/Blogs";
import Create from "./components/Create";
import Togglable from "./components/Togglable";
import blogService from "./services/blogs";
import loginService from "./services/login";

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  const [notification, setNotification] = useState({});
  const newBlogFormRef = useRef();

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs));
  }, []);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedBlogUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      blogService.setToken(user.token);
      setUser(user);
    }
  }, []);

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const user = await loginService.login({ username, password });
      setUser(user);
      blogService.setToken(user.token);
      window.localStorage.setItem("loggedBlogUser", JSON.stringify(user));
      setUsername("");
      setPassword("");

      setNotification({
        status: "success",
        message: "successfully logged in",
      });
      setTimeout(() => {
        setNotification({});
      }, 3000);
    } catch (exception) {
      setNotification({
        status: "error",
        message: "wrong username or password",
      });
      setTimeout(() => {
        setNotification({});
      }, 3000);
      console.log(exception);
    }
  };

  const handleLogout = () => {
    window.localStorage.removeItem("loggedBlogUser");
    setUser(null);
    setNotification({
      status: "success",
      message: "successfully logged out",
    });
    setTimeout(() => {
      setNotification({});
    }, 3000);
  };

  const createNewBlog = async (newBlog) => {
    newBlogFormRef.current.toggleVisibility();

    const response = await blogService.create(newBlog);

    setNotification({
      status: "success",
      message: `a new blog ${newBlog.title} by ${newBlog.author}`,
    });
    setTimeout(() => {
      setNotification({});
    }, 5000);

    const updatedListBlogs = await blogService.getAll();

    setBlogs(updatedListBlogs);
  };

  const addLike = async (updatedBlog) => {
    await blogService.addLike(updatedBlog);

    setBlogs(
      blogs.map((blog) => {
        return {
          ...blog,
          likes: blog.id === updatedBlog.id ? blog.likes + 1 : blog.likes,
        };
      })
    );
  };

  return (
    <>
      <h2>blogs</h2>
      <Notification notification={notification} />
      {user === null && (
        <Login
          username={username}
          password={password}
          setUsername={setUsername}
          setPassword={setPassword}
          handleLogin={handleLogin}
        />
      )}
      {user !== null && (
        <>
          <span>{user.username} logged in </span>
          <button onClick={handleLogout}>logout</button>
          <Togglable buttonLabel="new note" ref={newBlogFormRef}>
            <Create createNewBlog={createNewBlog} />
          </Togglable>
          <Blogs user={user} blogs={blogs} addLike={addLike} />
        </>
      )}
    </>
  );
};

export default App;
