import http from "http";

import MySQL from "../utils/db.js";
import Value from "../utils/value.js";
import ApiError from "../utils/apiError.js";
import QrCode from "../utils/qrCode.js";

import server from "../config/server.js";

class Procedure {
  defaultProcedure() {
    // ?

    // type (mounted/unmounted id)
    // file/sign (mounted/unmounted id)
    // payment
    // state
  }

  createProcedure(req, res, next) {
    req.body.forEach((proc) => {
      const [formated, date] = Value.toSQLDate(proc);

      const values = {
        ...formated,
        // year: date.getFullYear(),
        // month: date.getMonth(),
        // day: date.getDate(),
      };

      if (values.type.contract) {
        const content = `Procedure: ${values.type.name}\nId client: ${values.user.id}\nClient: ${values.user.fullname}\nEmail: ${values.user.email}\nCountry: ${values.type.country}\nYYYY-MM-DD: ${values.year}-${values.month}-${values.day}`;

        const qrCodeImage = new QrCode(content).generate();
        // http.get(server.origin + values.pdfPath, (socket) => { //!
        //   const chunks = [];

        //   socket.on("data", (chunk) => {
        //     chunks.push(chunk);
        //   });

        //   socket.on("end", () => {
        //     const data = Buffer.concat(chunks);

        //     console.log(data);
        //   });
        // });
      }

      // MySQL.createQuery(
      //   {
      //     sql: "INSERT INTO courseaction **",
      //     values,
      //   },
      //   (error, results) => {
      //     if (error) {
      //       throw error;
      //     }

      //     res.status(200).json(results);

      //     next();
      //   }
      // ).catch(next);
    });
  }

  removeByUserId(req, res, next) {
    const {
      id
    } = req.params;

    MySQL.createQuery(
      {
        sql: "DELETE FROM courseaction WHERE user = ?",
        values: [id],
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

  byDay(req, res, next) {
    const {
      date
    } = req.params;

    const newDate = new Date(date);
    const values = {
      year: newDate.getFullYear(),
      month: newDate.getMonth(),
      day: newDate.getDate(),
    };

    MySQL.createQuery(
      {
        sql: "SELECT * FROM courseaction WHERE year = :year and month = :month and day = :day",
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

  byUser(req, res, next) {
    const {
      user: id
    } = req.params;

    MySQL.createQuery(
      {
        sql: "SELECT * FROM courseaction WHERE user = ?",
        values: [id],
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