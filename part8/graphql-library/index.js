const { ApolloServer, gql } = require("apollo-server");
const mongoose = require("mongoose");
const Author = require("./models/author");
const Book = require("./models/book");
const { MONGODB_URI } = require("./utils/config");

console.log("connecting to", MONGODB_URI);

mongoose
  .connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })
  .then(() => {
    console.log("connected to MongoDB");
  })
  .catch((error) => {
    console.log("error connecting to MongoDB", error.message);
  });

const typeDefs = gql`
  type Book {
    title: String!
    published: Int!
    author: Author!
    genres: [String!]!
    id: ID!
  }

  type Author {
    name: String!
    bookCount: Int!
    born: String
    id: ID!
  }

  type Query {
    bookCount: Int!
    authorCount: Int!
    allBooks(author: String, genre: String): [Book!]!
    allAuthors: [Author!]!
  }

  type Mutation {
    addBook(
      title: String!
      author: ID!
      published: String!
      genres: [String!]!
    ): Book
    editAuthor(name: String!, setBornTo: String!): Author
  }
`;

const resolvers = {
  Query: {
    bookCount: () => Book.collection.countDocuments(),
    authorCount: () => Author.collection.countDocuments(),
    allBooks: (root, args) => {
      if (Object.entries(args).length === 0) {
        return Book.find({}).populate("author", {
          name: 1,
          bookCount: 1,
          born: 1,
        });
      }
      // } else if (args.author && !args.genre) {
      //   return books.filter((book) => book.author === args.author);
      // } else if (args.genre && !args.author) {
      //   return books.filter((book) => book.genres.includes(args.genre));
      // } else {
      //   return books.filter(
      //     (book) =>
      //       book.genres.includes(args.genre) && book.author === args.author
      //   );
      // }
    },
    allAuthors: () => Author.find({}),
  },
  Mutation: {
    addBook: async (root, args) => {
      const findAuthor = await Author.find({ name: args.author });

      let author;
      if (findAuthor.length === 0) {
        const authorObj = new Author({
          name: args.author,
        });
        newAuthor = await authorObj.save();
        author = newAuthor;
      } else {
        author = findAuthor[0];
      }

      book = new Book({
        ...args,
        author,
      });

      return book.save();
    },
    editAuthor: (root, args) => {
      const authorToUpdate = authors.find(
        (author) => author.name === args.name
      );
      if (!authorToUpdate) {
        return null;
      }

      const updatedAuthor = { ...authorToUpdate, born: args.setBornTo };
      authors = authors.map((author) =>
        author.name === args.name ? updatedAuthor : author
      );
      return updatedAuthor;
    },
  },
  Author: {
    bookCount: async (root) => {
      const books = await Book.find({ author: root.id });
      return books.length;
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`);
});
