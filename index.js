// implement your API here
const express = require("express");
const server = express();
const db = require("./data/db");

server.use(express.json());

server.get("/api", (req, res) => {
  res.send("Server working.");
});

server.post("/api/users", (req, res) => {
  const user = req.body;
  db.insert(user)
    .then(user => {
      if (!user.name || !user.bio) {
        return res.status(400).json({
          errMessage: "Please provide name and bio for the user."
        });
      } else {
        res.status(201).json(user);
      }
    })
    .catch(err => {
      res.status(500).json({
        err: "There was an error while saving the user to the database"
      });
    });
});

server.get("/api/users", (req, res) => {
  db.find()
    .then(users => res.status(200).json(users))
    .catch();
});

server.get("/api/users/:id", (req, res) => {
  db.findById(req.params.id)
    .then(user => {
      if (!user) {
        res
          .status(404)
          .json({ message: "The user with the specified ID does not exist." });
      } else {
        res.status(200).json({ user });
      }
    })
    .catch(err => {
      res
        .status(500)
        .json({ error: "The user information could not be retrieved." });
    });
});

server.delete("/api/users/:id", (req, res) => {
  const userId = req.params.id;
  db.remove(userId)
    .then(deleted => {
      if (!user) {
        res
          .status(404)
          .json({ message: "The user with the specified ID does not exist." });
      } else {
        res.status(204).end();
      }
    })
    .catch(err => {
      res.status(500).json({ error: "The user could not be removed" });
    });
});

server.put("/api/users/:id", (req, res) => {
  if (!req.body.name || !req.body.bio) {
    res
      .status(400)
      .json({ error: "Please provide name and bio for the user." });
    return;
  }
  db.update(req.params.id, req.body)
    .then(user => {
      if (!user) {
        res
          .status(404)
          .json({ message: "The user with the specified ID does not exist." });
      } else {
        db.findById(req.params.id)
          .then(updatedUser => res.status(200).json(updatedUser))
          .catch(err =>
            res.status(404).json({ error: "User not found after updating." })
          );
      }
    })
    .catch(err => {
      res
        .status(500)
        .json({ error: "The user information could not be modified." });
    });
});

server.listen(5000, () => {
  console.log("\n** Running on port 5000 **\n");
});
