import { Router } from "express";

import isAuth from "../middleware/isAuth.js";
import checkOnValid from "../middleware/checkOnValid.js";
import roleAccess from "../middleware/roleAccess.js";

import ProcedureController from "../controllers/procedure.js";
import TypeService from "../service/type.js";

const router = Router();

router.get("/byDay/:date", ProcedureController.byDay);
router.get("/byUser", isAuth, checkOnValid, ProcedureController.byUser);
router.get("/allTypes", TypeService.all);
router.get("/defaultType/:country", TypeService.defaultType);
router.post("/createProcedure", isAuth, checkOnValid, ProcedureController.createProcedure);
router.post("/createType", isAuth, roleAccess(["admin"]), checkOnValid, TypeService.create);
router.delete("/removeProcedure/:id", isAuth, checkOnValid, ProcedureController.removeByUserId);

export default router;
