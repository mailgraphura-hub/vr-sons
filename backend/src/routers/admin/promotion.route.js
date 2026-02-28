import {Router} from "express";
import {sendPromotion} from "../../controllers/admin/promotion.controllers.js";
import { requiredLogin } from "../../middlewares/requiredLogin.midddleware.js";

const router = Router();

router.post("/", requiredLogin, sendPromotion);

export default router