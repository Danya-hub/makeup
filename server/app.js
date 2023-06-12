import express, {
  urlencoded
} from "express";
import cookieSession from "cookie-session";
import cors from "cors";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import {
  config
} from "dotenv";

// import Telegram from "./utils/telegram.js";
import {
  server,
  request,
} from "./config/server.js";
import Router from "./routes/index.js";
import errorsGather from "./middleware/errorsGather.js";

const app = express();

config({
  path: "./env/.env.server",
});

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
app.use(
  cors({
    origin: server.origin,
    methods: ["post", "get"],
    credentials: true,
  })
);
app.use(cookieParser());
app.use(rateLimit(request));
app.use("/auth", Router.auth);
app.use("/procedure", Router.procedure);
app.use(errorsGather);

app.listen(server.port);

// Telegram.bot.on("message", (msg) => { //!
//   console.log(msg);
// });