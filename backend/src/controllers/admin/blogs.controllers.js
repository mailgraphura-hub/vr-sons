import { cloudinary, deleteFromCloudinary } from "../../config/cloudinary.config.js";
import blogModel from "../../models/common/blogs.models.js";
import { ApiError } from "../../utils/api-error.js";
import { ApiResponse } from "../../utils/api-response.js";

const addBlog = async (req, res) => {
    try {
        const { title, description, status, author } = req.body;

        if (!req.files || !title || !description) {
            return res.status(400).json(new ApiError(400, "Title, Description and Image is required for post blog."));
        }

        const blogImage = await Promise.all(
            req.files.map(file => {
                return new Promise((resolve, reject) => {
                    const stream = cloudinary.uploader.upload_stream(
                        { folder: "blogs" },
                        (err, result) => {
                            if (err) reject(err);
                            else resolve(result.secure_url);
                        }
                    );
                    stream.end(file.buffer);
                })
            })
        );

        const blogDetail = await blogModel.create({
            title,
            description,
            blogMedia: blogImage,
            status,
            author
        });

        if (!blogDetail) {
            return res.status(400).json(new ApiError(400, "Failed to add blogs."));
        }

        return res.status(200).json(new ApiResponse(200, "Blogs Add Successfully."))
    }
    catch (err) {
        return res.status(500).json(new ApiError(500, err.message, [{ message: err.message, name: err.name }]));
    }
}

const updateBlogs = async (req, res) => {
    try {
        const { title, description, status, blogId } = req.body;

        const blogDetail = await blogModel.findById(blogId);

        if (!blogDetail) {
            return res.status(404).json(new ApiError(404, "Blog is not found."));
        }

        const query = {};

        if (title) query.title = title;
        if (description) query.description = description;

        if (typeof status !== "undefined") {
            query.status = status;
        }

        if (req.files && req.files.length > 0) {
            await Promise.all(
                blogDetail.blogMedia.map(image => deleteFromCloudinary(image))
            );

            const blogImage = await Promise.all(
                req.files.map(file => {
                    return new Promise((resolve, reject) => {
                        const stream = cloudinary.uploader.upload_stream(
                            { folder: "blogs" },
                            (err, result) => {
                                if (err) reject(err);
                                else resolve(result.secure_url);
                            }
                        );
                        stream.end(file.buffer);
                    });
                })
            );

            query.blogMedia = blogImage;
        }

        const updatedBlogDetail = await blogModel.findByIdAndUpdate(
            blogId,
            query,
            {
                returnDocument: "after",
            }
        );

        if (!updatedBlogDetail) {
            return res.status(400).json(new ApiError(400, "Blog update failed"));
        }

        return res.status(200).json(
            new ApiResponse(200, updatedBlogDetail, "Update Successfully.")
        );
    } catch (err) {
        return res.status(500).json(
            new ApiError(500, err.message, [
                { message: err.message, name: err.name }
            ])
        );
    }
};

const deleteBlogs = async (req, res) => {
    try {
        const { blogId } = req.query;

        const blogDetail = await blogModel.findByIdAndDelete(blogId);

        if (!blogDetail) {
            return res.status(400).json(400, "Failed to Delete Blog.")
        }

        await Promise.all(
            blogDetail.blogMedia.map(image => deleteFromCloudinary(image))
        );

        return res.status(200).json(new ApiResponse(200, null, "Delete Blog Successfully."))
    }
    catch (err) {
        return res.status(500).json(new ApiError(500, err.message, [{ message: err.message, name: err.name }]));
    }
}

const getBlogs = async (req, res) => {
    try {
        const page = (req.query.page) || 1;
        const limit = (req.query.limit) || 10;

        const skip = (page - 1) * limit;

        const blogList = await blogModel
            .find({})
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 });

        if (blogList.length === 0) {
            return res.status(404).json(new ApiError(404, "No Blog Found."));
        }

        const totalCount = await blogModel.countDocuments();

        return res.status(200).json(new ApiResponse(
            200, {
            currentPage: page,
            totalCount,
            totalPage: Math.ceil(totalCount / limit),
            blogList
        }, "Successfull"))
    }
    catch (err) {
        return res.status(500).json(new ApiError(500, err.message, [{ message: err.message, name: err, name }]));
    }
}

const getBlogById = async (req, res) => {
    try {
        const { blogId } = req.query;

        const blogDetail = await blogModel.findById(blogId);

        if (!blogDetail) {
            return res.status(404).json(new ApiError(404, "Blog is not found."))
        }

        return res.status(200).json(new ApiResponse(200, blogDetail, "Successfull."));
    }
    catch (err) {
        return res.status(500).json(new ApiError(500, err.message, [{ message: err.message, name: err.name }]));
    }
}

export { addBlog, updateBlogs, deleteBlogs, getBlogs, getBlogById };