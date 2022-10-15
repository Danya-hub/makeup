import dotenv from "dotenv";

dotenv.config();

export default {
    uriDB: `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.qjlr0.mongodb.net/?retryWrites=true&w=majority`,
    port: 3001,
}