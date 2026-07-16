import express from "express"
import ticketsController from "../controllers/ticketsController.js"

import { validateAuthCookie } from "../middlewares/authMiddleware.js"

const router = express.Router();

router.route("/")
.get(validateAuthCookie(["admin"], ticketsController.get))
.post(validateAuthCookie(["customer"], ticketsController.post))


router.route("/:id")
.put(validateAuthCookie(["admin", "customer"], ticketsController.put))
.delete(validateAuthCookie(["admin"], ticketsController.delete))

export default router;