import { Router } from "express";
import { getUserNotifications, patchUserNotification, postUserNotification } from "../controllers/userController.js";

const router = Router();

router.get("/:user/notifications", getUserNotifications);
router.post("/:user/notifications", postUserNotification);
router.patch("/:user/notifications", patchUserNotification);


export default router;