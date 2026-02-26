import mongoose, { isObjectIdOrHexString } from "mongoose";
import inquiriesModel from "../../models/common/inequiries.model.js";
import { getIO } from "../../config/socketIo.config.js";
import { ApiError } from "../../utils/api-error.js";
import { ApiResponse } from "../../utils/api-response.js";

const updateInquiryStatus = async (req, res) => {
    try {
        const { inquiryId, status } = req.body;

        if (!mongoose.Types.ObjectId.isValid(inquiryId)) {
            return res.status(400).json(new ApiError(400, "Invalid Inquiry ID"))
        }


        const allowedStatus = ["Open", "Processing", "Close"];
        if (!allowedStatus.includes(status)) {
            return res.status(400).json(new ApiError(400, "Invalid Inquiry Status"))
        }

        const inquiryDetail = await inquiriesModel.findByIdAndUpdate(
            inquiryId,
            { status }, {
            returnDocument: "after"
        }
        )

        if (!inquiryDetail) {
            return res.status(404).json(new ApiError(404, "Inquiry Not Found"))
        }

        const io = getIO();

        io.to(`customer_${inquiryDetail.customerId}`).emit(
            "inquiryStatusUpdated", {
            inquiryId: inquiryDetail._id,
            status: inquiryDetail.status
        }
        );

        io.to(`admin_room`).emit(
            "adminInquiryUpdated",
            inquiryDetail
        );

        return res.status(200).json(new ApiResponse(200, inquiryDetail, "Successfully"));
    }
    catch (err) {
        return res.status(500).json(new ApiError(500, err.message, [{ message: err.message, name: err.name }]));
    }
}

const getInquiries = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        yesterday.setHours(0, 0, 0, 0);

        const today = new Date();
        today.setHours(23, 59, 59, 999);

        const query = {
            createdAt: {
                $gte: yesterday,
                $lte: today
            },
            status: { $in: ["Open", "Processing", "Close"] }
        };

        const [inquiryList, totalInquiry] = await Promise.all([
            inquiriesModel
                .find(query)
                .skip(skip)
                .limit(limit)
                .sort({ createdAt: -1 }),

            inquiriesModel.countDocuments(query)
        ]);

        if (inquiryList.length === 0) {
            return res.status(404).json(
                new ApiError(404, "No Inquiry Found")
            );
        }

        const close = await inquiriesModel.find({ status: "Close" });
        const open = await inquiriesModel.find({ status: "Open" });
        const processing = await inquiriesModel.find({status: "Processing"});

        return res.status(200).json(
            new ApiResponse(
                200,
                {
                    currentPage: page,
                    totalInquiry,
                    totalPage: Math.ceil(totalInquiry / limit),
                    inquiryList,
                    close: close.length,
                    open: open.length,
                    processing: processing.length
                },
                "Successful"
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

const getInquiriesByDate = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const start = new Date(startDate);
        start.setHours(0, 0, 0, 0);

        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);

        const query = {
            status: { $in: ["Open", "Processing", "Close"] }
        };

        if (startDate && endDate) {
            query.createdAt = {
                $gte: start,
                $lte: end
            };
        }

        const [inquiryList, totalInquiry] = await Promise.all([
            inquiriesModel
                .find(query)
                .skip(skip)
                .limit(limit)
                .sort({ createdAt: -1 }),

            inquiriesModel.countDocuments(query)
        ]);

        if (inquiryList.length === 0) {
            return res.status(404).json({
                message: "No Inquiries Found"
            });
        }

        const close = await inquiriesModel.find({
            createdAt: {
                $gte: start,
                $lte: end
            },
            status: "Close"
        });

        const open = await inquiriesModel.find({
            createdAt: {
                $gte: start,
                $lte: end
            },
            status: "Open"
        })

        const processing = await inquiriesModel.find({
            createdAt: {
                $gte: start,
                $lte: end
            },
            status: "Processing"
        })

        return res.status(200).json({
            currentPage: page,
            totalInquiry,
            totalPage: Math.ceil(totalInquiry / limit),
            inquiryList,
            open: open.length,
            close: close.length,
            processing: processing.length
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
};

export { updateInquiryStatus, getInquiries, getInquiriesByDate };