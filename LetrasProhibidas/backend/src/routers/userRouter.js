import express from "express";
import { UserServices } from "../services/userServices.js";
import jwt from "jsonwebtoken"
import dotenv from "dotenv";
dotenv.config();

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
  // Primero comprobamos que se envíe un token y este sea válido
  const authHeader = req.headers.authorization
  if (!authHeader) return res.status(401).send("No autorizado");

  const token = authHeader.split(" ")[1]

  try {
    // Decodificamos la información del token
    const decoded = jwt.verify(token, process.env.SECRET_KEY)
    const tokenId = decoded.userID
    const id = req.params.id;
    // Comparamos que la informacion coincida
    if (tokenId !== id) return res.status(403).send("No tienes permiso para acceder a esta informacion")
    
    // Una vez coincida, devolvemos la informacion del usuario
    userService.getUserById(id).then((user) => {
      return user ? res.status(200).send(user) : res.status(400).send("User not found");
    }).catch((err) => {
      return res.status(400).send(err);
    });
  }
  catch (err) {
    console.log(err)
    return res.status(400).send(err)
  }
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

// Endpoint para logearse 

userRouter.post("/user/login", async (req, res) => {
  const {name, password} = req.body;
  try {
    const {token, id} = await userService.login(name, password);
    return res.status(200).json({token, message: "Usario logeado correctamente", userID: id})
  } 
  catch (err) {
    console.log(err.message);
    return res.status(400).send("Could not login")
  }
})