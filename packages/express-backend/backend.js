import express from "express";

const app = express();
const port = 8000;

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World of Awesome!");
});

app.listen(port, () => {
  console.log(
    `Example app listening at http://localhost:${port}`
  );
});

const users = {
    users_list: [
      {
        id: "xyz789",
        name: "Charlie",
        job: "Janitor"
      },
      {
        id: "abc123",
        name: "Mac",
        job: "Bouncer"
      },
      {
        id: "ppp222",
        name: "Mac",
        job: "Professor"
      },
      {
        id: "yat999",
        name: "Dee",
        job: "Aspring actress"
      },
      {
        id: "zap555",
        name: "Dennis",
        job: "Bartender"
      },
      {
        id: "qwe123",
        job: "Zookeeper",
        name: "Cindy"
      }
    ]
  };

const findUserByName = (name) => {
    return users["users_list"].filter(
      (user) => user["name"] === name
    );
};

const findUserById = (id) =>
users["users_list"].find((user) => user["id"] === id);

const addUser = (user) => {
    users["users_list"].push(user);
    return user;
};
  
app.post("/users", (req, res) => {
    const userToAdd = req.body;
    addUser(userToAdd);
    res.send();
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
      res.status(200).send({
        message: "User deleted successfully.",
        user: deletedUser
      });
    }
});

const findUserByNameAndJob = (name, job) => {
    return users["users_list"].filter(
      (user) =>
        user["name"] === name && user["job"] === job
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
    } else {
        res.send(users);
    }
});

