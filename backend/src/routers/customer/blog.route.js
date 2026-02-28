import {Router} from "express";
import {getBlogs, getBlogById} from "../../controllers/customer/blog.controllers.js";

const router = Router();

router.get('/', getBlogs);
router.get("/blogId", getBlogById);

export default router;