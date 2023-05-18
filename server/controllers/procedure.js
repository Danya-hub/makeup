import MySQL from "../utils/db.js";
import Value from "../utils/value.js";
import ApiError from "../utils/apiError.js";
import TypeService from "../service/type.js";
import ProcedureService from "../service/procedure.js";

class Procedure {
  async defaultValue(req, res, next) {
    try {
      const rez = {};
      rez.type = await TypeService.defaultType(req, res, next)
        .then((value) => value[0]);

      res.status(200).json(rez);
      next();
    } catch (error) {
      next(error);
    }
  }

  async createProcedure(req, res, next) {
    const keys = Object.keys(req.body[0]);
    const values = await Promise.all(req.body.map(async (object) => {
      const formatedValues = Value.toSQLDate({
        ...object,
        type: object.type.id,
        user: object.user.id,
      });

      if (object.type.contract) {
        formatedValues.contract = await ProcedureService.urlToPdfBuffer(object.contract);
      }

      return Object.values(formatedValues);
    }));

    MySQL.createQuery({
        sql: "INSERT INTO service :keys VALUES :values",
        values: {
          columns: {
            keys,
            values,
          },
          formatName: "columnsAndValues",
        },
      },
      (error) => {
        if (error) {
          throw error;
        }

        res.status(200).json({
          msg: "New procedures were created",
        });
        next();
      }
    ).catch(next);
  }

  removeById(req, res, next) {
    const {
      id,
    } = req.params;

    MySQL.createQuery({
          sql: "DELETE FROM service WHERE ?? = ?",
          values: {
            columns: ["id", id],
            formatName: "keyAndValueArray",
          },
        },
        (error) => {
          if (error) {
            throw error;
          }

          res.status(200).json({
            success: "The procedure is deleted",
          });

          next();
        })
      .catch(next);
  }

  removeByUserId(req, res, next) {
    const {
      id
    } = req.params;

    MySQL.createQuery({
        sql: "DELETE FROM service WHERE ?? = ?",
        values: {
          columns: ["user", id],
          formatName: "keyAndValueArray",
        },
      },
      (error, results) => {
        if (!results.affectedRows) {
          ApiError.throw("notExist", "procedure");
        }

        res.status(200).json({
          success: "The procedure is deleted",
        });

        next();
      }
    ).catch(next);
  }

  async getByDay(req, res, next) {
    const {
      date,
    } = req.params;

    const newDate = new Date(date);
    const columns = {
      year: newDate.getFullYear(),
      month: newDate.getMonth(),
      day: newDate.getDate(),
    };

    const proceduresByDay = await MySQL.createQuery({
        sql: "SELECT * FROM service WHERE year = :year and month = :month and day = :day",
        values: {
          columns,
          formatName: "keysAndValuesObject",
        },
      },
      (error) => {
        if (error) {
          throw error;
        }
      }
    ).catch(next);

    const populated = await Promise.all(proceduresByDay.map(ProcedureService.populate));

    res.status(200).json(populated);

    next();
  }

  getByUser(req, res, next) {
    const {
      user: id
    } = req.params;

    MySQL.createQuery({
        sql: "SELECT * FROM service WHERE ?? = ?",
        values: {
          columns: ["user", id],
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

  update(req, res, next) {
    const columns = Value.toSQLDate({
      ...req.body,
      type: req.body.type.id,
      user: req.body.user.id,
    });

    MySQL.createQuery({
        sql: `UPDATE service SET ** WHERE id = ${columns.id}`,
        values: {
          columns,
          formatName: "column",
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
}

export default new Procedure();