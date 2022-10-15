import passport from "passport";
import {
    Strategy as GoogleStrategy
} from "passport-google-oauth20";

import clientConfig from "../constant/google-auth.js";

passport.use(
    new GoogleStrategy(
        clientConfig,
        async (accessToken, refreshToken, profile, done) => {
            done(null, profile);
        }
    )
);

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((user, done) => {
    done(null, user);
});