const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const Blog = require("../models/blog");
const helper = require("./test_helper");
const api = supertest(app);

beforeEach(async () => {
  await Blog.deleteMany({});
  helper.initialBlogs.map(async (newBlog) => {
    let blogObject = new Blog(newBlog);
    await blogObject.save();
  });
});

test("blogs are returned as json", async () => {
  await api
    .get("/api/blogs")
    .expect(200)
    .expect("Content-Type", /application\/json/);
});

test("id attribute exists", async () => {
  const response = await api.get("/api/blogs").expect(200);

  response.body.forEach((blog) => expect(blog.id).toBeDefined());
});

afterAll(() => {
  mongoose.connection.close();
});
