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

router.get("/refresh", isAuth, checkOnValid, UserController.refresh);
router.post("/signup", UserController.createUser);
router.post("/signin", userValidation.signin, checkOnValid, UserController.loginUser);
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
  // isAuth,
  userValidation.sendLinkForResetingPassword,
  checkOnValid,
  UserController.sendLinkForResetingPassword
);
router.post("/resetPassword", isAuth, checkOnValid, UserController.resetPassword);

export default router;