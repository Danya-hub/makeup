import {
  Router
} from "express";

import TypesProcedureModel from "../models/typesProcedure.js";
import StatesProcedureModel from "../models/statesProcedure.js";

import isAuth from "../middleware/isAuth.js";
import checkOnValid from "../middleware/checkOnValid.js";
import roleAccess from "../middleware/roleAccess.js";

import Procedure from "../service/procedure.js";

const router = Router();

router.get("/byDay/:newDate", async (req, res, next) => {
  try {
    const {
      newDate
    } = req.params;

    const foundProcedure = await Procedure.byDay(newDate);

    res.status(200).json(foundProcedure);

    next();
  } catch (error) {
    next(error);
  }
});

router.get("/byUser", isAuth, checkOnValid, async (req, res, next) => {
  try {
    const {
      user
    } = req.body;

    const foundProcedure = await Procedure.byUser(user);

    res.status(200).json(foundProcedure);

    next();
  } catch (error) {
    next(error);
  }
});

router.get("/allTypes", async (req, res, next) => {
  try {
    const types = await TypesProcedureModel.find();

    res.status(200).json(types);

    next();
  } catch (error) {
    next(error);
  }
});

router.get("/allStates", async (req, res, next) => {
  try {
    const states = await StatesProcedureModel.find();

    res.status(200).json(states);

    next();
  } catch (error) {
    next(error);
  }
});

router.get("/defaultType", async (req, res, next) => {
  try {
    const type = await TypesProcedureModel.findOne();
    const state = await StatesProcedureModel.findOne();

    res.status(200).json({
      type,
      state,
    });

    next();
  } catch (error) {
    next(error);
  }
});

router.post("/create", isAuth, checkOnValid, async (req, res, next) => {
  try {
    const createdProcedure = await Procedure.createProcedure(req.body);

    res.status(201).json(createdProcedure);

    next();
  } catch (error) {
    next(error);
  }
});

router.post("/createProcType", isAuth, roleAccess(["admin"]), checkOnValid, async (req, res, next) => {
  try {
    const createdNewProcType = await Procedure.createProcType(req.body);

    res.status(201).json(createdNewProcType);

    next();
  } catch (error) {
    next(error);
  }
});

router.delete("/remove/:id", isAuth, checkOnValid, async (req, res, next) => {
  try {
    await Procedure.removeByUser(req.params.id);

    res.status(200).json({
      msg: "The procedure is deleted",
    });

    next();
  } catch (error) {
    next(error);
  }
});

export default router;
