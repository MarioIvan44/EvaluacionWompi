import express from "express"

import registerAdminsController from "../controllers/registersAdmins.js"

const router = express.Router();

router.route("/").post(registerAdminsController.register);
router.route("/").post(registerAdminsController.verifyCode)

export default router;