import { config } from "dotenv";

config();

export const uriDB = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.qjlr0.mongodb.net/?retryWrites=true&w=majority`;
export const serverPort = 3001;
export const origin = "http://localhost:3000";
