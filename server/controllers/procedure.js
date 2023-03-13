import db from "../constant/db.js";

import VarType from "../utils/varType.js";

import ApiError from "../utils/apiError.js";

class Procedure {
  createProcedure(req, res, next) {
    const body = VarType.toDate(req.body);

    const values = {
      ...body,
      year: body.startProcTime.getFullYear(),
      month: body.startProcTime.getMonth(),
      day: body.startProcTime.getDate(),
    };
    const options = "INSERT INTO courseaction SET ?";

    db.query(options, values, (err, result) => {
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

  removeByUserId(req, res, next) {
    const { id } = req.params;

    const options = "DELETE FROM courseaction WHERE user = ?";
    const values = [id];

    db.query(options, values, (err, result) => {
      try {
        if (!result.affectedRows) {
          ApiError.notExist("procedure");
        }

        res.status(200).json({
          success: "The procedure is deleted",
        });

        next();
      } catch (error) {
        next(error);
      }
    });
  }

  byDay(req, res, next) {
    const { date } = req.params;

    const newDate = new Date(date);
    const values = [newDate.getFullYear(), newDate.getMonth(), newDate.getDate()];

    const options = "SELECT * FROM courseaction WHERE year = ? and month = ? and day = ?";

    db.query(options, values, (err, result) => {
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

  byUser(req, res, next) {
    const { user: id } = req.body;

    const options = "SELECT * FROM courseaction WHERE user = ?";
    const values = [id];

    db.query(options, values, (err, result) => {
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
}

export default new Procedure();
