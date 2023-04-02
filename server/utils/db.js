import mysql from "mysql2";
import {
  config
} from "dotenv";

import SqlFormat from "./sqlFormat.js";

config();

class MySQL {
  limit = 10;

  constructor() {
    this.connection = mysql.createPool({
      waitForConnections: true,
      connectionLimit: this.limit,
      host: "localhost",
      user: "root",
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      queryFormat: (query, values) => {
        const format = new SqlFormat(query, values);

        format.singleArrayRow();
        format.multipleArrayRows();
        format.objectRows();

        return format.query;
      }
    });
  }

  createQuery(query, callback) {
    return new Promise((resolve, reject) => {
      this.connection.getConnection((err, connection) => {
        if (err) {
          reject(err);
        }

        connection.query(query.sql, query.values, (error, results, fields) => {
          try {
            connection.release();

            callback(error, results, fields);

            resolve(results);
          } catch (e) {
            reject(e);
          }
        });
      });
    });
  }
}

export default new MySQL();