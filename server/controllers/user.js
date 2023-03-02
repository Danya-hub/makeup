import {
  Router
} from "express";
import {
  config
} from "dotenv";
import bcrypt from "bcrypt";

import userValidation from "../validations/user.js";

import checkOnValid from "../middleware/checkOnValid.js";
import isAuth from "../middleware/isAuth.js";

import UserService from "../service/user.js";
import TokenService from "../service/token.js";
import MessageService from "../service/message.js";

import {
  COOKIE_REFRESH_TOKEN_MAX_AGE
} from "../constant/auth.js";
import errors from "../constant/errors.js";

import ApiError from "../utils/apiError.js";

const router = Router();

config();

router.get("/refresh", async (req, res, next) => {
  try {
    const token = req.cookies.refreshToken;
    if (!token) {
      ApiError.unauthorized();
    }

    const decoded = TokenService.checkOnValidToken(
      token,
      process.env.REFRESH_TOKEN_SECRET_KEY
    );

    const user = await UserService.getUser({
      _id: decoded.id,
    });

    const {
      refreshToken,
      ...rez
    } = user;

    res.cookie("refreshToken", token, {
      maxAge: COOKIE_REFRESH_TOKEN_MAX_AGE,
      httpOnly: true,
    });
    res.status(200).json(rez);

    next();
  } catch (error) {
    next(error);
  }
});

router.post("/signup", async (req, res, next) => {
  try {
    const newUser = await UserService.createUser(req.body);

    const {
      refreshToken,
      ...rez
    } = newUser;

    res.cookie("refreshToken", refreshToken, {
      maxAge: COOKIE_REFRESH_TOKEN_MAX_AGE,
      httpOnly: true,
    });
    res.status(201).json(rez);

    next();
  } catch (error) {
    next(error);
  }
});

router.post("/signin", userValidation.signin, checkOnValid, async (req, res, next) => {
  try {
    const foundUser = await UserService.byChannel(req.body);

    const {
      refreshToken,
      ...rez
    } = foundUser;

    res.cookie("refreshToken", refreshToken, {
      maxAge: COOKIE_REFRESH_TOKEN_MAX_AGE,
      httpOnly: true,
    });
    res.status(201).json(rez);

    next();
  } catch (error) {
    next(error);
  }
});

router.post("/logout", isAuth, checkOnValid, (req, res, next) => {
  try {
    const {
      refreshToken
    } = req.cookies;

    res.clearCookie("refreshToken");

    res.status(200).json({
      msg: "The user is logout",
      token: refreshToken,
    });

    next();
  } catch (error) {
    next(error);
  }
});

router.post("/sendPassword", userValidation.sendPassword, checkOnValid, async (req, res, next) => {
  try {
    const {
      email
    } = req.body;
    const passwordFilter = {
      topic: "password",
      email,
    };

    const foundMessage = await MessageService.get(passwordFilter);

    if (foundMessage) {
      res.status(200).json({
        passwordToken: foundMessage.template,
      });

      next();
      return;
    }

    const sendedPassword = await UserService.sendPassword(email);

    res.status(201).json({
      passwordToken: sendedPassword,
    });

    next();
  } catch (error) {
    next(error);
  }
});

router.post("/checkPassword", async (req, res, next) => {
  try {
    const {
      email,
      password
    } = req.body;

    const foundMessage = await MessageService.get({
      topic: "password",
      email,
    });

    if (!foundMessage) {
      ApiError.noAccess("Time is over");
    }

    const isEquil = bcrypt.compareSync(password, foundMessage.template);

    if (!isEquil) {
      ApiError.badRequest(errors.wrongSignin());
    }

    res.status(200).json({
      ...req.body,
      password: foundMessage.template,
    });

    next();
  } catch (error) {
    next(error);
  }
});

router.post("/requestResetPassword", async (req, res, next) => {
  try {
    const {
      email
    } = req.body;

    await UserService.resetPassword(email);

    res.status(200).json({
      msg: "There was submited message for reseting password",
    });

    next();
  } catch (error) {
    next(error);
  }
});

router.post("/checkNewPassword", async (req, res, next) => {
  try {
    const {
      newPassword
    } = req.body;
    const {
      key,
      email
    } = req.query;

    await UserService.checkNewPassword(key, email, newPassword);

    res.status(200).json({
      msg: "Password is changed",
    });

    next();
  } catch (error) {
    next(error);
  }
});

export default router;
