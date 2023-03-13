import authController from "./user.js";
import procedureController from "./procedure.js";

const router = {
  auth: authController,
  procedure: procedureController,
};

export default router;
