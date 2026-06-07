import { Router } from "express";
import { protect } from "../middleware/authMiddleware.js"
import { liveblocksAuth } from "../controllers/liveblocksController.js";

const router = Router();

router.post("/liveblocks-auth", protect, liveblocksAuth);


export default router;