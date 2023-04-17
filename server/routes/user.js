import {
  Router
} from "express";
import {
  config
} from "dotenv";

import userValidation from "../validations/user.js";

import checkOnValid from "../middleware/checkOnValid.js";
import isAuth from "../middleware/isAuth.js";

import UserController from "../controllers/user.js";

const router = Router();

config();

router.get("/refresh", UserController.refresh);
router.post("/signup", UserController.createUser);
router.post("/signin", userValidation.signin, checkOnValid, UserController.login);
router.post("/logout", isAuth, checkOnValid, UserController.logout);
router.post(
  "/sendPasswordForCompare",
  userValidation.sendPasswordForCompare,
  checkOnValid,
  UserController.sendPasswordForCompare
);
router.post("/comparePassword", UserController.comparePassword);
router.post(
  "/sendLinkForResetingPassword",
  userValidation.sendLinkForResetingPassword,
  checkOnValid,
  UserController.sendLinkForResetingPassword
);
router.post("/resetPassword", UserController.resetPassword);

export default router;