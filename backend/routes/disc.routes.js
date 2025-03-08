import express from "express"
import protectRoute from "../middleware/protectRoute.js"
import { createDiscussion, createServer, getAllDiscussions, getAllServers, getServerDetails } from "../controllers/disc.controller.js"

const router = express.Router()

router.post("/createsv", protectRoute, createServer)
router.get("/discussionsall/:serverId", protectRoute, getAllDiscussions)
router.get("/svall", protectRoute, getAllServers)
router.get("/nameofsv/:serverId", protectRoute, getServerDetails)
router.post("/makedisc/:serverId", protectRoute, createDiscussion)

export default router