import {Router} from "express";
import {updateInquiryStatus, getInquiries, getInquiriesByDate} from "../../controllers/admin/inquiry.controllers.js";
import {requiredLogin} from "../../middlewares/requiredLogin.midddleware.js"

const router = Router();

router.put("/status", requiredLogin, updateInquiryStatus);
router.get("/", requiredLogin, getInquiries);
router.get("/customerdate", requiredLogin, getInquiriesByDate);

export default router