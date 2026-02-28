import {Router} from "express";
import {addCategory, getCategoryItems, updateStatus, deleteCategory} from "../../controllers/admin/category.contoller.js";
import {requiredLogin} from "../../middlewares/requiredLogin.midddleware.js";
import multer from "multer"

const router = Router();

const storage = multer.memoryStorage();

const upload = multer({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith("image/")) {
            cb(null, true); // allow all image types
        } else {
            cb(new Error("Only image files are allowed"), false);
        }
    }
});

router.post("/addCategory", requiredLogin, upload.single("categoryImage"), addCategory);
router.get("/categoryItems", requiredLogin, getCategoryItems);
router.patch("/updateStatus", requiredLogin, updateStatus);
router.delete("/deleteCategory", requiredLogin, deleteCategory);

export default router;

