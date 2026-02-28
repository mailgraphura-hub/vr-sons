import {Router} from "express";
import {addProduct, getProduct, getProductbyCategoryId, updateStatus, deleteProduct} from '../../controllers/admin/product.controllers.js';
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

router.post("/addProduct", requiredLogin, upload.array("productImage", 5), addProduct);
router.patch("/updateStatus", requiredLogin, updateStatus);
router.delete("/delete", requiredLogin, deleteProduct);
router.get("/getAll", requiredLogin, getProduct);
router.get("/getbySubCategoryId", requiredLogin, getProductbyCategoryId);

export default router;