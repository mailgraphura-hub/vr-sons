import {Router} from "express";
import {addSubscribe} from "../../controllers/customer/subscribe.controllers.js";

const router = Router();

router.post("/", addSubscribe);

export default router