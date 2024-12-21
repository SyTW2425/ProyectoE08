import request from "supertest";
import { expect } from "chai";
import app from "../appTest.js";
import { UserServices } from "../services/userServices.js";
import jwt from "jsonwebtoken";
import sinon from "sinon";

const userService = UserServices.getInstance();

describe("User Router Tests", () => {
  describe("GET /user", () => {
    it("should return user by name if the user exist", async () => {
      const res = await request(app).get("/user").query({ name: "User One" });
      expect(res.status).to.equal(200);
      expect(res.body).to.have.property("name", "User One");
    });
    it("should return 404 if user not found by name", async () => {
      const res = await request(app)
        .get("/user")
        .query({ name: "nonexistentUser" });
      expect(res.status).to.equal(404);
      expect(res.text).to.equal("El usuario no se encontró");
    });

    it("should return user by id", async () => {
      const res = await request(app)
        .get("/user")
        .query({ id: "7e1e6b3c-3e3a-46ac-a4ad-49ee65778517" });
      expect(res.status).to.equal(200);
      expect(res.body).to.have.property(
        "id",
        "7e1e6b3c-3e3a-46ac-a4ad-49ee65778517",
        "name",
        "User One"
      );
    });

    it("should return return 404 if user not found by id", async () => {
      const res = await request(app).get("/user").query({ id: "12345" });
      expect(res.status).to.equal(404);
    });

    it("should return user by email", async () => {
      const res = await request(app)
        .get("/user")
        .query({ email: "user2@example.com" });
      expect(res.status).to.equal(200);
      expect(res.body).to.have.property(
        "email",
        "user2@example.com",
        "name",
        "User Two"
      );
    });

    it("should return 404 if user not found by email", async () => {
      const res = await request(app)
        .get("/user")
        .query({ email: "test@example.com" });
      expect(res.status).to.equal(404);
    });

    it("should return 404 if user not found by name", async () => {
      const res = await request(app)
        .get("/user")
        .query({ name: "nonexistentUser" });
      expect(res.status).to.equal(404);
      expect(res.text).to.equal("El usuario no se encontró");
    });

    it("should return 404 if user not found by email", async () => {
      const res = await request(app)
        .get("/user")
        .query({ email: "nonexistent@example.com" });
      expect(res.status).to.equal(404);
      expect(res.text).to.equal("El email del usuario no se encontró");
    });

    it("should return 400 if no query parameters are provided", async () => {
      const res = await request(app).get("/user");
      expect(res.status).to.equal(400);
      expect(res.text).to.equal("No se proporcionó el nombre, id o email");
    });
  });

  describe("GET /user/all", () => {
    it("should return all users", async () => {
      const res = await request(app).get("/user/all");
      expect(res.status).to.equal(200);
      expect(res.body).to.be.an("array");
      expect(res.body.length).to.be.greaterThan(0);
    });

    it("should return 404 if no users found", async () => {
      // Simulate no users found by mocking the getAllUsers method
      const getAllUsersStub = sinon
        .stub(userService, "getAllUsers")
        .resolves(null);

      const res = await request(app).get("/user/all");
      expect(res.status).to.equal(404);
      expect(res.text).to.equal("No se encontraron usuarios");

      getAllUsersStub.restore();
    });
  });

  describe("GET /user/:id", () => {
    it("should return user by id if the token is valid and id matches", async () => {
      const token = jwt.sign(
        { userID: "7e1e6b3c-3e3a-46ac-a4ad-49ee65778517" },
        process.env.SECRET_KEY
      );
      const res = await request(app)
        .get("/user/7e1e6b3c-3e3a-46ac-a4ad-49ee65778517")
        .set("Authorization", `Bearer ${token}`);
      expect(res.status).to.equal(200);
      expect(res.body).to.have.property(
        "id",
        "7e1e6b3c-3e3a-46ac-a4ad-49ee65778517"
      );
    });

    it("should return 401 if no token is provided", async () => {
      const res = await request(app).get(
        "/user/7e1e6b3c-3e3a-46ac-a4ad-49ee65778517"
      );
      expect(res.status).to.equal(401);
      expect(res.text).to.equal("No autorizado");
    });

    it("should return 403 if token id does not match requested id", async () => {
      const token = jwt.sign(
        { userID: "different-id" },
        process.env.SECRET_KEY
      );
      const res = await request(app)
        .get("/user/7e1e6b3c-3e3a-46ac-a4ad-49ee65778517")
        .set("Authorization", `Bearer ${token}`);
      expect(res.status).to.equal(403);
      expect(res.text).to.equal(
        "No tienes permiso para acceder a esta informacion"
      );
    });

    it("should return 404 if user not found by id", async () => {
      const token = jwt.sign(
        { userID: "nonexistent-id" },
        process.env.SECRET_KEY
      );
      const res = await request(app)
        .get("/user/nonexistent-id")
        .set("Authorization", `Bearer ${token}`);
      expect(res.status).to.equal(404);
      expect(res.text).to.equal("El ID del usuario no se encontró");
    });

    it("should return 500 if there is an error with the token", async () => {
      const token = "invalid-token";
      const res = await request(app)
        .get("/user/7e1e6b3c-3e3a-46ac-a4ad-49ee65778517")
        .set("Authorization", `Bearer ${token}`);
      expect(res.status).to.equal(500);
    });
  });

  describe("POST /user", () => {
    it("should create a new user and return a token", async () => {
      const newUser = {
        username: "newUser",
        password: "password123",
        email: "newuser@example.com",
        avatarSrc: "avatar.png",
      };

      const res = await request(app).post("/user").send(newUser);

      expect(res.status).to.equal(200);
      expect(res.body).to.have.property("token");
      expect(res.body).to.have.property(
        "message",
        "Usario logeado correctamente"
      );
      expect(res.body).to.have.property("userID");
      expect(res.body).to.have.property("userName", "newUser");
      expect(res.body).to.have.property("userAvatar", "avatar.png");
    });

    it("should return 400 if username, password or email is missing", async () => {
      const res = await request(app)
        .post("/user")
        .send({ username: "newUser" });

      expect(res.status).to.equal(400);
      expect(res.text).to.equal(
        "No se proporcionó el nombre, contraseña o email"
      );
    });

    it("should return 500 if there is an error creating the user", async () => {
      const newUser = {
        username: "errorUser",
        password: "password123",
        email: "erroruser@example.com",
        avatarSrc: "avatar.png",
      };

      // Simulate an error by mocking the createUser method
      const createUserStub = sinon
        .stub(userService, "createUser")
        .rejects(new Error("Error creating user"));

      const res = await request(app).post("/user").send(newUser);

      expect(res.status).to.equal(500);
      expect(res.body).to.have.property("message", "Error creating user");

      createUserStub.restore();
    });
  });

  describe("POST /user/login", () => {
    it("should login a user and return a token", async () => {
      const loginUser = {
        username: "User One",
        password: "Password123!",
        avatarSrc: "avatar.png",
      };

      const res = await request(app).post("/user/login").send(loginUser);

      expect(res.status).to.equal(200);
      expect(res.body).to.have.property("token");
      expect(res.body).to.have.property(
        "message",
        "Usario logeado correctamente"
      );
      expect(res.body).to.have.property("userID");
      expect(res.body).to.have.property("userName");
      expect(res.body).to.have.property("userAvatar");
    });

    it("should return 400 if username or password is missing", async () => {
      const res = await request(app)
        .post("/user/login")
        .send({ username: "existingUser" });

      expect(res.status).to.equal(400);
      expect(res.text).to.equal("Could not login");
    });

    it("should return 400 if login fails", async () => {
      const loginUser = {
        username: "nonexistentUser",
        password: "wrongPassword",
        avatarSrc: "avatar.png",
      };

      // Simulate login failure by mocking the login method
      const loginStub = sinon
        .stub(userService, "login")
        .rejects(new Error("Could not login"));

      const res = await request(app).post("/user/login").send(loginUser);

      expect(res.status).to.equal(400);
      expect(res.text).to.equal("Could not login");

      loginStub.restore();
    });
  });

  describe("PATCH /user/stats", () => {
    it("should update user stats and return 200", async () => {
      const statsUpdate = {
        addGamesWon: 1,
        addGamesPlayed: 1,
        addWordsGuessed: 5,
        id: "7e1e6b3c-3e3a-46ac-a4ad-49ee65778517",
      };

      const res = await request(app).patch("/user/stats").send(statsUpdate);

      expect(res.status).to.equal(200);
      expect(res.text).to.equal("Estadisticas actualizadas");
    });

    it("should return 404 if stats update fails", async () => {
      const statsUpdate = {
        addGamesWon: 1,
        addGamesPlayed: 1,
        addWordsGuessed: 5,
        id: "nonexistent-id",
      };

      // Simulate stats update failure by mocking the sumStats method
      const sumStatsStub = sinon
        .stub(userService, "sumStats")
        .rejects(new Error("Could not update stats"));

      const res = await request(app).patch("/user/stats").send(statsUpdate);

      expect(res.status).to.equal(404);
      expect(res.text).to.equal("No se pudieron actualizar las estadisticas");

      sumStatsStub.restore();
    });

    it("should return 400 if required fields are missing", async () => {
      const statsUpdate = {
        addGamesWon: 1,
        addGamesPlayed: 1,
      };

      const res = await request(app).patch("/user/stats").send(statsUpdate);

      expect(res.status).to.equal(400);
    });
  });
  describe("PATCH /user/password", () => {
    it("should update user password and return 200", async () => {
      const res = await request(app)
        .patch("/user/password")
        .query({ name: "User One", password: "newPassword123" });

      expect(res.status).to.equal(200);
      expect(res.body).to.have.property("name", "User One");
    });

    it("should return 404 if user not found", async () => {
      const res = await request(app)
        .patch("/user/password")
        .query({ name: "nonexistentUser", password: "newPassword123" });

      expect(res.status).to.equal(500);
      expect(res.text).to.equal(
        "Error al intentar actualizar la contraseña o usuario no encontrado"
      );
    });

    it("should return 400 if required fields are missing", async () => {
      const res = await request(app)
        .patch("/user/password")
        .query({ name: "User One" });

      expect(res.status).to.equal(400);
      expect(res.text).to.equal("Los parametros no son correctos");
    });

    it("should return 500 if there is an error updating the password", async () => {
      const updateUserPasswordStub = sinon
        .stub(userService, "updateUserPassword")
        .rejects(new Error("Error updating password"));

      const res = await request(app)
        .patch("/user/password")
        .query({ name: "User One", password: "newPassword123" });

      expect(res.status).to.equal(500);
      expect(res.text).to.equal(
        "Error al intentar actualizar la contraseña o usuario no encontrado"
      );

      updateUserPasswordStub.restore();
    });
  });

  describe("PATCH /user/updateLogin", () => {
    it("should update the lastConnected date of the user and return 200", async () => {
      const userId = "7e1e6b3c-3e3a-46ac-a4ad-49ee65778517";

      // Mock the updateUserLastConnected method
      const updateUserLastConnectedStub = sinon
        .stub(userService, "updateUserLastConnected")
        .resolves({ id: userId, lastConnected: Date.now() });

      const res = await request(app)
        .patch("/user/updateLogin")
        .send({ id: userId });

      expect(res.status).to.equal(200);
      expect(res.text).to.equal("Fecha de última conexión actualizada");

      updateUserLastConnectedStub.restore();
    });

    it("should return 400 if no id is provided", async () => {
      const res = await request(app).patch("/user/updateLogin").send({});

      expect(res.status).to.equal(400);
      expect(res.text).to.equal("No se proporcionó el ID");
    });

    it("should return 500 if there is an error updating the lastConnected date", async () => {
      const userId = "7e1e6b3c-3e3a-46ac-a4ad-49ee65778517";

      // Mock the updateUserLastConnected method to throw an error
      const updateUserLastConnectedStub = sinon
        .stub(userService, "updateUserLastConnected")
        .rejects(new Error("Error updating last connected date"));

      const res = await request(app)
        .patch("/user/updateLogin")
        .send({ id: userId });

      expect(res.status).to.equal(500);
      expect(res.text).to.equal(
        "Error al intentar actualizar la fecha de última conexión"
      );

      updateUserLastConnectedStub.restore();
    });
  });

  describe("DELETE /user", () => {
    it("should delete user by name and return 200", async () => {
      const deleteUserByNameStub = sinon
        .stub(userService, "deleteUserByName")
        .resolves({ name: "User One" });

      const res = await request(app)
        .delete("/user")
        .query({ name: "User One" });

      expect(res.status).to.equal(200);
      expect(res.body).to.have.property("name", "User One");

      deleteUserByNameStub.restore();
    });

    it("should return 404 if user not found by name", async () => {
      const deleteUserByNameStub = sinon
        .stub(userService, "deleteUserByName")
        .resolves(null);

      const res = await request(app)
        .delete("/user")
        .query({ name: "nonexistentUser" });

      expect(res.status).to.equal(404);
      expect(res.text).to.equal("No se pudo eliminar el usuario por el nombre");

      deleteUserByNameStub.restore();
    });

    it("should delete user by id and return 200", async () => {
      const deleteUserStub = sinon
        .stub(userService, "deleteUser")
        .resolves({ id: "7e1e6b3c-3e3a-46ac-a4ad-49ee65778517" });

      const res = await request(app)
        .delete("/user")
        .query({ id: "7e1e6b3c-3e3a-46ac-a4ad-49ee65778517" });

      expect(res.status).to.equal(200);
      expect(res.body).to.have.property(
        "id",
        "7e1e6b3c-3e3a-46ac-a4ad-49ee65778517"
      );

      deleteUserStub.restore();
    });

    it("should return 404 if user not found by id", async () => {
      const deleteUserStub = sinon
        .stub(userService, "deleteUser")
        .resolves(null);

      const res = await request(app)
        .delete("/user")
        .query({ id: "nonexistent-id" });

      expect(res.status).to.equal(404);
      expect(res.text).to.equal("No se pudo eliminar el usuario por el ID");

      deleteUserStub.restore();
    });

    it("should delete user by email and return 200", async () => {
      const deleteUserByEmailStub = sinon
        .stub(userService, "deleteUserByEmail")
        .resolves({ email: "user2@example.com" });

      const res = await request(app)
        .delete("/user")
        .query({ email: "user2@example.com" });

      expect(res.status).to.equal(200);
      expect(res.body).to.have.property("email", "user2@example.com");

      deleteUserByEmailStub.restore();
    });

    it("should return 404 if user not found by email", async () => {
      const deleteUserByEmailStub = sinon
        .stub(userService, "deleteUserByEmail")
        .resolves(null);

      const res = await request(app)
        .delete("/user")
        .query({ email: "nonexistent@example.com" });

      expect(res.status).to.equal(404);
      expect(res.text).to.equal("No se pudo eliminar el usuario por el email");

      deleteUserByEmailStub.restore();
    });

    it("should return 400 if no query parameters are provided", async () => {
      const res = await request(app).delete("/user");

      expect(res.status).to.equal(400);
      expect(res.text).to.equal("No se proporcionó el nombre, id o email");
    });

    it("should return 500 if there is an error deleting the user by name", async () => {
      const deleteUserByNameStub = sinon
        .stub(userService, "deleteUserByName")
        .rejects(new Error("Error deleting user by name"));

      const res = await request(app)
        .delete("/user")
        .query({ name: "User One" });

      expect(res.status).to.equal(500);
      expect(res.text).to.equal(
        "Error al intentar eliminar el usuario por nombre"
      );

      deleteUserByNameStub.restore();
    });

    it("should return 500 if there is an error deleting the user by id", async () => {
      const deleteUserStub = sinon
        .stub(userService, "deleteUser")
        .rejects(new Error("Error deleting user by id"));

      const res = await request(app)
        .delete("/user")
        .query({ id: "7e1e6b3c-3e3a-46ac-a4ad-49ee65778517" });

      expect(res.status).to.equal(500);
      expect(res.text).to.equal("Error al intentar eliminar el usuario por ID");

      deleteUserStub.restore();
    });

    it("should return 500 if there is an error deleting the user by email", async () => {
      const deleteUserByEmailStub = sinon
        .stub(userService, "deleteUserByEmail")
        .rejects(new Error("Error deleting user by email"));

      const res = await request(app)
        .delete("/user")
        .query({ email: "user2@example.com" });

      expect(res.status).to.equal(500);
      expect(res.text).to.equal(
        "Error al intentar eliminar el usuario por email"
      );

      deleteUserByEmailStub.restore();
    });
  });
});
