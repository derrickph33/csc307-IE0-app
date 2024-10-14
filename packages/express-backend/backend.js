import express from "express";
import cors from "cors"

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

const users = {
  users_list: [
    {
      id: "xyz789",
      name: "Charlie",
      job: "Janitor",
    },
    {
      id: "abc123",
      name: "Mac",
      job: "Bouncer",
    },
    {
      id: "ppp222",
      name: "Mac",
      job: "Professor",
    },
    {
      id: "yat999",
      name: "Dee",
      job: "Aspring actress",
    },
    {
      id: "zap555",
      name: "Dennis",
      job: "Bartender",
    },
  ],
};

const findUserByName = (name) => {
  return users["users_list"].filter((user) => user["name"] === name);
};

const findUserByJob = (job) => {
  return users["users_list"].filter((user) => user["job"] === job);
};

const findUserById = (id) =>
  users["users_list"].find((user) => user["id"] === id);

const addUser = (user) => {
  users["users_list"].push(user);
  return user;
};

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
  const id = generateId();
  const user = { id, ...userToAdd };
  addUser(user);
  res.status(201).send(user);
});

app.get("/users/:id", (req, res) => {
  const id = req.params["id"]; //or req.params.id
  let result = findUserById(id);
  if (result === undefined) {
    res.status(404).send("Resource not found.");
  } else {
    res.send(result);
  }
});

app.delete("/users/:id", (req, res) => {
  const id = req.params.id;
  const userIndex = users.users_list.findIndex((user) => user.id === id);

  if (userIndex === -1) {
    res.status(404).send("User not found.");
  } else {
    const deletedUser = users.users_list.splice(userIndex, 1)[0];
    res.status(204).send({
      message: "User deleted successfully.",
      user: deletedUser,
    });
  }
});

const findUserByNameAndJob = (name, job) => {
  return users["users_list"].filter(
    (user) => user["name"] === name && user["job"] === job
  );
};

app.get("/users", (req, res) => {
  const { name, job } = req.query;
  if (name && job) {
    const result = findUserByNameAndJob(name, job);
    res.send({ users_list: result });
  } else if (name) {
    let result = findUserByName(name);
    res.send({ users_list: result });
  } else if (job) {
    let result = findUserByJob(job);
    res.send({ users_list: result });
  } else {
    res.send(users);
  }
});
