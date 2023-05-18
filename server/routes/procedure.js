import {
    Router
} from "express";

import isAuth from "../middleware/isAuth.js";
import checkOnValid from "../middleware/checkOnValid.js";
import roleAccess from "../middleware/roleAccess.js";

import ProcedureController from "../controllers/procedure.js";
import TypeService from "../service/type.js";

const router = Router();

router.get("/byDay/:date", ProcedureController.getByDay);
router.get("/byUser", isAuth, checkOnValid, ProcedureController.getByUser);
router.get("/allTypes/:country", TypeService.all);
router.get("/default/:country", ProcedureController.defaultValue);
router.get("/defaultType/:country", TypeService.defaultType);
router.post("/createProcedure", isAuth, checkOnValid, ProcedureController.createProcedure);
router.post("/createType", isAuth, roleAccess(["admin"]), checkOnValid, TypeService.create);
router.post("/removeProcedureByUser/:id", isAuth, checkOnValid, ProcedureController.removeByUserId);
router.post("/deleteProcedureById/:id", isAuth, checkOnValid, ProcedureController.removeById);
router.post("/updateProcedure", isAuth, checkOnValid, ProcedureController.update);

export default router;