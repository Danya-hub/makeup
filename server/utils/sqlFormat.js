import mysql from "mysql2";

import Check from "./check.js";

class Format {
    constructor(query, values) {
        this.query = query;
        this.values = values;
        this.valIsObject = Check.isObject(this.values);
        this.valIsArray = Array.isArray(this.values);
    }

    objectRows() {
        if (!this.values || !this.valIsObject) {
            return;
        }

        this.query = this.query.replace(/:(\w+)/g, (txt, key) => {
            if (this.values[key]) {
                return mysql.escape(this.values[key]);
            }

            return txt;
        });
    }

    singleArrayRow() {
        if (!this.values || !this.valIsArray) {
            return;
        }

        const [key, value] = this.values;
        this.query = this.query.replace(/\?{2}|(?<==\s)\?/g, (searchValue) => {
            if (searchValue.length >= 2) {
                return key;
            }

            return `'${value}'`;
        });
    }

    multipleArrayRows() {
        if (!this.values || !this.valIsObject) {
            return;
        }

        const keys = Object.keys(this.values);
        this.query = this.query.replace(/\*{2}/g, () => {
            const strKeysLine = keys.join();
            const strValuesLine = keys.map((key) => `'${this.values[key]}'`).join();
            const result = `(${strKeysLine}) VALUES (${strValuesLine})`;

            return result;
        });
    }
}

export default Format;