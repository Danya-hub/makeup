import qrcode from "qrcode";

class QrCode {
    constructor(content) {
        this.content = content;
    }

    generate() {
        return qrcode.toDataURL(this.content);
    }
}

export default QrCode;