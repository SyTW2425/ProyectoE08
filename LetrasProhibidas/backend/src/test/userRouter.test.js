import request from "supertest";
import { expect } from "chai";
import sinon from "sinon";
import app from "../appTest.js";
import { UserServices } from "../services/userServices.js";

describe("User Router Tests", () => {
  let userServiceInstance;

  beforeEach(() => {
    userServiceInstance = UserServices.getInstance();

    sinon.stub(userServiceInstance, "getUserByName");
    sinon.stub(userServiceInstance, "getUserById");
    sinon.stub(userServiceInstance, "getUserByEmail");
    sinon.stub(userServiceInstance, "getAllUsers");
    sinon.stub(userServiceInstance, "createUser");
    sinon.stub(userServiceInstance, "deleteUserByName");
    sinon.stub(userServiceInstance, "deleteUser");
    sinon.stub(userServiceInstance, "deleteUserByEmail");
    sinon.stub(userServiceInstance, "deleteUserByMongoId");
    sinon.stub(userServiceInstance, "updateUserPassword");
    sinon.stub(userServiceInstance, "updateUserLastConnected");
    sinon.stub(userServiceInstance, "login");
  });

  afterEach(() => {
    sinon.restore();
  });

  describe("GET /user", () => {
    it("should return 400 if no name, id, or email is provided", async () => {
      const res = await request(app).get("/user");

      expect(res.status).to.equal(400);
      expect(res.text).to.equal("No se proporcionó el nombre, id o email");
    });

    it("should return 200 with user details by name", async () => {
      const mockUser = {
        name: "testUser",
        id: "user123",
        email: "test@example.com",
      };
      userServiceInstance.getUserByName.resolves(mockUser);

      const res = await request(app).get("/user").query({ name: "testUser" });

      expect(res.status).to.equal(200);
      expect(res.body).to.deep.equal(mockUser);
    });

    it("should return 404 if user is not found by name", async () => {
      userServiceInstance.getUserByName.resolves(null);

      const res = await request(app).get("/user").query({ name: "testUser" });

      expect(res.status).to.equal(404);
      expect(res.text).to.equal("El usuario no se encontró");
    });

    it("should return 500 if an error occurs while getting user by name", async () => {
      userServiceInstance.getUserByName.rejects(new Error("Database error"));

      const res = await request(app).get("/user").query({ name: "testUser" });

      expect(res.status).to.equal(500);
      expect(res.text).to.equal(
        "Error al intentar obtener el usuario por su nombre"
      );
    });

    it("should return 200 with user details by id", async () => {
      const mockUser = {
        name: "testUser",
        id: "user123",
        email: "test@example.com",
      };
      userServiceInstance.getUserById.resolves(mockUser);

      const res = await request(app).get("/user").query({ id: "user123" });

      expect(res.status).to.equal(200);
      expect(res.body).to.deep.equal(mockUser);
    });

    it("should return 404 if user is not found by id", async () => {
      userServiceInstance.getUserById.resolves(null);

      const res = await request(app).get("/user").query({ id: "user123" });

      expect(res.status).to.equal(404);
      expect(res.text).to.equal("El ID del usuario no se encontró");
    });

    it("should return 500 if an error occurs while getting user by id", async () => {
      userServiceInstance.getUserById.rejects(new Error("Database error"));

      const res = await request(app).get("/user").query({ id: "user123" });

      expect(res.status).to.equal(500);
      expect(res.text).to.equal(
        "Error al intentar obtener el usuario por su ID"
      );
    });

    it("should return 200 with user details by email", async () => {
      const mockUser = {
        name: "testUser",
        id: "user123",
        email: "test@example.com",
      };
      userServiceInstance.getUserByEmail.resolves(mockUser);

      const res = await request(app)
        .get("/user")
        .query({ email: "test@example.com" });

      expect(res.status).to.equal(200);
      expect(res.body).to.deep.equal(mockUser);
    });

    it("should return 404 if user is not found by email", async () => {
      userServiceInstance.getUserByEmail.resolves(null);

      const res = await request(app)
        .get("/user")
        .query({ email: "test@example.com" });

      expect(res.status).to.equal(404);
      expect(res.text).to.equal("El email del usuario no se encontró");
    });

    it("should return 500 if an error occurs while getting user by email", async () => {
      userServiceInstance.getUserByEmail.rejects(new Error("Database error"));

      const res = await request(app)
        .get("/user")
        .query({ email: "test@example.com" });

      expect(res.status).to.equal(500);
      expect(res.text).to.equal(
        "Error al intentar obtener el usuario por su email"
      );
    });
  });

  describe("GET /user/all", () => {
    it("should return 200 with all users", async () => {
      const mockUsers = [{ name: "testUser1" }, { name: "testUser2" }];
      userServiceInstance.getAllUsers.resolves(mockUsers);

      const res = await request(app).get("/user/all");

      expect(res.status).to.equal(200);
      expect(res.body).to.deep.equal(mockUsers);
    });

    it("should return 404 if no users are found", async () => {
      userServiceInstance.getAllUsers.resolves(null);

      const res = await request(app).get("/user/all");

      expect(res.status).to.equal(404);
      expect(res.text).to.equal("No se encontraron usuarios");
    });

    it("should return 500 if an error occurs while getting all users", async () => {
      userServiceInstance.getAllUsers.rejects(new Error("Database error"));

      const res = await request(app).get("/user/all");

      expect(res.status).to.equal(500);
      expect(res.text).to.equal("Error al intentar obtener todos los usuarios");
    });
  });

  describe("POST /user", () => {
    it("should return 400 if required parameters are missing", async () => {
      const res = await request(app).post("/user").send({});

      expect(res.status).to.equal(400);
      expect(res.text).to.equal(
        "No se proporcionó el nombre, contraseña o email"
      );
    });

    it("should return 200 with created user", async () => {
      userServiceInstance.createUser.resolves({
        token: "token123",
        id: "user123",
      });

      const res = await request(app).post("/user").send({
        name: "testUser",
        password: "password",
        email: "test@example.com",
      });

      expect(res.status).to.equal(200);
      expect(res.text).to.equal("Usuario creado correctamente");
    });

    it("should return 500 if an error occurs while creating user", async () => {
      userServiceInstance.createUser.rejects(new Error("Database error"));

      const res = await request(app).post("/user").send({
        name: "testUser",
        password: "password",
        email: "test@example.com",
      });

      expect(res.status).to.equal(500);
      expect(res.text).to.equal("Error al intentar crear el usuario");
    });
  });

  describe("DELETE /user", () => {
    it("should return 400 if no name, id, or email is provided", async () => {
      const res = await request(app).delete("/user");

      expect(res.status).to.equal(400);
      expect(res.text).to.equal("No se proporcionó el nombre, id o email");
    });

    it("should return 200 with deleted user by name", async () => {
      userServiceInstance.deleteUserByName.resolves({ name: "testUser" });

      const res = await request(app)
        .delete("/user")
        .query({ name: "testUser" });

      expect(res.status).to.equal(200);
      expect(res.body).to.deep.equal({ name: "testUser" });
    });

    it("should return 404 if user is not found by name", async () => {
      userServiceInstance.deleteUserByName.resolves(null);

      const res = await request(app)
        .delete("/user")
        .query({ name: "testUser" });

      expect(res.status).to.equal(404);
      expect(res.text).to.equal("No se pudo eliminar el usuario por el nombre");
    });

    it("should return 500 if an error occurs while deleting user by name", async () => {
      userServiceInstance.deleteUserByName.rejects(new Error("Database error"));

      const res = await request(app)
        .delete("/user")
        .query({ name: "testUser" });

      expect(res.status).to.equal(500);
      expect(res.text).to.equal(
        "Error al intentar eliminar el usuario por nombre"
      );
    });

    it("should return 200 with deleted user by id", async () => {
      userServiceInstance.deleteUser.resolves({ id: "user123" });

      const res = await request(app).delete("/user").query({ id: "user123" });

      expect(res.status).to.equal(200);
      expect(res.body).to.deep.equal({ id: "user123" });
    });

    it("should return 404 if user is not found by id", async () => {
      userServiceInstance.deleteUser.resolves(null);

      const res = await request(app).delete("/user").query({ id: "user123" });

      expect(res.status).to.equal(404);
      expect(res.text).to.equal("No se pudo eliminar el usuario por el ID");
    });

    it("should return 500 if an error occurs while deleting user by id", async () => {
      userServiceInstance.deleteUser.rejects(new Error("Database error"));

      const res = await request(app).delete("/user").query({ id: "user123" });

      expect(res.status).to.equal(500);
      expect(res.text).to.equal("Error al intentar eliminar el usuario por ID");
    });

    it("should return 200 with deleted user by email", async () => {
      userServiceInstance.deleteUserByEmail.resolves({
        email: "test@example.com",
      });

      const res = await request(app)
        .delete("/user")
        .query({ email: "test@example.com" });

      expect(res.status).to.equal(200);
      expect(res.body).to.deep.equal({ email: "test@example.com" });
    });

    it("should return 404 if user is not found by email", async () => {
      userServiceInstance.deleteUserByEmail.resolves(null);

      const res = await request(app)
        .delete("/user")
        .query({ email: "test@example.com" });

      expect(res.status).to.equal(404);
      expect(res.text).to.equal("No se pudo eliminar el usuario por el email");
    });

    it("should return 500 if an error occurs while deleting user by email", async () => {
      userServiceInstance.deleteUserByEmail.rejects(
        new Error("Database error")
      );

      const res = await request(app)
        .delete("/user")
        .query({ email: "test@example.com" });

      expect(res.status).to.equal(500);
      expect(res.text).to.equal(
        "Error al intentar eliminar el usuario por email"
      );
    });
  });

  describe("DELETE /user/:id", () => {
    it("should return 200 with deleted user by Mongo ID", async () => {
      userServiceInstance.deleteUserByMongoId.resolves({ id: "user123" });

      const res = await request(app).delete("/user/user123");

      expect(res.status).to.equal(200);
      expect(res.body).to.deep.equal({ id: "user123" });
    });

    it("should return 404 if user is not found by Mongo ID", async () => {
      userServiceInstance.deleteUserByMongoId.resolves(null);

      const res = await request(app).delete("/user/user123");

      expect(res.status).to.equal(404);
      expect(res.text).to.equal(
        "No se pudo eliminar el usuario por su ID de MongoDB"
      );
    });

    it("should return 500 if an error occurs while deleting user by Mongo ID", async () => {
      userServiceInstance.deleteUserByMongoId.rejects(
        new Error("Database error")
      );

      const res = await request(app).delete("/user/user123");

      expect(res.status).to.equal(500);
      expect(res.text).to.equal(
        "Error al intentar eliminar el usuario por su ID de MongoDB"
      );
    });
  });

  describe("PATCH /user", () => {
    it("should return 400 if required parameters are missing", async () => {
      const res = await request(app).patch("/user").send({});

      expect(res.status).to.equal(400);
      expect(res.text).to.equal("Los parametros no son correctos");
    });

    it("should return 200 with updated user password", async () => {
      userServiceInstance.updateUserPassword.resolves({ name: "testUser" });

      const res = await request(app)
        .patch("/user")
        .query({ name: "testUser", password: "newPassword" });

      expect(res.status).to.equal(200);
      expect(res.body).to.deep.equal({ name: "testUser" });
    });

    it("should return 404 if user is not found while updating password", async () => {
      userServiceInstance.updateUserPassword.resolves(null);

      const res = await request(app)
        .patch("/user")
        .query({ name: "testUser", password: "newPassword" });

      expect(res.status).to.equal(404);
      expect(res.text).to.equal("No se pudo actualizar la contraseña");
    });

    it("should return 500 if an error occurs while updating password", async () => {
      userServiceInstance.updateUserPassword.rejects(
        new Error("Database error")
      );

      const res = await request(app)
        .patch("/user")
        .query({ name: "testUser", password: "newPassword" });

      expect(res.status).to.equal(500);
      expect(res.text).to.equal("Error al intentar actualizar la contraseña");
    });

    it("should return 200 with updated user last connected", async () => {
      userServiceInstance.updateUserLastConnected.resolves({ id: "user123" });

      const res = await request(app).patch("/user").query({ id: "user123" });

      expect(res.status).to.equal(200);
      expect(res.body).to.deep.equal({ id: "user123" });
    });

    it("should return 404 if user is not found while updating last connected", async () => {
      userServiceInstance.updateUserLastConnected.resolves(null);

      const res = await request(app).patch("/user").query({ id: "user123" });

      expect(res.status).to.equal(404);
      expect(res.text).to.equal("No se pudo actualizar la ultima conexion");
    });

    it("should return 500 if an error occurs while updating last connected", async () => {
      userServiceInstance.updateUserLastConnected.rejects(
        new Error("Database error")
      );

      const res = await request(app).patch("/user").query({ id: "user123" });

      expect(res.status).to.equal(500);
      expect(res.text).to.equal(
        "Error al intentar actualizar la ultima conexion"
      );
    });
  });

  describe("POST /user/login", () => {
    it("should return 200 with login details", async () => {
      userServiceInstance.login.resolves({ token: "token123", id: "user123" });

      const res = await request(app)
        .post("/user/login")
        .send({ name: "testUser", password: "password" });

      expect(res.status).to.equal(200);
      expect(res.body).to.deep.equal({
        token: "token123",
        message: "Usario logeado correctamente",
        userID: "user123",
      });
    });

    it("should return 400 if login fails", async () => {
      userServiceInstance.login.rejects(new Error("Invalid credentials"));

      const res = await request(app)
        .post("/user/login")
        .send({ name: "testUser", password: "password" });

      expect(res.status).to.equal(400);
      expect(res.text).to.equal("Could not login");
    });
  });
});
