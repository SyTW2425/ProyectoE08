import express from "express";
import { UserServices } from "../services/userServices";

export const userRouter = express.Router();
const userService = UserServices.getInstance();

userRouter.get("/user", (req, res) => {
  const name = req.query.name;
  const id = req.query.id;
  if (name) {
    userService.getUserByName(name).then((user) => {
      return user ? res.status(200).send(user) : res.status(400).send("User not found");
    }).catch((err) => {
      res.status(400).send(err);
    });
  }
  else {
    userService.getUserById(id).then((user) => {
      return user ? res.status(200).send(user) : res.status(400).send("User not found");
    }).catch((err) => {
      res.status(400).send(err);
    });
  }
});

userRouter.get("/user/:id", (req, res) => {
  const id = req.params.id;
  userService.getUserByMongoId(id).then((user) => {
    return user ? res.status(200).send(user) : res.status(400).send("User not found");
  }).catch((err) => {
    res.status(400).send(err);
  });
});

userRouter.get("/user/all", (req, res) => {
  userService.getAllUsers().then((users) => {
    return users ? res.status(200).send(users) : res.status(400).send("Could not get users");
  }).catch((err) => {
    res.status(400).send(err);
  });
});

userRouter.post("/user", (req, res) => {
  const name = req.body.name;
  const password = req.body.password;
  userService.createUser(name, password).then((user) => {
    return user ? res.status(200).send(user) : res.status(400).send("Could not create user");
  }).catch((err) => {
    res.status(400).send(err);
  });
});

userRouter.delete("/user", (req, res) => {
  const name = req.query.name;
  const id = req.query.id;
  if (name) {
    userService.deleteUserByName(name).then((user) => {
      return user ? res.status(200).send(user) : res.status(400).send("Could not delete user");
    }).catch((err) => {
      res.status(400).send(err);
    });
  }
  else {
    userService.deleteUser(id).then((user) => {
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