describe("Blog app", function () {
  let user;
  beforeEach(function () {
    cy.request("POST", "http://localhost:3001/api/testing/reset");

    user = {
      username: "jsmith",
      name: "John Smith",
      password: "mypassword",
    };
    cy.request("POST", "http://localhost:3001/api/users/", user);

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
      cy.contains("wrong username or password")
        .should("contain", "wrong username or password")
        .and("have.css", "color", "rgb(255,0,0)");
      cy.get("html").should("not.contain", `${user.username} is logged in`);
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
      cy.contains(`${user.username} is logged in`);
    });
    //
  });
});
