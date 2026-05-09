import pg from "pg";
import "dotenv/config";
const { Pool } = pg;

export class databaseInstance {
  constructor() {
    this.db = new Pool({
      connectionString: process.env.POSTGRES_CONN_STRING,
    });
  }

  async insertUser(username, email, password) {
    try {
      const insertRes = await this.db.query(
        `INSERT INTO users (username, email, password) VALUES ($1, $2, $3)`,
        [username, email, password],
      );
      console.log(insertRes);

      if (insertRes.rowCount === 1) {
        return { message: "User created", status: 200 };
      }
      return { message: "User not created", status: 400 };
    } catch (err) {
      console.log(err);
      if (err.code === "23505") {
        return {
          message: "A user with this email address is already registered",
          status: 409,
        };
      }
      return { message: "Unable to create user", status: 500 };
    }
  }

  async loginUser(email, password) {
    try {
      const res = await this.db.query(`SELECT * FROM users WHERE email = $1`, [
        email,
      ]);
      const user = res.rows[0];

      if (user?.password === password) {
        console.log("successful login");
        return { message: "logged in", status: 200 };
      }
      return { message: "Incorrect details...", status: 400 };
    } catch (err) {
      console.log(err);
      return { message: "Unable to log you in", status: 500 };
    }
  }
}
