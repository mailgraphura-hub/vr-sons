import categoryModel from '../../models/common/category.model.js';
import subcategoryModel from "../../models/common/sub_category.model.js";
import productModel from "../../models/common/product.model.js";
import { ApiError } from "../../utils/api-error.js";
import { ApiResponse } from "../../utils/api-response.js";
import mongoose from 'mongoose';

const getCategory = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

        const skip = (page - 1) * limit;

        const categoryList = await categoryModel
            .find({ status: "Available" })
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 });

        if (categoryList.length === 0) {
            return res.status(404).json(new ApiError(404, "No Category Found."));
        }

        const totalItems = await categoryModel.countDocuments();

        return res.status(200).json(new ApiResponse(
            200,
            {
                totalItems,
                currentPage: page,
                totalPage: Math.ceil(totalItems / limit),
                categoryList
            },
            "Successful"
        ))


    } catch (err) {
        return res.status(500).json(new ApiError(500, err.message, [{ message: err.message, name: err.name }]));
    }
}

const getCategoryById = async (req, res) => {
    try {

        const { categoryId } = req.params;
        if (!mongoose.Types.ObjectId.isValid(categoryId)) {
            return res.status(400).json({ message: "Invalid Category ID" });
        }

        const category = await categoryModel.findById(
            categoryId
        );

        if (!category) {
            return res.status(404).json(new ApiError(404, "No Category Found."));
        }

        return res.status(200).json(new ApiResponse(
            200,
            category,
            "Successful"
        ))


    } catch (err) {
        return res.status(500).json(new ApiError(500, err.message, [{ message: err.message, name: err.name }]));
    }
}

const getSubCategoryByCategoryId = async (req, res) => {
    try {
        let { categoryId } = req.query;

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

        const skip = (page - 1) * limit;

        const subcategoryList = await subcategoryModel
            .find({
                categoryId: categoryId,
                status: "Available"
            })
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 });

        if (subcategoryList.length === 0) {
            return res.status(404).json(new ApiError(404, "No SubCategory Found"));
        }

        const totalItems = await subcategoryModel.countDocuments({ categoryId: categoryId });

        return res.status(200).json(new ApiResponse(
            200, {
            totalItems,
            currentPage: page,
            totalPage: Math.ceil(totalItems / limit),
            subcategoryList
        },
            "Successfull"
        )
        )
    }
    catch (err) {
        return res.status(500).json(new ApiError(500, err.message, [{ message: err.message, name: err.name }]));
    }
}

const getSubCategory = async (req, res) => {
    try {

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

        const skip = (page - 1) * limit;

        const subcategoryList = await subcategoryModel
            .find({
                status: "Available"
            })
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 });

        if (subcategoryList.length === 0) {
            return res.status(404).json(new ApiError(404, "No SubCategory Found"));
        }

        const totalItems = await subcategoryModel.countDocuments({ status: "Available" });

        return res.status(200).json(new ApiResponse(
            200, {
            totalItems,
            currentPage: page,
            totalPage: Math.ceil(totalItems / limit),
            subcategoryList
        },
            "Successfull"
        )
        )
    }
    catch (err) {
        return res.status(500).json(new ApiError(500, err.message, [{ message: err.message, name: err.name }]));
    }
}

const getSubCategoryById = async (req, res) => {
    try {

        const { subcategoryId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(subcategoryId)) {
            return res.status(400).json({ message: "Invalid Category ID" });
        }

        const subcategory = await subcategoryModel.findById(
            subcategoryId
        );

        if (!subcategory) {
            return res.status(404).json(new ApiError(404, "No Category Found."));
        }

        return res.status(200).json(new ApiResponse(
            200,
            subcategory,
            "Successful"
        ))


    } catch (err) {
        return res.status(500).json(new ApiError(500, err.message, [{ message: err.message, name: err.name }]));
    }
}

const getProductByParentId = async (req, res) => {
    try {
        const {subCategoryId } = req.query;

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

        const skip = (page - 1) * limit;

        const productList = await productModel.find(
            {
                subCategoryId: subCategoryId,
                status: "Available"
            }
        )
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 });

        if (productList.length === 0) {
            return res.status(404).json(new ApiError(404, "No Product Found."));
        }

        const totalItems = await productModel.countDocuments({
            subCategoryId: subCategoryId,
            status: "Available"
        });

        return res.status(200).json(
            new ApiResponse(200, {
                totalItems,
                currentPage: page,
                totalPage: Math.ceil(totalItems / limit),
                productList
            },
                "Successful")
        )
    }
    catch (err) {
        return res.status(500).json(new ApiError(500, err.message, [{ message: err.message, name: err.name }]));
    }
}

const getProduct = async (req, res) => {
    try {

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

        const skip = (page - 1) * limit;

        const productList = await productModel.aggregate([
            {
                $match: {
                }
            },
            {
                $sort: { createdAt: -1 }
            },
            {
                $skip: skip
            },
            {
                $limit: limit
            },
            {
                $lookup: {
                    from: "categories",
                    localField: "categoryId",
                    foreignField: "_id",
                    as: "category"
                }
            },
            {
                $unwind: "$category"
            },
            {
                $project: {
                    name: 1,
                    skuId: 1,
                    description: 1,
                    specifications: 1,
                    productImage: 1,
                    status: 1,
                    createdAt: 1,
                    "category": "$category"
                }
            }
        ]);

        if (productList.length === 0) {
            return res.status(404).json(new ApiError(404, "No Product Found."));
        }

        const totalItems = await productModel.countDocuments({});

        return res.status(200).json(
            new ApiResponse(200, {
                totalItems,
                currentPage: page,
                totalPage: Math.ceil(totalItems / limit),
                productList
            },
                "Successful")
        )
    }
    catch (err) {
        return res.status(500).json(new ApiError(500, err.message, [{ message: err.message, name: err.name }]));
    }
}

const getProductById = async (req, res) => {
    try {

        const { productId } = req.params;
        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({ message: "Invalid Category ID" });
        }

        const product = await productModel.findById(
            productId
        );

        if (!product) {
            return res.status(404).json(new ApiError(404, "No Category Found."));
        }

        return res.status(200).json(new ApiResponse(
            200,
            product,
            "Successful"
        ))


    } catch (err) {
        return res.status(500).json(new ApiError(500, err.message, [{ message: err.message, name: err.name }]));
    }
}

export { getCategory, getCategoryById, getSubCategoryByCategoryId, getSubCategory, getSubCategoryById, getProductByParentId, getProduct, getProductById };