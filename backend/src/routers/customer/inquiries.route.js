import {Router} from "express";
import {generateInquiries, getMyInquiries} from "../../controllers/customer/inquiries.controllers.js";
import { requiredLogin } from "../../middlewares/requiredLogin.midddleware.js";

const router = Router();

router.post("/generateInquiry", requiredLogin, generateInquiries);
router.get("/getMyInquiries", requiredLogin, getMyInquiries);

export default router;