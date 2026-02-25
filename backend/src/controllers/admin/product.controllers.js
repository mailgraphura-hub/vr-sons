import { cloudinary } from "../../config/cloudinary.config.js";
import productModel from "../../models/common/product.model.js";
import { ApiError } from "../../utils/api-error.js";
import { ApiResponse } from "../../utils/api-response.js";
import mongoose from "mongoose";

const addProduct = async (req, res) => {
    try {

        if (!req.files) {
            return res.status(404).json(new ApiError(404, "Category Image is Required"));
        }

        const { categoryId,subCategoryId, name, skuId, description, specifications,  status } = req.body;

        const productImage = await Promise.all(
            req.files.map(file => {
                return new Promise((resolve, reject) => {
                    const stream = cloudinary.uploader.upload_stream(
                        {folder: "product"},
                        (err, result) => {
                            if(err) reject(err);
                            else resolve(result.secure_url);
                        }
                    );
                    stream.end(file.buffer);
                })
            })
        )

        const productDetail = await productModel.create({
            categoryId,
            subCategoryId,
            name,
            skuId,
            description,
            specifications,
            status,
            productImage
        })

        if (!productDetail) {
            return res.status(401).json(new ApiError(401, "Failed to save new category"));
        }

        return res.status(200).json(new ApiResponse(200, productDetail, "Category Add Successfully"));
    }
    catch (err) {
        return res.status(500).json(new ApiError(500, err.message, [{ message: err.message, name: err.name }]));
    }
}

const updateStatus = async (req, res) => {
    try {
        const { productId, status } = req.body;

        const productDetail = await productModel.findByIdAndUpdate(
            productId, {
            status
        })

        if (!productDetail) {
            return res.status(401).json(new ApiError(401, 'Failed to Update Status'));
        }

        return res.status(200).json(new ApiResponse(200, null, "Sccessful"));
    }
    catch (err) {
        return res.status(500).json(new ApiError(500, err.message, [{ message: err.message, name: err.name }]));
    }
}

const deleteProduct = async (req, res) => {
    try {
        const { productId } = req.query;

        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json(
                new ApiError(400, "Invalid SubCategory ID")
            );
        }

        const productCategory = await productModel.findById(productId);

        if (!productCategory) {
            return res.status(404).json(
                new ApiError(404, "SubCategory Not Found")
            );
        }

        const productDetails = await productModel.findByIdAndDelete(productId);

        console.log(productDetails)

        if (!productDetails) {
            return res.status(400).json(new ApiError(400, "Failed to Delete Category"));
        }

        return res.status(200).json(new ApiResponse(200, null, "Successful"));
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

        const [productList, totalItems] = await Promise.all([
            productModel.find({})
                .skip(skip)
                .limit(limit)
                .sort({ createdAt: -1 }),  // optional (latest first)
            productModel.countDocuments()
        ]);

        if (productList.length === 0) {
            return res.status(404).json(
                new ApiError(404, "No Products Found.")
            );
        }

        return res.status(200).json(
            new ApiResponse(200, {
                totalItems,
                currentPage: page,
                totalPages: Math.ceil(totalItems / limit),
                data: productList
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

const getProductbyCategoryId = async (req, res) => {
    try {
        const { categoryId, subCategoryId } = req.query;

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const filter = {};

        if (categoryId) {
            if (!mongoose.Types.ObjectId.isValid(categoryId)) {
                return res.status(400).json(new ApiError(400, "Invalid Category ID"));
            }
            filter.categoryId = categoryId;
        }

        if (subCategoryId) {
            if (!mongoose.Types.ObjectId.isValid(subCategoryId)) {
                return res.status(400).json(new ApiError(400, "Invalid SubCategory ID"));
            }
            filter.subCategoryId = subCategoryId;
        }

        const [productList, totalItems] = await Promise.all([
            productModel.find(filter)
                .skip(skip)
                .limit(limit)
                .sort({ createdAt: -1 }),
            productModel.countDocuments(filter)
        ]);

        if (productList.length === 0) {
            return res.status(404).json(
                new ApiError(404, "No Products Found")
            );
        }

        return res.status(200).json(
            new ApiResponse(200, {
                totalItems,
                currentPage: page,
                totalPages: Math.ceil(totalItems / limit),
                data: productList
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

export { addProduct, updateStatus, deleteProduct, getProduct, getProductbyCategoryId }