import {Router} from "express";
import {createNotification, getUserNotifications, getUnreadCount, markAsRead, deleteNotification} from "../../controllers/common/notification.controllers.js";
import {requiredLogin} from "../../middlewares/requiredLogin.midddleware.js";

const router = Router();

router.post("/", createNotification);

router.get("/", requiredLogin, getUserNotifications);

router.get("/unread-count", requiredLogin, getUnreadCount);

router.patch("/:id/read", requiredLogin, markAsRead);

router.delete("/:id", requiredLogin, deleteNotification);

export default router;