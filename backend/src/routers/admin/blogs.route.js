import {Router} from "express";
import {addBlog, updateBlogs, deleteBlogs,getBlogs, getBlogById} from "../../controllers/admin/blogs.controllers.js";
import {requiredLogin} from "../../middlewares/requiredLogin.midddleware.js";
import multer from "multer";

const router = Router();

const storage = multer.memoryStorage();

const upload = multer({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith("image/")) {
            cb(null, true);
        } else {
            cb(new Error("Only image files are allowed"), false);
        }
    }
});

router.post("/addBlog", requiredLogin, upload.array("blogMedia", 5), addBlog);
router.put("/update", requiredLogin, upload.array("blogMedia", 5), updateBlogs);
router.delete("/delete", requiredLogin, deleteBlogs);
router.get('/', requiredLogin, getBlogs);
router.get("/blogId",requiredLogin, getBlogById);

export default router;