import { cloudinary } from "../../config/cloudinary.config.js";
import categoryModel from "../../models/common/category.model.js";
import subCategory_Model from "../../models/common/sub_category.model.js";
import productModel from "../../models/common/product.model.js";
import { ApiError } from "../../utils/api-error.js";
import { ApiResponse } from "../../utils/api-response.js";

const addCategory = async (req, res) => {
    try {

        if (!req.user.role) {
            return res.status(401).json(new ApiError(401, "Your are not Auth"))
        }


        if (!req.file) {
            return res.status(404).json(new ApiError(404, "Category Image is Required"));
        }

        const { name, skuId, decription, status } = req.body;

        const categoryImage = await new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
                { folder: "image" },
                (err, result) => {
                    if (err) reject(err);
                    else resolve(result.secure_url);
                }
            );
            stream.end(req.file.buffer);
        })

        const categoryDetail = await categoryModel.create({
            name,
            skuId,
            decription,
            status,
            categoryImage
        })

        if (!categoryDetail) {
            return res.status(401).json(new ApiError(401, "Failed to save new category"));
        }

        return res.status(200).json(new ApiResponse(200, categoryDetail, "Category Add Successfully"));
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
        const { categoryId, status } = req.body;

        const categoryDetail = await categoryModel.findByIdAndUpdate(
            categoryId, {
            status
        })

        if (!categoryDetail) {
            return res.status(401).json(new ApiError(401, 'Failed to Update Status'));
        }

        return res.status(200).json(new ApiResponse(200, null, "Sccessful"));
    }
    catch (err) {
        return res.status(500).json(new ApiError(500, err.message, [{ message: err.message, name: err.name }]));
    }
}

const deleteCategory = async (req, res) => {
    try {

        if (!req.user.role) {
            return res.status(401).json(new ApiError(401, "Your are not Auth"))
        }

        const { categoryId } = req.body;

        if (!mongoose.Types.ObjectId.isValid(categoryId)) {
            return res.status(400).json(
                new ApiError(400, "Invalid Category ID")
            );
        }

        const category = await categoryModel.findById(categoryId);
        if (!category) {
            return res.status(404).json(
                new ApiError(404, "Category Not Found")
            );
        }

        await Promise.all([
            subCategory_Model.deleteMany({ categoryId }),
            productModel.deleteMany({ categoryId }),
            categoryModel.findByIdAndDelete(categoryId)
        ]);

        return res.status(200).json(
            new ApiResponse(
                200,
                null,
                "Category and related data deleted successfully"
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

const getCategoryItems = async (req, res) => {
    try {

        if (!req.user.role) {
            return res.status(401).json(new ApiError(401, "Your are not Auth"))
        }

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

        const skip = (page - 1) * limit;

        const categoryList = await categoryModel
            .find({})
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 });

        if (categoryList.length === 0) {
            return res.status(404).json(
                new ApiError(404, "No Item present in Category.")
            );
        }

        const totalItems = await categoryModel.countDocuments();

        return res.status(200).json(
            new ApiResponse(200, {
                totalItems,
                currentPage: page,
                totalPages: Math.ceil(totalItems / limit),
                data: categoryList
            }, "Successful")
        );

    } catch (err) {
        return res.status(500).json(
            new ApiError(500, err.message, [{ message: err.message, name: err.name }])
        );
    }
};

export { addCategory, updateStatus, deleteCategory, getCategoryItems }