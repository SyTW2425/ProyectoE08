import express from "express";
import { UserServices } from "../services/userServices.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const userRouter = express.Router();
const userService = UserServices.getInstance();

userRouter.get("/user", (req, res) => {
  const name = req.query.name;
  const id = req.query.id;
  const email = req.query.email;

  if (name) {
    userService
      .getUserByName(name)
      .then((user) => {
        return user
          ? res.status(200).send(user)
          : res.status(404).send("El usuario no se encontró");
      })
      .catch((err) => {
        res
          .status(500)
          .send("Error al intentar obtener el usuario por su nombre");
      });
  } else if (id) {
    userService
      .getUserById(id)
      .then((user) => {
        return user
          ? res.status(200).send(user)
          : res.status(404).send("El ID del usuario no se encontró");
      })
      .catch((err) => {
        res.status(500).send("Error al intentar obtener el usuario por su ID");
      });
  } else if (email) {
    userService
      .getUserByEmail(email)
      .then((user) => {
        return user
          ? res.status(200).send(user)
          : res.status(404).send("El email del usuario no se encontró");
      })
      .catch((err) => {
        res
          .status(500)
          .send("Error al intentar obtener el usuario por su email");
      });
  } else {
    res.status(400).send("No se proporcionó el nombre, id o email");
  }
});

userRouter.get("/user/all", (req, res) => {
  userService
    .getAllUsers()
    .then((users) => {
      return users
        ? res.status(200).send(users)
        : res.status(404).send("No se encontraron usuarios");
    })
    .catch((err) => {
      res.status(500).send("Error al intentar obtener todos los usuarios");
    });
});

userRouter.get("/user/:id", (req, res) => {
  // Primero comprobamos que se envíe un token y este sea válido
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).send("No autorizado");

  const token = authHeader.split(" ")[1];

  try {
    // Decodificamos la información del token
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    const tokenId = decoded.userID;
    const id = req.params.id;
    // Comparamos que la informacion coincida
    if (tokenId !== id)
      return res
        .status(403)
        .send("No tienes permiso para acceder a esta informacion");

    if (!id) {
      return res.status(400).send("No se proporcionó el ID");
    }
    // Una vez coincida, devolvemos la informacion del usuario
    userService
      .getUserById(id)
      .then((user) => {
        return user
          ? res.status(200).send(user)
          : res.status(404).send("El ID del usuario no se encontró");
      })
      .catch((err) => {
        return res
          .status(500)
          .send("Error al intentar obtener el usuario por su ID");
      });
  } catch (err) {
    return res.status(500).send(err);
  }
});

userRouter.post("/user", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  const email = req.body.email;
  const avatar = req.body.avatarSrc;

  if (!username || !password || !email) {
    return res
      .status(400)
      .send("No se proporcionó el nombre, contraseña o email");
  }

  userService
    .createUser(username, password, email, avatar)
    .then(({ token, id, name, avatar }) => {
      return res.status(200).json({
        token,
        message: "Usario logeado correctamente",
        userID: id,
        userName: name,
        userAvatar: avatar,
      });
    })
    .catch((err) => {
      res.status(500).json({ message: err.message });
    });
});

userRouter.delete("/user", (req, res) => {
  const name = req.query.name;
  const id = req.query.id;
  const email = req.query.email;

  if (name) {
    userService
      .deleteUserByName(name)
      .then((user) => {
        return user
          ? res.status(200).send(user)
          : res
              .status(404)
              .send("No se pudo eliminar el usuario por el nombre");
      })
      .catch((err) => {
        res
          .status(500)
          .send("Error al intentar eliminar el usuario por nombre");
      });
  } else if (id) {
    userService
      .deleteUser(id)
      .then((user) => {
        return user
          ? res.status(200).send(user)
          : res.status(404).send("No se pudo eliminar el usuario por el ID");
      })
      .catch((err) => {
        res.status(500).send("Error al intentar eliminar el usuario por ID");
      });
  } else if (email) {
    userService
      .deleteUserByEmail(email)
      .then((user) => {
        return user
          ? res.status(200).send(user)
          : res.status(404).send("No se pudo eliminar el usuario por el email");
      })
      .catch((err) => {
        res.status(500).send("Error al intentar eliminar el usuario por email");
      });
  } else {
    res.status(400).send("No se proporcionó el nombre, id o email");
  }
});

userRouter.delete("/user/:id", (req, res) => {
  const id = req.params.id;

  if (!id) {
    return res.status(400).send("No se proporcionó el ID");
  }

  userService
    .deleteUserByMongoId(id)
    .then((user) => {
      return user
        ? res.status(200).send(user)
        : res
            .status(404)
            .send("No se pudo eliminar el usuario por su ID de MongoDB");
    })
    .catch((err) => {
      res
        .status(500)
        .send("Error al intentar eliminar el usuario por su ID de MongoDB");
    });
});

userRouter.patch("/user/password", (req, res) => {
  const name = req.query.name;
  const newPassword = req.query.password;

  if (name && newPassword) {
    userService
      .updateUserPassword(name, newPassword)
      .then((user) => {
        return user
          ? res.status(200).send(user)
          : res.status(404).send("No se pudo actualizar la contraseña");
      })
      .catch((err) => {
        res
          .status(500)
          .send(
            "Error al intentar actualizar la contraseña o usuario no encontrado"
          );
      });
  } else {
    res.status(400).send("Los parametros no son correctos");
  }
});

userRouter.patch("/user/updateLogin", async (req, res) => {
  const { id } = req.body;

  if (!id) {
    return res.status(400).send("No se proporcionó el ID");
  }

  try {
    const userService = UserServices.getInstance();
    const user = await userService.updateUserLastConnected(id);
    return res.status(200).send("Fecha de última conexión actualizada");
  } catch (err) {
    return res
      .status(500)
      .send("Error al intentar actualizar la fecha de última conexión");
  }
});

// Endpoint para logearse
userRouter.post("/user/login", async (req, res) => {
  const { username, password, avatarSrc } = req.body;
  try {
    const { token, id, name, avatar } = await userService.login(
      username,
      password,
      avatarSrc
    );
    return res.status(200).json({
      token,
      message: "Usario logeado correctamente",
      userID: id,
      userName: name,
      userAvatar: avatar,
    });
  } catch (err) {
    return res.status(400).send("Could not login");
  }
});

userRouter.patch("/user/stats", async (req, res) => {
  const { addGamesWon, addGamesPlayed, addWordsGuessed, id } = req.body;
  if (!id) {
    return res.status(400).send("No se proporcionó el ID");
  }
  try {
    await userService.sumStats(
      addGamesWon,
      addGamesPlayed,
      addWordsGuessed,
      id
    );
    return res.status(200).send("Estadisticas actualizadas");
  } catch (err) {
    return res.status(404).send("No se pudieron actualizar las estadisticas");
  }
});
