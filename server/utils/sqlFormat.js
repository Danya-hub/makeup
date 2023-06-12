import mysql from "mysql2";

class Format {
    constructor(query, values) {
        this.query = query;
        this.values = values;
    }

    keysAndValuesObject() {
        this.query = this.query.replace(/:(\w+)/g, (_, key) => mysql.escape(this.values[key]));
    }

    keyAndValueArray() {
        const [key, value] = this.values;
        this.query = this.query.replace(/\?{2}|(?<==\s)\?/g, (searchValue) => {
            if (searchValue.length >= 2) {
                return key;
            }

            return mysql.escape(value);
        });
    }

    spreadObject() {
        const keys = Object.keys(this.values);
        this.query = this.query.replace(/\*{2}/g, () => {
            const strKeysLine = keys.join();
            const strValuesLine = keys.map((key) => mysql.escape(this.values[key])).join();
            const result = `(${strKeysLine}) VALUES (${strValuesLine})`;

            return result;
        });
    }

    columnsAndValues() {
        const {
            keys,
            values,
        } = this.values;

        this.query = this.query
            .replace(/:keys/g, () => `(${keys.join()})`)
            .replace(/:values/g, () => values.map((arr) => `(${arr.map(mysql.escape).join()})`).join());
    }

    column() {
        const keys = Object.keys(this.values);
        this.query = this.query.replace(
            /\*{2}/g,
            () => keys.map((key) => `${key} = '${this.values[key]}'`).join()
        );
    }
}

export default Format;