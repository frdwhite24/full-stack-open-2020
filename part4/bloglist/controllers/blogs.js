const blogsRouter = require("express").Router();
const Blog = require("../models/blog");

blogsRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({});
  return response.json(blogs);
});

blogsRouter.put("/:id", async (request, response) => {
  const blog = request.body;

  const newBlog = await Blog.findByIdAndUpdate(request.params.id, blog, {
    new: true,
  });

  return response.status(200).json(newBlog);
});

blogsRouter.delete("/:id", async (request, response) => {
  await Blog.findByIdAndRemove(request.params.id);
  return response.status(204).end();
});

blogsRouter.post("/", async (request, response) => {
  const body = request.body;

  if (!body.title || !body.url) {
    return response.status(400).end();
  }

  const blog = new Blog(body);
  const result = await blog.save();
  return response.status(201).json(result);
});

module.exports = blogsRouter;
