const blogsRouter = require("express").Router();
const Blog = require("../models/blog");
const User = require("../models/user");

blogsRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({}).populate("user", { username: 1, name: 1 });
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

  const user = await User.find({});
  const firstUser = user[0];
  // const user = await User.findById(body.userId);

  if (!body.title || !body.url) {
    return response.status(400).end();
  }

  const blog = new Blog({
    url: body.url,
    author: body.author === undefined ? null : body.author,
    title: body.title,
    likes: body.likes === undefined ? 0 : body.likes,
    user: firstUser._id,
  });

  const savedBlog = await blog.save();

  firstUser.blogs = firstUser.blogs.concat(savedBlog._id);
  await firstUser.save();

  return response.status(201).json(savedBlog);
});

module.exports = blogsRouter;
