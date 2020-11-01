const supertest = require("supertest");
const mongoose = require("mongoose");
const helper = require("./test_helper");
const app = require("../app");
const api = supertest(app);
const Blog = require("../models/blog");

beforeEach(async () => {
  await Blog.deleteMany({});
  const blogObjects = helper.initialBlogs.map((newBlog) => {
    return new Blog(newBlog);
  });

  await Promise.all(blogObjects.map((blog) => blog.save()));
});

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

test("successfully add one blog", async () => {
  const newBlog = { title: "This is a new blog", url: "www.greatblog.com" };

  await api
    .post("/api/blogs")
    .send(newBlog)
    .expect(201)
    .expect("Content-Type", /application\/json/);

  const blogs = await helper.blogsInDB();
  expect(blogs).toHaveLength(helper.initialBlogs.length + 1);

  const blogTitles = blogs.map((blog) => blog.title);
  expect(blogTitles).toContain(newBlog.title);
});

test("no like attribute defaults to 0", async () => {
  const newBlog = { title: "This blog has no likes", url: "www.greatblog.com" };

  await api
    .post("/api/blogs")
    .send(newBlog)
    .expect(201)
    .expect("Content-Type", /application\/json/);

  const blogsAtEnd = await helper.blogsInDB();

  const addedBlog = blogsAtEnd.find((blog) => blog.title === newBlog.title);
  expect(addedBlog.title).toEqual(newBlog.title);

  expect(addedBlog.likes).toEqual(0);
});

test("no url and title bad request", async () => {
  const noUrlBlog = { title: "this blog has no url" };
  const noTitleBlog = { url: "www.fake-url.com" };

  await api.post("/api/blogs").send(noUrlBlog).expect(400);
  await api.post("/api/blogs").send(noTitleBlog).expect(400);

  const blogsAtEnd = await helper.blogsInDB();
  expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length);
});

afterAll(() => {
  mongoose.connection.close();
});
