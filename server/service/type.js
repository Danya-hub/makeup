import MySQL from "../utils/db.js";

class Type {
  all(req, res, next) {
    const {
      country,
    } = req.params;

    MySQL.createQuery(
      {
        sql: "SELECT * FROM type WHERE ?? = ?",
        values: ["country", country],
      },
      (error, results) => {
        if (error) {
          throw error;
        }

        res.status(200).json(results);

        next();
      }
    ).catch(next);
  }

  create(req, res, next) {
    const doc = req.body;

    MySQL.createQuery(
      {
        sql: "INSERT INTO type **",
        values: doc,
      },
      (error, results) => {
        if (error) {
          throw error;
        }

        res.status(200).json(results);

        next();
      }
    ).catch(next);
  }

  defaultType(req, res, next) {
    const {
      country,
    } = req.params;

    return MySQL.createQuery(
      {
        sql: "SELECT * FROM type WHERE ?? = ? LIMIT 1",
        values: ["country", country],
      },
      (error) => {
        if (error) {
          throw error;
        }

        next();
      }
    ).catch(next);
  }

  findById(id) {
    return MySQL.createQuery(
      {
        sql: "SELECT * FROM type WHERE id = ?",
        values: [id],
      },
      (error) => {
        if (error) {
          throw error;
        }
      }
    );
  }
}

export default new Type();