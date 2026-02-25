import {Router} from "express";
import {search,searchCategories, searchSubcategories, searchProducts, getCategorySuggestions, getSubcategorySuggestions, getProductSuggestions, getSearchSuggestions} from "../../controllers/admin/seach.controllers.js";
import { requiredLogin } from "../../middlewares/requiredLogin.midddleware.js";

const router = Router();

router.get("/", requiredLogin, search);
router.get("/category",requiredLogin, searchCategories);
router.get("/subcategory",requiredLogin, searchSubcategories);
router.get("/product",requiredLogin, searchProducts);
router.get("/suggestion",requiredLogin, getSearchSuggestions);
router.get("/suggestion/category",requiredLogin, getCategorySuggestions);
router.get("/suggestion/subcategory",requiredLogin, getSubcategorySuggestions);
router.get("/suggestion/product",requiredLogin, getProductSuggestions);


export default router;