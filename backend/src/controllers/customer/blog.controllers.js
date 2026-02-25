import blogModel from "../../models/common/blogs.models.js";
import { ApiError } from "../../utils/api-error.js";
import { ApiResponse } from "../../utils/api-response.js";

const getBlogs = async (req, res) => {
    try{
        const page = (req.query.page) || 1;
        const limit = (req.query.limit) || 10;

        const skip = (page-1)*limit;

        const blogList = await blogModel
        .find({status: true})
        .skip(skip)
        .limit(limit)
        .sort({createdAt: -1});

        if(blogList.length === 0){
            return res.status(404).json(new ApiError(404, "No Blog Found."));
        }

        const totalCount = await blogModel.countDocuments();

        return res.status(200).json(new ApiResponse(
            200, {
                currentPage: page,
                totalCount,
                totalPage: Math.ceil(totalCount/limit),
                blogList
        }, "Successfull"))
    }
    catch(err){
        return res.status(500).json(new ApiError(500, err.message, [{message: err.message, name: err,name}]));
    }
}

const getBlogById = async (req, res) => {
    try{
        const {blogId} = req.query;

        const blogDetail = await blogModel.findById(blogId);

        if(!blogDetail){
            return res.status(404).json(new ApiError(404, "Blog is not found."))
        }

        return res.status(200).json(new ApiResponse(200, blogDetail, "Successfull."));
    }
    catch(err){
        return res.status(500).json(new ApiError(500, err.message, [{message: err.message, name: err.name}]));
    }
}

export {getBlogs, getBlogById};