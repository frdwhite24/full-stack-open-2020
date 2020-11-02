const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const api = supertest(app);
const Blog = require("../models/blog");
const helper = require("./testHelper");

beforeEach(async () => {
  await Blog.deleteMany({});

  const blogObjects = helper.initialBlogs.map((newBlog) => {
    return new Blog(newBlog);
  });
  const promiseArray = blogObjects.map((blog) => blog.save());

  await Promise.all(promiseArray);
});

describe("when there is initially some notes saved", () => {
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
      .send(newBlog)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const blogs = await helper.blogsInDB();
    expect(blogs).toHaveLength(helper.initialBlogs.length + 1);

    const blogTitles = blogs.map((blog) => blog.title);
    expect(blogTitles).toContain(newBlog.title);
  });

  test("defaults to 0 likes with missing data", async () => {
    const newBlog = {
      title: "This blog has no likes",
      url: "www.greatblog.com",
    };

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

  test("fails with status code 400 if data is invalid", async () => {
    const noUrlBlog = { title: "this blog has no url" };
    const noTitleBlog = { url: "www.fake-url.com" };

    await api.post("/api/blogs").send(noUrlBlog).expect(400);
    await api.post("/api/blogs").send(noTitleBlog).expect(400);

    const blogsAtEnd = await helper.blogsInDB();
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length);
  });
});

describe("deletion of a note", () => {
  test("succeeds with status code 200 if id is valid", async () => {
    const blogsAtStart = await api.get("/api/blogs");
    const blogToDelete = blogsAtStart.body[0];

    await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204);

    const blogsAtEnd = await helper.blogsInDB();
    const blogTitles = blogsAtEnd.map((blog) => blog.title);

    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length - 1);
    expect(blogTitles).not.toContain(blogToDelete.title);
  });
});

describe("updating a note", () => {
  test("succeeds with status code 200 if id is valid", async () => {
    const blogsAtStart = await api.get("/api/blogs");
    const blogToUpdate = blogsAtStart.body[0];

    const updatedBlog = {
      ...blogToUpdate,
      likes: blogToUpdate.likes + 100,
      author: "Fred White",
    };

    const response = await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(updatedBlog)
      .expect(200);

    expect(response.body.likes).toEqual(blogToUpdate.likes + 100);
    expect(response.body.author).toEqual(updatedBlog.author);
  });
});

afterAll(() => {
  mongoose.connection.close();
});
