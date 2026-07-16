import express from "express"
import wompiController from "../controllers/wompiController.js"

const router = express.Router();

router.route("/token").post(wompiController.generateToken)
router.route("/paymentTest").post(wompiController.paymentTest)
export default router;