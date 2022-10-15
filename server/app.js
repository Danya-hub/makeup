import express, {
    urlencoded,
} from "express";
import cookieSession from "cookie-session";
import mongoose from "mongoose";
import cors from "cors";
import passport from "passport";
import cookieParser from "cookie-parser";
import {
    config,
} from "dotenv";

import "./config/passport.js";
import server from "./constant/server.js";
import * as Router from "./routes/index.js";
import errorsGather from "./middleware/errorsGather.js";

const app = express();

config();

app.use(
    urlencoded({
        extended: true,
    })
);
app.use(express.json());
app.use(
    cookieSession({
        keys: ["makeup"],
        secret: process.env.SESSION_SECRET_KEY,
        resave: true,
        overwrite: process.env.NODE_ENV === "development",
        httpOnly: process.env.NODE_ENV === "development",
        secure: process.env.NODE_ENV === "production",
    })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(
    cors({
        origin: "http://localhost:3000",
        methods: ["post", "get"],
        credentials: true,
    })
);
app.use(cookieParser());

app.use("/auth", Router.auth);
app.use("/procedure", Router.procedure);
app.use("/admin", Router.admin);
app.use(errorsGather);

(async () => {
    try {
        mongoose.connect(server.uriDB, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        app.listen(server.port);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
})();