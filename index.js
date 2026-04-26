import express from "express";
import { databaseInstance } from "./src/db/db.js";
const app = express();
const port = 3000;

app.use(express.json());

const db = new databaseInstance();
db.setup();

app.post("/login", (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email) return res.status(400).send("Please enter a email");
    if (!password) return res.status(400).send("Please enter a password");

    res.status(200).json(db.loginUser(email, password));
  } catch (err) {
    console.log(err);
    res.status(500).send("something went wrong");
    return;
  }
});

app.post("/register", (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username) return res.status(400).send("Please enter a username");
    if (!email) return res.status(400).send("Please enter an email");
    if (!password) return res.status(400).send("Please enter a password");

    console.log(username, email, password);
    return res.status(200).json(db.insertUser(username, email, password));
  } catch (err) {
    console.log(err);
    return res.status(500).send("something went wrong");
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
