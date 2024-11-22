import express from "express";
import { UserServices } from "../services/userServices.js";

export const userRouter = express.Router();
const userService = UserServices.getInstance();

userRouter.get("/user", (req, res) => {
  const name = req.query.name;
  const id = req.query.id;
  const email = req.query.email;
  if (name) {
    userService.getUserByName(name).then((user) => {
      return user ? res.status(200).send(user) : res.status(400).send("User not found");
    }).catch((err) => {
      res.status(400).send(err);
    });
  }
  else if (id) {
    userService.getUserById(id).then((user) => {
      return user ? res.status(200).send(user) : res.status(400).send("User not found");
    }).catch((err) => {
      res.status(400).send(err);
    });
  } else {
    userService.getUserByEmail(email).then((user) => {
      return user ? res.status(200).send(user) : res.status(400).send("User not found");
    }).catch((err) => {
      res.status(400).send(err);
    });
  }

});

userRouter.get("/user/all", (req, res) => {
  userService.getAllUsers().then((users) => {
    return users ? res.status(200).send(users) : res.status(400).send("Could not get users");
  }).catch((err) => {
    res.status(400).send(err);
  });
});


userRouter.get("/user/:id", (req, res) => {
  const id = req.params.id;
  userService.getUserByMongoId(id).then((user) => {
    return user ? res.status(200).send(user) : res.status(400).send("User not found");
  }).catch((err) => {
    res.status(400).send(err);
  });
});


userRouter.post("/user", (req, res) => {
  const name = req.body.name;
  const password = req.body.password;
  const email = req.body.email;

  // Imprimimos el body para verificar que los datos se recibieron correctamente
  console.log(req.body);

  console.log(name, password, email);
  userService.createUser(name, password, email).then((user) => {
    return user ? res.status(200).send(user) : res.status(400).send("Could not create user");
  }).catch((err) => {
    res.status(400).send(err);
  });
});

userRouter.delete("/user", (req, res) => {
  const name = req.query.name;
  const id = req.query.id;
  const email = req.query.email;
  if (name) {
    userService.deleteUserByName(name).then((user) => {
      return user ? res.status(200).send(user) : res.status(400).send("Could not delete user");
    }).catch((err) => {
      res.status(400).send(err);
    });
  }
  else if (id) {
    userService.deleteUser(id).then((user) => {
      return user ? res.status(200).send(user) : res.status(400).send("Could not delete user");
    }).catch((err) => {
      res.status(400).send(err);
    });
  } else {
    userService.deleteUserByEmail(email).then((user) => {
      return user ? res.status(200).send(user) : res.status(400).send("Could not delete user");
    }).catch((err) => {
      res.status(400).send(err);
    });
  }
});

userRouter.delete("/user/:id", (req, res) => {
  const id = req.params.id;
  userService.deleteUserByMongoId(id).then((user) => {
    return user ? res.status(200).send(user) : res.status(400).send("Could not delete user");
  }).catch((err) => {
    res.status(400).send(err);
  });
});

userRouter.patch("/user", (req, res) => {
  const name = req.query.name;
  const newPassword = req.query.password;
  const id = req.query.id;
  if (name && newPassword) {
    userService.updateUserPassword(name, newPassword).then((user) => {
      return user ? res.status(200).send(user) : res.status(400).send("Could not update password");
    }).catch((err) => {
      res.status(400).send(err);
      console.log(err);
    })
  }
  else if (id) {
    userService.updateUserLastConnected(id).then((user) => {
      return user ? res.status(200).send(user) : res.status(400).send("Could not update last connection time");
    }).catch((err) => {
      res.status(400).send(err);
    })
  }
})

// Endpoint para comprobar que una contraseña pertenece a un usuario
userRouter.post("/user/password", async (req, res) => {
  const { name, password } = req.body;
  try {
    const user = await userService.getUserByName(name);
    if (!user) {
      return res.status(400).send("User not found");
    }
    const isMatch = await userService.comparePassword(user, password);
    return isMatch ? res.status(200).send("Password matches") : res.status(400).send("Password does not match");
  } catch (err) {
    console.error("Error in /user/password:", err);
    res.status(500).send(err);
  }
});