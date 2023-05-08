import mysql from "mysql2";

import Check from "./check.js";

class Format {
    constructor(query, values) {
        this.query = query;
        this.values = values;
        this.isObject = Check.isObject(this.values);
        this.isArray = Array.isArray(this.values);

        this.operatorGroup = {};
        this.operatorGroup.is = this.queryHasOperators(["insert", "select"]);
        this.operatorGroup.u = this.queryHasOperators(["update"]);
    }

    queryHasOperators(operators) {
        return operators.some(
            (operator) => new RegExp(`^${operator}`, "i").test(this.query)
        );
    }

    keysAndValuesObject() {
        if (!this.values || !this.isObject) {
            return;
        }

        if (this.operatorGroup.is || this.operatorGroup.u) {
            this.query = this.query.replace(/:(\w+)/g, (txt, key) => {
                if (this.values[key]) {
                    return mysql.escape(this.values[key]);
                }

                return txt;
            });
        }
    }

    keyAndValueArray() {
        if (!this.values || !this.isArray) {
            return;
        }

        if (this.operatorGroup.is) {
            const [key, value] = this.values;
            this.query = this.query.replace(/\?{2}|(?<==\s)\?/g, (searchValue) => {
                if (searchValue.length >= 2) {
                    return key;
                }

                return `'${value}'`;
            });
        }
    }

    spreadObject() {
        if (!this.values || !this.isObject) {
            return;
        }

        if (this.operatorGroup.is) {
            const keys = Object.keys(this.values);
            this.query = this.query.replace(/\*{2}/g, () => {
                const strKeysLine = keys.join();
                const strValuesLine = keys.map((key) => `'${this.values[key]}'`).join();
                const result = `(${strKeysLine}) VALUES (${strValuesLine})`;

                return result;
            });
        }
    }

    column() {
        if (!this.values || !this.isObject) {
            return;
        }

        if (this.operatorGroup.u) {
            const keys = Object.keys(this.values);
            this.query = this.query.replace(
                /\*{2}/g,
                () => keys.map((key) => `${key} = '${this.values[key]}'`).join()
            );
        }
    }
}

export default Format;