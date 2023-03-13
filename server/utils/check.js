class Check {
  isObject(value) {
    return typeof value === "object" && !Array.isArray(value);
  }

  isDate(value) {
    const date = new Date(value);

    return this.isObject(date) && !Number.isNaN(date.getTime()) && typeof value === "string"
      ? date
      : null;
  }
}

export default new Check();
