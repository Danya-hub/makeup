import {
    Router,
} from "express";

import assignAPIActions from "../utils/assignAPIActions.js";
import authController from "../controllers/user.js";
import procedureController from "../controllers/procedure.js";
import adminController from "../controllers/admin.js";

const auth = assignAPIActions(Router(), authController);
const procedure = assignAPIActions(Router(), procedureController);
const admin = assignAPIActions(Router(), adminController);

export {
    auth,
    procedure, 
    admin
}
