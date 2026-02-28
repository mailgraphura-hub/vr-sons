import { cloudinary } from "../../config/cloudinary.config.js";
import subCategory_Model from "../../models/common/sub_category.model.js";
import productModel from "../../models/common/product.model.js";
import { ApiError } from "../../utils/api-error.js";
import { ApiResponse } from "../../utils/api-response.js";
import mongoose from "mongoose";

const addSubCategory = async (req, res) => {
    try {

        if (!req.user.role) {
            return res.status(401).json(new ApiError(401, "Your are not Auth"))
        }

        if (!req.file) {
            return res.status(404).json(new ApiError(404, "Category Image is Required"));
        }

        const { categoryId, name, skuId, decription, status } = req.body;

        const subcategoryImage = await new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
                { folder: "image" },
                (err, result) => {
                    if (err) reject(err);
                    else resolve(result.secure_url);
                }
            );
            stream.end(req.file.buffer);
        })

        const subCategoryDetail = await subCategory_Model.create({
            categoryId,
            name,
            skuId,
            decription,
            status,
            subcategoryImage
        })

        if (!subCategoryDetail) {
            return res.status(401).json(new ApiError(401, "Failed to save new category"));
        }

        return res.status(200).json(new ApiResponse(200, subCategoryDetail, "Category Add Successfully"));
    }
    catch (err) {
        return res.status(500).json(new ApiError(500, err.message, [{ message: err.message, name: err.name }]));
    }
}

const updateStatus = async (req, res) => {
    try {

        if (!req.user.role) {
            return res.status(401).json(new ApiError(401, "Your are not Auth"))
        }

        const { subCategoryId, status } = req.body;

        const subCategoryDetail = await subCategory_Model.findByIdAndUpdate(
            subCategoryId, {
            status
        })

        if (!subCategoryDetail) {
            return res.status(401).json(new ApiError(401, 'Failed to Update Status'));
        }

        return res.status(200).json(new ApiResponse(200, null, "Sccessful"));
    }
    catch (err) {
        return res.status(500).json(new ApiError(500, err.message, [{ message: err.message, name: err.name }]));
    }
}

const deleteSubCategory = async (req, res) => {
    try {

        if (!req.user.role) {
            return res.status(401).json(new ApiError(401, "Your are not Auth"))
        }

        const { subCategoryId } = req.query;

        if (!mongoose.Types.ObjectId.isValid(subCategoryId)) {
            return res.status(400).json(
                new ApiError(400, "Invalid SubCategory ID")
            );
        }

        const subCategory = await subCategory_Model.findById(subCategoryId);

        if (!subCategory) {
            return res.status(404).json(
                new ApiError(404, "SubCategory Not Found")
            );
        }

        await Promise.all([
            productModel.deleteMany({ subCategoryId }),
            subCategory_Model.findByIdAndDelete(subCategoryId)
        ]);

        return res.status(200).json(
            new ApiResponse(
                200,
                null,
                "SubCategory and related products deleted successfully"
            )
        );

    } catch (err) {
        return res.status(500).json(
            new ApiError(500, err.message, [
                { message: err.message, name: err.name }
            ])
        );
    }
};

const getSubcategoryItems = async (req, res) => {
    try {

        if (!req.user.role) {
            return res.status(401).json(new ApiError(401, "Your are not Auth"))
        }

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

        const skip = (page - 1) * limit;

        const [subCategoryList, totalItems] = await Promise.all([
            subCategory_Model.find({})
                .skip(skip)
                .limit(limit)
                .sort({ createdAt: -1 }),
            subCategory_Model.countDocuments()
        ]);

        if (subCategoryList.length === 0) {
            return res.status(404).json(
                new ApiError(404, "No Item present in SubCategory.")
            );
        }

        const available = await subCategory_Model.find({ status: "Available" });
        const unavailable = await subCategory_Model.find({ status: "Un-Available" });



        return res.status(200).json(
            new ApiResponse(200, {
                available: available.length,
                unavailable: unavailable.length,
                totalItems,
                currentPage: page,
                totalPages: Math.ceil(totalItems / limit),
                data: subCategoryList
            }, "Successful")
        );

    } catch (err) {
        return res.status(500).json(
            new ApiError(500, err.message, [
                { message: err.message, name: err.name }
            ])
        );
    }
};

const getSubcategorybyCategoryId = async (req, res) => {
    try {

        if (!req.user.role) {
            return res.status(401).json(new ApiError(401, "Your are not Auth"))
        }

        const { categoryId } = req.params;

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        if (!mongoose.Types.ObjectId.isValid(categoryId)) {
            return res.status(400).json(
                new ApiError(400, "Invalid Category ID")
            );
        }

        const [subCategoryList, totalItems] = await Promise.all([
            subCategory_Model.find({ categoryId })
                .skip(skip)
                .limit(limit)
                .sort({ createdAt: -1 }),
            subCategory_Model.countDocuments({ categoryId })
        ]);

        if (subCategoryList.length === 0) {
            return res.status(404).json(
                new ApiError(404, "No Sub-Category Found")
            );
        }

        return res.status(200).json(
            new ApiResponse(200, {
                totalItems,
                currentPage: page,
                totalPages: Math.ceil(totalItems / limit),
                data: subCategoryList
            }, "Successful")
        );

    } catch (err) {
        return res.status(500).json(
            new ApiError(500, err.message, [
                { message: err.message, name: err.name }
            ])
        );
    }
};

export { addSubCategory, updateStatus, deleteSubCategory, getSubcategoryItems, getSubcategorybyCategoryId }