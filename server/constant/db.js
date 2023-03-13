import mysql from "mysql2";
import { config } from "dotenv";

config();

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

export default db;
