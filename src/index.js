import express from "express";
import session from "express-session";
import { v4 as uuidv4 } from "uuid";
import path from "path";
import { fileURLToPath } from "url";
import { databaseInstance } from "./db/db.js";

const app = express();
const port = 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//JSON middleware parser, lets us parse JSON from req.body
app.use(express.json());

//session cookie setup
//TODO: figure out how to make this only apply to certain routes
app.use(
  session({
    name: "session-cookie",
    resave: true,
    saveUninitialized: true,
    genid: function (req) {
      return uuidv4();
    },
    secret: "keyboard cat",
    cookie: function (req) {
      var match = req.url.match(/^\/([^/]+)/);
      return {
        path: match ? "/" + match[1] : "/",
        httpOnly: true,
        secure: req.secure || false,
        maxAge: 60000,
      };
    },
  }),
);

//database setup
const db = new databaseInstance();

//basic index route for testing
app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "/index.html"));
});

//login route
//makes database function call to check if the provided data is valid
//I'm starting to think it might make more sense to have the logic to check if the password is valid inside the route, instead of at the database level.
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email) return res.status(400).send("Please enter a email");
    if (!password) return res.status(400).send("Please enter a password");

    const loginOperation = await db.loginUser(email, password);
    return res
      .status(loginOperation.status)
      .json({ message: loginOperation.message });
  } catch (err) {
    console.log(err);
    res.status(500).send("something went wrong");
    return;
  }
});

//register user route
//makes database function call to insert a user with the provided data
//Might make more sense to have it return a 'inserted', or something similar to indicate the operation happened successfully.
app.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username) return res.status(400).send("Please enter a username");
    if (!email) return res.status(400).send("Please enter an email");
    if (!password) return res.status(400).send("Please enter a password");

    console.log(username, email, password);
    const registerOperation = await db.insertUser(username, email, password);
    return res
      .status(registerOperation.status)
      .json({ message: registerOperation.message });
  } catch (err) {
    console.log(err);
    return res.status(500).send("something went wrong");
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
