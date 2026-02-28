import {Router} from "express";
import {getCategory,getCategoryById,getSubCategoryByCategoryId, getSubCategory, getSubCategoryById, getProductByParentId, getProduct, getProductById} from "../../controllers/customer/product.controllers.js";

const router = Router();

router.get("/category", getCategory);
router.get("/category/:categoryId", getCategoryById);
router.get("/subcategorybycategoryId", getSubCategoryByCategoryId);
router.get("/subcategory", getSubCategory);
router.get("/subcategory/:subcategoryId", getSubCategoryById);
router.get("/productbyparentId", getProductByParentId);
router.get("/product", getProduct);
router.get("/product/:productId", getProductById);

export default router;