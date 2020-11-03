const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const User = require("../models/user");
const helper = require("./testHelper");
const bcrypt = require("bcrypt");

const api = supertest(app);

describe("when there is initially one user in db", () => {
  beforeEach(async () => {
    await User.deleteMany({});

    const passwordHash = await bcrypt.hash("helloworld", 10);
    const user = new User({ username: "root", passwordHash });

    await user.save();
  });

  test("creation succeeds with a fresh username", async () => {
    const usersAtStart = await helper.usersInDB();

    const newUser = {
      name: "Fred White",
      username: "fw",
      password: "thisisastrongpassword",
    };

    await api
      .post("/api/users")
      .send(newUser)
      .expect(200)
      .expect("Content-Type", /application\/json/);

    const usersAtEnd = await helper.usersInDB();
    const usernames = usersAtEnd.map((user) => user.username);

    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1);
    expect(usernames).toContain(newUser.username);
  });

  test("duplicate username is not created", async () => {
    const usersAtStart = await helper.usersInDB();
    const firstUser = usersAtStart[0];

    const newUser = {
      name: "John Smith",
      username: firstUser.username,
      password: "anotherstrongpassword",
    };

    const response = await api
      .post("/api/users")
      .send(newUser)
      .expect(400)
      .expect("Content-Type", /application\/json/);

    expect(response.body.error).toContain("`username` to be unique");
  });

  test("invalid username or password is not created", async () => {
    const usersAtStart = await helper.usersInDB();

    const badUsername = {
      username: "he",
      password: "longenoughpassword",
    };
    const badPassword = {
      username: "henry",
      password: "sh",
    };

    const firstResponse = await api
      .post("/api/users")
      .send(badUsername)
      .expect(400)
      .expect("Content-Type", /application\/json/);

    const secondResponse = await api
      .post("/api/users")
      .send(badPassword)
      .expect(400)
      .expect("Content-Type", /application\/json/);

    expect(firstResponse.body.error).toContain(
      "username and password must be at least 3 characters long"
    );
    expect(secondResponse.body.error).toContain(
      "username and password must be at least 3 characters long"
    );

    const usersAtEnd = await helper.usersInDB();
    expect(usersAtEnd).toHaveLength(usersAtStart.length);
  });
});

afterAll(() => {
  mongoose.connection.close();
});
