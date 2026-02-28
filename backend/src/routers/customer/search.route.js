import {Router} from "express";
import {search,searchCategories, searchSubcategories, searchProducts, getCategorySuggestions, getSubcategorySuggestions, getProductSuggestions, getSearchSuggestions} from "../../controllers/customer/search.controllers.js";

const router = Router();

router.get("/", search);
router.get("/category", searchCategories);
router.get("/subcategory", searchSubcategories);
router.get("/product", searchProducts);
router.get("/suggestion", getSearchSuggestions);
router.get("/suggestion/category", getCategorySuggestions);
router.get("/suggestion/subcategory", getSubcategorySuggestions);
router.get("/suggestion/product", getProductSuggestions);

export default router;