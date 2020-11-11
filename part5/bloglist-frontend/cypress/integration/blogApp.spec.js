describe("Blog app", function () {
  let user, otherUser, blog;
  beforeEach(function () {
    cy.request("POST", "http://localhost:3001/api/testing/reset");

    user = {
      username: "jsmith",
      name: "John Smith",
      password: "mypassword",
    };
    otherUser = {
      username: "cjones",
      name: "Christine Jones",
      password: "anotherpassword",
    };
    blog = {
      title: "test blog",
      author: "test author",
      url: "test url",
    };

    cy.request("POST", "http://localhost:3001/api/users/", user);
    cy.request("POST", "http://localhost:3001/api/users/", otherUser);

    cy.visit("http://localhost:3000");
  });

  describe("before logging in", function () {
    it("login form is shown", function () {
      cy.contains("blogs");
      cy.contains("log in to application");
      cy.contains("Username");
      cy.contains("Password");
      cy.contains("login");
    });

    it("succeeds with correct creds", function () {
      cy.get("#username").type(user.username);
      cy.get("#password").type(user.password);
      cy.get("#login-button").click();
      cy.contains("jsmith logged in");
    });

    it("fails with wrong creds", function () {
      cy.get("#username").type(user.username);
      cy.get("#password").type("wrongpassword");
      cy.get("#login-button").click();
      cy.get("#notification")
        .should("contain", "wrong username or password")
        .and("have.css", "color", "rgb(255, 0, 0)");
      cy.get("html").should("not.contain", `${user.username} logged in`);
    });
  });

  describe("when logged in", function () {
    beforeEach(function () {
      cy.request("POST", "http://localhost:3001/api/login", {
        username: user.username,
        password: user.password,
      }).then((response) => {
        localStorage.setItem("loggedBlogUser", JSON.stringify(response.body));
        cy.visit("http://localhost:3000");
      });
    });

    it("it is successfully logged in", function () {
      cy.contains(`${user.username} logged in`);
    });

    it("a blog can be created", function () {
      cy.contains("new blog").click();
      cy.get("#title").type(blog.title);
      cy.get("#author").type(blog.author);
      cy.get("#url").type(blog.url);

      cy.get("#create-button").click();
      cy.get("#blogs")
        .should("contain", blog.title)
        .and("contain", blog.author);
    });
  });

  describe("when logged in and with a blog", function () {
    beforeEach(function () {
      let token;
      cy.request("POST", "http://localhost:3001/api/login", {
        username: user.username,
        password: user.password,
      })
        .then((response) => {
          token = response.body.token;
          localStorage.setItem("loggedBlogUser", JSON.stringify(response.body));
        })
        .then(() => {
          cy.request({
            method: "POST",
            url: "http://localhost:3001/api/blogs",
            body: blog,
            headers: { Authorization: `bearer ${token}` },
          });
          cy.visit("http://localhost:3000");
        });
    });

    it("the blog can be liked", function () {
      cy.contains("view").click();
      cy.get("#like-button").click();
      cy.contains("likes 1");
    });

    it("the blog can be deleted", function () {
      cy.contains("view").click();
      cy.get("#delete-button").click();
      cy.get("#blogs").should("not.contain", blog.title);
      cy.get("#notification").should(
        "contain",
        `Successfully removed blog "${blog.title}" by ${blog.author}`
      );
    });

    it("the blog cannot be deleted by another user", function () {
      localStorage.removeItem("loggedBlogUser");
      cy.request("POST", "http://localhost:3001/api/login", {
        username: otherUser.username,
        password: otherUser.password,
      }).then((response) => {
        localStorage.setItem("loggedBlogUser", JSON.stringify(response.body));
        cy.visit("http://localhost:3000");
      });
      cy.contains("view").click();
      cy.get(".JS__full-info-blog").should("not.contain", "remove");
    });

    it.only("the blogs are ordered by likes descending", function () {
      const token = JSON.parse(window.localStorage.getItem("loggedBlogUser"))
        .token;
      const blogs = [
        {
          ...blog,
          title: "more likes test blog",
          likes: 5,
        },
        blog,
      ];

      cy.request({
        method: "POST",
        url: "http://localhost:3001/api/blogs",
        body: blogs[0],
        headers: { Authorization: `bearer ${token}` },
      }).then(() => cy.reload());

      cy.get(".view-button").then(($btn) => {
        $btn.click();
      });

      cy.get(".blog").each((blog, idx) => {
        expect(blog).to.contain(blogs[idx].title);
      });
    });
  });
});
