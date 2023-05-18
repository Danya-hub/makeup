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

  createProcedure(req, res, next) {
    req.body.forEach(async (proc) => { //!
      const values = Value.toSQLDate({
        ...proc,
        type: proc.type.id,
        user: proc.user.id,
      });

      if (proc.type.contract) {
        values.contract = await ProcedureService.urlToPdfBuffer(proc.contract);
      }

      MySQL.createQuery({
          sql: "INSERT INTO service **",
          values,
        },
        (error) => {
          if (error) {
            throw error;
          }
        }
      ).catch(next);
    });

    res.status(200).json({
      msg: "New procedures were created",
    });
    next();
  }

  removeById(req, res, next) {
    const {
      id,
    } = req.params;

    MySQL.createQuery({
          sql: "DELETE FROM service WHERE ?? = ?",
          values: ["id", id],
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
        values: ["user", id],
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
    const values = {
      year: newDate.getFullYear(),
      month: newDate.getMonth(),
      day: newDate.getDate(),
    };

    const proceduresByDay = await MySQL.createQuery({
        sql: "SELECT * FROM service WHERE year = :year and month = :month and day = :day",
        values,
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
        values: ["user", id],
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
    const values = Value.toSQLDate({
      ...req.body,
      type: req.body.type.id,
      user: req.body.user.id,
    });

    MySQL.createQuery({
        sql: `UPDATE service SET ** WHERE id = ${values.id}`,
        values,
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