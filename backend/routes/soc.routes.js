import express from "express"
import protectRoute from "../middleware/protectRoute.js"
import { getAllMessages } from "../controllers/soc.controller.js"

const router = express.Router()

router.get("/allmessages/:discId", protectRoute, getAllMessages)

export default router