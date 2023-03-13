import Check from "./check.js";

class VarType {
  toDate(object) {
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
}

export default new VarType();
