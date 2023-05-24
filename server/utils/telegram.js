import Api from "node-telegram-bot-api";
import {
    config
} from "dotenv";

config();

class Telegram {
    token = process.env.TELEGRAM_TOKEN;

    constructor() {
        this.bot = new Api(this.token, {
            polling: true,
        });
    }
}

export default new Telegram();