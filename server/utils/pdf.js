import {
    PDFDocument,
} from "pdf-lib";
import fs from "fs/promises";
import http from "http";
import {
    Blob
} from "buffer";
import * as fontkit from "fontkit";

class Pdf {
    fontSizeField = 10;

    bytes = null;

    document = null;

    form = null;

    getBlob() {
        const blob = new Blob([this.bytes], {
            type: "application/pdf"
        });

        return blob;
    }

    async readFile(url) {
        return new Promise((resolve, rejects) => {
                http.get(url, (socket) => {
                    const chunks = [];

                    socket.on("data", (chunk) => {
                        chunks.push(chunk);
                    });

                    socket.on("error", (e) => {
                        rejects(e);
                    });

                    socket.on("end", async () => {
                        const data = Buffer.concat(chunks);
                        const document = await PDFDocument.load(data);

                        resolve(document);
                    });
                });
            })
            .then((value) => {
                this.document = value;
                this.form = this.document.getForm();

                return value;
            });
    }

    async setFieldsText(fields) {
        this.document.registerFontkit(fontkit);

        const fontBytes = await fs.readFile("./fonts/Roboto-Regular.ttf");
        const font = await this.document.embedFont(fontBytes);

        Object.keys(fields).forEach((key) => {
            const field = this.form.getTextField(key);

            const value = String(fields[key]);

            field.setFontSize(this.fontSizeField);
            field.setText(value);
            field.updateAppearances(font);
        });

        this.bytes = await this.document.save();
    }
}

export default Pdf;