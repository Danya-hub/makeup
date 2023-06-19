import {
    Router
} from "express";

import isAuth from "../middleware/isAuth.js";
import checkOnValid from "../middleware/checkOnValid.js";
import roleAccess from "../middleware/roleAccess.js";

import ProcedureController from "../controllers/procedure.js";
import TypeService from "../service/type.js";

const router = Router();

router.get("/columns/:query", ProcedureController.getProceduresByQuery);
router.get("/byDay/:date", ProcedureController.getByDay);
router.get("/allTypes/:country", TypeService.all);
router.get("/default/:country", ProcedureController.defaultValue);
router.get("/reviews", ProcedureController.getReviewsByQuery);
router.post("/makeReview", isAuth, checkOnValid, ProcedureController.makeReview);
router.post("/deleteReview/:id", isAuth, checkOnValid, ProcedureController.deleteReviewById);
router.post("/updateReview", isAuth, checkOnValid, ProcedureController.updateReview);
router.get("/defaultType/:country", TypeService.defaultType);
router.post("/createProcedure", isAuth, checkOnValid, ProcedureController.createProcedure);
router.post("/createType", isAuth, roleAccess(["admin"]), checkOnValid, TypeService.create);
router.post("/deleteProcedureByUser/:id", isAuth, checkOnValid, ProcedureController.deleteByUserId);
router.post("/deleteProcedureById/:id", isAuth, checkOnValid, ProcedureController.deleteById);
router.post("/updateProcedure", isAuth, checkOnValid, ProcedureController.updateProc);

export default router;