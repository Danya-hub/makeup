import db from "../constant/db.js";

class Type {
  all(req, res, next) {
    const options = "SELECT * FROM type";

    db.query(options, (err, result) => {
      try {
        if (err) {
          throw err;
        }

        res.status(200).json(result);

        next();
      } catch (error) {
        next(error);
      }
    });
  }

  create(req, res, next) {
    const doc = req.body;

    const options = "INSERT INTO type SET ?";

    db.query(options, doc, (err, result) => {
      try {
        if (err) {
          throw err;
        }

        res.status(200).json(result);

        next();
      } catch (error) {
        next(error);
      }
    });
  }

  defaultType(req, res, next) {
    const { country } = req.params;

    const options = "SELECT * FROM type WHERE country = ? LIMIT 1";
    const values = [country];

    db.query(options, values, (err, result) => {
      try {
        if (err) {
          throw err;
        }

        const defaultType = result[0];

        res.status(200).json(defaultType);

        next();
      } catch (error) {
        next(error);
      }
    });
  }
}

export default new Type();
