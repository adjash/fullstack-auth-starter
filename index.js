const express = require("express");
const app = express();
const port = 3000;

app.use(express.json());

app.post("/login", (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username) return res.status(400).send("Please enter a username");
    if (!password) return res.status(400).send("Please enter a password");

    if (username === "user" && password === "password") {
      res.status(200).send("logged in!");
      return;
    } else {
      res.status(400).send("incorrect details");
      return;
    }
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
    res.status(200).send("registered");
    return;
  } catch (err) {
    console.log(err);
    return res.status(500).send("something went wrong");
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
