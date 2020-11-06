const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const Blog = require("../models/blog");
const User = require("../models/user");
const helper = require("./testHelper");
const bcrypt = require("bcrypt");

const api = supertest(app);
let authHeaderVal;

beforeEach(async () => {
  await Blog.deleteMany({});
  await User.deleteMany({});

  const newUser = { username: "root", password: "strongpassword" };
  const passwordHash = await bcrypt.hash(newUser.password, 10);
  const user = new User({ username: newUser.username, passwordHash });
  const savedUser = await user.save();

  const response = await api.post("/api/login").send(newUser);
  authHeaderVal = `bearer ${response.body.token}`;

  const blogObjects = helper.initialBlogs.map((newBlog) => {
    newBlog.user = savedUser._id;
    return new Blog(newBlog);
  });
  const promiseArray = blogObjects.map((blog) => blog.save());

  await Promise.all(promiseArray);
});

describe("when there is initially some blogs saved", () => {
  test("blogs are returned as json", async () => {
    await api
      .get("/api/blogs")
      .expect(200)
      .expect("Content-Type", /application\/json/);
  });

  test("all blogs are returned", async () => {
    const response = await api.get("/api/blogs");
    expect(response.body).toHaveLength(helper.initialBlogs.length);
  });

  test("id attribute exists", async () => {
    const response = await api.get("/api/blogs").expect(200);
    response.body.forEach((blog) => expect(blog.id).toBeDefined());
  });
});

describe("addition of a new blog", () => {
  test("succeeds with valid data", async () => {
    const newBlog = { title: "This is a new blog", url: "www.greatblog.com" };

    await api
      .post("/api/blogs")
      .set("Authorization", authHeaderVal)
      .send(newBlog)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const blogs = await helper.blogsInDB();
    expect(blogs).toHaveLength(helper.initialBlogs.length + 1);

    const blogTitles = blogs.map((blog) => blog.title);
    expect(blogTitles).toContain(newBlog.title);
  });

  test("fails with status code 401 if no token provided", async () => {
    const newBlog = { title: "This is a new blog", url: "www.greatblog.com" };

    await api
      .post("/api/blogs")
      .send(newBlog)
      .expect(401)
      .expect("Content-Type", /application\/json/);

  });

  test("defaults to 0 likes with missing data", async () => {
    const newBlog = {
      title: "This blog has no likes",
      url: "www.greatblog.com",
    };

    await api
      .post("/api/blogs")
      .set("Authorization", authHeaderVal)
      .send(newBlog)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const blogsAtEnd = await helper.blogsInDB();

    const addedBlog = blogsAtEnd.find((blog) => blog.title === newBlog.title);
    expect(addedBlog.title).toEqual(newBlog.title);

    expect(addedBlog.likes).toEqual(0);
  });

  test("fails with status code 400 if data is invalid", async () => {
    const noUrlBlog = { title: "this blog has no url" };
    const noTitleBlog = { url: "www.fake-url.com" };

    await api
      .post("/api/blogs")
      .set("Authorization", authHeaderVal)
      .send(noUrlBlog)
      .expect(400);
    await api
      .post("/api/blogs")
      .set("Authorization", authHeaderVal)
      .send(noTitleBlog)
      .expect(400);

    const blogsAtEnd = await helper.blogsInDB();
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length);
  });
});

describe("deletion of a blog", () => {
  test("succeeds with status code 204 if id is valid", async () => {
    const blogsAtStart = await api.get("/api/blogs");
    const blogToDelete = blogsAtStart.body[0];

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set("Authorization", authHeaderVal)
      .expect(204);

    const blogsAtEnd = await helper.blogsInDB();
    const blogTitles = blogsAtEnd.map((blog) => blog.title);

    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length - 1);
    expect(blogTitles).not.toContain(blogToDelete.title);
  });
});

describe("updating a blog", () => {
  test("succeeds with status code 200 if id is valid", async () => {
    const blogsAtStart = await api.get("/api/blogs");
    const blogToUpdate = blogsAtStart.body[0];

    const updatedBlog = {
      ...blogToUpdate,
      user: blogToUpdate.user.id,
      likes: blogToUpdate.likes + 100,
      author: "Fred White",
    };

    const response = await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .set("Authorization", authHeaderVal)
      .send(updatedBlog)
      .expect(200);

    expect(response.body.likes).toEqual(blogToUpdate.likes + 100);
    expect(response.body.author).toEqual(updatedBlog.author);
  });
});

afterAll(() => {
  mongoose.connection.close();
});
