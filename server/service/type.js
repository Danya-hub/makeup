import MySQL from "../utils/db.js";

class Type {
  all(req, res, next) {
    const {
      country,
    } = req.params;

    MySQL.createQuery(
      {
        sql: "SELECT * FROM type WHERE country = ?",
        values: [country],
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
      country
    } = req.params;

    MySQL.createQuery(
      {
        sql: "SELECT * FROM type WHERE country = ? LIMIT 1",
        values: [country],
      },
      (error, results) => {
        if (error) {
          throw error;
        }

        const defaultType = results[0];

        res.status(200).json(defaultType);

        next();
      }
    ).catch(next);
  }
}

export default new Type();