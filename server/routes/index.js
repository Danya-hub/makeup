import authController from "../controllers/user.js";
import procedureController from "../controllers/procedure.js";
import adminController from "../controllers/admin.js";

const router = {
    auth: authController,
    procedure: procedureController,
    admin: adminController,
};

export default router;
