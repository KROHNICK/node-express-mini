// implement your API here
const express = require("express");
const server = express();
const db = require("./data/db");

server.use(express.json());

server.get("/", (req, res) => {
  res.send("Server working.");
});

server.get("/now", (req, res) => {
  const now = new Date().toISOString();
  res.send(now);
});

server.post("/api/users", (req, res) => {
  if (!req.body.name || !req.body.bio) {
    return res.status(400).json({
      errMessage: "Please provide name and bio for the user."
    });
  } else {
    try {
      const user = db.insert({ ...req.body });
      res.status(201).json({ success: true, user });
    } catch (err) {
      res.status(500).json({
        err: "There was an error while saving the user to the database"
      });
    }
  }
});

server.get("/api/users", (req, res) => {
  const users = db
    .find()
    .then(users => {
      res.status(200).json({ success: true, user });
    })
    .catch(({ code, message }) => {
      res
        .status(500)
        .json({ error: "The posts information could not be retrieved." });
    });
});

server.listen(4000, () => {
  console.log("\n*** Running on port 4000 ***\n");
});
