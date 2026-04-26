import Database from "better-sqlite3";

export class databaseInstance {
  constructor() {
    this.db = new Database("tododb.db", {});
  }

  setup() {
    this.db.exec(`CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL
      )
    `);
  }

  insertUser(username, email, password) {
    try {
      this.db
        .prepare(
          `INSERT INTO users (username, email, password) VALUES (?, ?, ?)`,
        )
        .run(username, email, password);
      return { message: "User created" };
    } catch (err) {
      console.log(err);
      return { message: "Unable to create user" };
    }
  }

  loginUser(email, password) {
    try {
      const value = this.db
        .prepare(`SELECT password FROM users WHERE email = ?`)
        .get(email);
      if (value.password === password) {
        console.log("successful login");
        return { message: "logged in" };
      }
      return { message: "Incorrect details..." };
    } catch (err) {
      console.log(err);
      return { message: "Unable to log you in" };
    }
  }
}
