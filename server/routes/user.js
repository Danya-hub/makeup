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
  UserController.sendPasswordForCompare
);
router.post("/comparePasswordByEmail", UserController.comparePasswordByEmail);
router.post("/comparePasswordByUserId", UserController.comparePasswordByUserId);
router.post("/editUserById", UserController.editUserById);
router.post(
  "/sendLinkForResetingPassword",
  userValidation.sendLinkForResetingPassword,
  checkOnValid,
  UserController.sendLinkForResetingPassword
);
router.post("/resetPassword", UserController.resetPassword);
router.get("/unique/:key/:value", UserController.isUnique);

export default router;