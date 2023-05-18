import MySQL from "../utils/db.js";

class Type {
  all(req, res, next) {
    const {
      country,
    } = req.params;

    MySQL.createQuery(
      {
        sql: "SELECT * FROM type WHERE ?? = ?",
        values: {
          columns: ["country", country],
          formatName: "keyAndValueArray",
        },
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
    MySQL.createQuery(
      {
        sql: "INSERT INTO type **",
        values: {
          columns: req.body,
          formatName: "spreadObject",
        },
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
        values: {
          columns: ["country", country],
          formatName: "keyAndValueArray",
        },
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
        sql: "SELECT * FROM type WHERE ?? = ?",
        values: {
          columns: ["id", id],
          formatName: "keyAndValueArray",
        },
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