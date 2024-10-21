import express from "express";
import cors from "cors";
import userService from "./services/user-service.js";
import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

const { MONGO_CONNECTION_STRING } = process.env;

mongoose.set("debug", true);
mongoose
  .connect(MONGO_CONNECTION_STRING)
  .catch((error) => console.log(error));

const app = express();
const port = 8000;

app.use(cors())
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World this is the Backend!");
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

const generateId = () => {
  const letters = Array(3)
    .fill(null)
    .map(() => String.fromCharCode(97 + Math.floor(Math.random() * 26)))
    .join('');
  const numbers = Math.floor(100 + Math.random() * 900).toString();
  return letters + numbers;
};

app.post("/users", (req, res) => {
  const userToAdd = req.body;
  userService.addUser(userToAdd)
    .then((addedUser) => {
      res.status(201).send(addedUser);
    })
    .catch((error) => {
      res.status(500).send({ message: "Error adding user", error });
    });
});

app.get("/users/:id", (req, res) => {
  const id = req.params["id"]; //or req.params.id
  userService.findUserById(id)
    .then((user) => {
      if (!user) {
        res.status(404).send("Resource not found.");
      } else {
        res.send(user);
      }
    })
    .catch((error) => {
      res.status(500).send({ message: "Error retrieving user", error });
    });
});

app.delete("/users/:id", (req, res) => {
  const id = req.params.id;
  userService.deleteUserById(id)
    .then((deletedUser) => {
      if (!deletedUser) {
        res.status(404).send("User not found.");
      } else {
        res.status(204).send({ message: "User deleted successfully." });
      }
    })
    .catch((error) => {
      res.status(500).send({ message: "Error deleting user", error });
    });
});

app.get("/users", (req, res) => {
  const { name, job } = req.query;
  userService.getUsers(name, job)
    .then((users) => {
      res.send({ users_list: users });
    })
    .catch((error) => {
      res.status(500).send({ message: "Error retrieving users", error });
    });
});
