"use strict";

import {
    Router,
} from "express";

import assignAPI from "../utils/assignAPI.js";
import authController from "../controllers/user.js";
import procedureController from "../controllers/procedure.js";
import adminController from "../controllers/admin.js";

const auth = assignAPI(Router(), authController);
const procedure = assignAPI(Router(), procedureController);
const admin = assignAPI(Router(), adminController);

export {
    auth,
    procedure, 
    admin
}
