import {
    config,
} from "dotenv";

config();

const clientConfig = {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/auth/google/callback",
}

export {
    clientConfig as default,
}