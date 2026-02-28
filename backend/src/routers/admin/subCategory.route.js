import {Router} from "express";
import {addSubCategory, updateStatus, deleteSubCategory, getSubcategoryItems, getSubcategorybyCategoryId} from '../../controllers/admin/subCategory.controllers.js';
import { requiredLogin } from "../../middlewares/requiredLogin.midddleware.js";
import multer from "multer"

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

router.post("/addSubcategory", requiredLogin, upload.single("subcategoryImage"), addSubCategory);
router.patch("/updateStatus", requiredLogin, updateStatus);
router.delete("/delete", requiredLogin, deleteSubCategory);
router.get("/getAll", requiredLogin, getSubcategoryItems);
router.get("/getbyCategoryId/:categoryId", requiredLogin, getSubcategorybyCategoryId);

export default router;