const dummy = (blogs) => {
  return 1;
};

const totalLikes = (blogs) => {
  return blogs.reduce((total, blog) => {
    return total + blog.likes;
  }, 0);
};

const favouriteBlog = (blogs) => {
  let prevVal = 0;
  let mostLikes = {};
  blogs.forEach((blog) => {
    if (blog.likes > prevVal) {
      mostLikes = {
        likes: blog.likes,
        author: blog.author,
        title: blog.title,
      };

      prevVal = blog.likes;
    }
  });

  return mostLikes;
};

const mostBlogs = (blogs) => {
  if (blogs.length === 0) {
    return {};
  }

  let blogCounter = {};
  blogs.forEach((blog) => {
    blogCounter[blog.author] = (blogCounter[blog.author] || 0) + 1;
  });

  let mostBlogsAuthor;
  Object.keys(blogCounter).reduce((prevAuthor, author) => {
    mostBlogsAuthor =
      blogCounter[prevAuthor] > blogCounter[author] ? prevAuthor : author;
    return mostBlogsAuthor;
  });

  return {
    author: mostBlogsAuthor,
    blogs: blogCounter[mostBlogsAuthor],
  };
};

const mostLikes = (blogs) => {
  if (blogs.length === 0) {
    return {};
  }

  let likeCounter = {};
  blogs.forEach((blog) => {
    likeCounter[blog.author] = (likeCounter[blog.author] || 0) + blog.likes;
  });

  let mostLikesAuthor;
  Object.keys(likeCounter).reduce((prevAuthor, author) => {
    mostLikesAuthor =
      likeCounter[prevAuthor] > likeCounter[author] ? prevAuthor : author;
    return mostLikesAuthor;
  });

  return {
    author: mostLikesAuthor,
    likes: likeCounter[mostLikesAuthor],
  };
};

module.exports = {
  dummy,
  totalLikes,
  favouriteBlog,
  mostBlogs,
  mostLikes,
};
