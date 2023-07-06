import MySQL from "../utils/db.js";
import DataFormatter from "../utils/dataFormatter.js";
import ApiError from "../utils/apiError.js";
import Firebase from "../utils/firebase.js";

import TypeService from "../service/type.js";
import ProcedureService from "../service/procedure.js";

import errors from "../config/errors.js";

class Procedure {
  async defaultValue(req, res, next) {
    try {
      const rez = {
        state: "pending",
      };
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
      const formatedValues = DataFormatter.toSQLDate({
        ...object,
        type: object.type.id,
        user: object.user.id,
      });

      if (object.type.contract) {
        const file = await ProcedureService.urlToPdfBuffer(object.contract);

        formatedValues.contract = await Firebase.store(
          `pdf/${object.user.username}/${object.startProcTime}/${object.startProcTime}_${object.user.username}_${object.type.name}.pdf`,
          file,
        );
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
      async (error) => {
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

  deleteById(req, res, next) {
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

  deleteByUserId(req, res, next) {
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

    await MySQL.createQuery({
        sql: "SELECT * FROM service WHERE year = :year and month = :month and day = :day",
        values: {
          columns,
          formatName: "keysAndValuesObject",
        },
      },
      async (error, results) => {
        if (error) {
          throw error;
        }

        const populated = await Promise.all(results.map(ProcedureService.populate));

        res.status(200).json(populated);
        next();
      }
    ).catch(next);
  }

  makeReview(req, res, next) {
    const formated = DataFormatter.toSQLDate(req.body);

    MySQL.createQuery({
        sql: "INSERT INTO review **",
        values: {
          columns: formated,
          formatName: "spreadObject",
        },
      },
      (error) => {
        if (error) {
          ApiError.throw("badRequest", {
            ...errors.alreadyExist("reviewAlreadyExistsValid"),
            name: "review",
          });
        }

        res.status(200).json({
          msg: "New review were created",
        });

        next();
      }
    ).catch(next);
  }

  getReviewsByQuery(req, res, next) {
    const {
      id,
      limit,
    } = req.query;

    MySQL.createQuery({
        sql: `SELECT * FROM review WHERE ?? = ?${limit ? ` LIMIT ${limit}` : ""}`,
        values: {
          columns: ["service", id],
          formatName: "keyAndValueArray",
        },
      },
      async (error, results) => {
        if (error) {
          throw error;
        }

        const populated = await Promise.all(results.map(ProcedureService.populate));

        res.status(200).json(populated);
        next();
      }
    ).catch(next);
  }

  getProceduresByQuery(req, res, next) {
    MySQL.createQuery({
        sql: `SELECT * FROM service WHERE ${req.params.query}`,
        values: {
          columns: req.query,
          formatName: "spreadObject",
        },
      },
      async (error, results) => {
        if (error) {
          throw error;
        }

        const populated = await Promise.all(results.map(ProcedureService.populate));

        res.status(200).json(populated);
        next();
      }
    ).catch(next);
  }

  updateProc(req, res, next) {
    const columns = DataFormatter.toSQLDate({
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

  deleteReviewById(req, res, next) {
    const {
      id,
    } = req.params;

    MySQL.createQuery({
          sql: "DELETE FROM review WHERE ?? = ?",
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
            success: "The review is deleted",
          });

          next();
        })
      .catch(next);
  }

  updateReview(req, res, next) {
    const columns = DataFormatter.toSQLDate({
      ...req.body,
      user: req.body.user.id,
    });

    MySQL.createQuery({
        sql: `UPDATE review SET ** WHERE id = ${columns.id}`,
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