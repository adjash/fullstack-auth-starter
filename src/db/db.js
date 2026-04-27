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
      const insertRes = this.db
        .prepare(
          `INSERT INTO users (username, email, password) VALUES (?, ?, ?)`,
        )
        .run(username, email, password);
      console.log(insertRes);
      if (insertRes.changes === 1) {
        return {
          message: "User created",
          status: 200,
        };
      }
      return {
        message: "User not created",
        status: 400,
      };
    } catch (err) {
      console.log(err);
      if (err.code === "SQLITE_CONSTRAINT_UNIQUE") {
        return {
          message: "A user with this email address is already registered",
          status: 409,
        };
      }
      return { message: "Unable to create user", status: 500 };
    }
  }

  loginUser(email, password) {
    try {
      const value = this.db
        .prepare(`SELECT * FROM users WHERE email = ?`)
        .get(email);
      if (value?.password === password) {
        console.log("successful login");
        return {
          message: "logged in",
          status: 200,
        };
      }
      return {
        message: "Incorrect details...",
        status: 400,
      };
    } catch (err) {
      console.log(err);
      return { message: "Unable to log you in", status: 500 };
    }
  }
}
