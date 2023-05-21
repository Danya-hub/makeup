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
      const date = Check.isDate(rez[key]);

      if (!date) {
        return;
      }

      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, "0");
      const day = date.getDate().toString().padStart(2, "0");
      const hours = date.getHours().toString().padStart(2, "0");
      const minutes = date.getMinutes().toString().padStart(2, "0");
      const seconds = date.getSeconds().toString().padStart(2, "0");

      rez[key] = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    });

    return rez;
  }
}

export default new Value();