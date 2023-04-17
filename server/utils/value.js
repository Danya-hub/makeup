import Check from "./check.js";

class Value {
  toJSDate(object) {
    const rez = {
      ...object,
    };
    const keys = Object.keys(rez);

    keys.forEach((key) => {
      const date = Check.isDate(rez[key]);

      if (date) {
        rez[key] = date;
      }
    });

    return rez;
  }

  toSQLDate(object) {
    const rez = {
      ...object,
    };
    const keys = Object.keys(rez);

    keys.forEach((key) => {
      const isDate = Check.isDate(rez[key]);

      if (!isDate) {
        return;
      }

      rez[key] = rez[key].slice(0, 19).replace("T", " ");
    });

    return rez;
  }
}

export default new Value();