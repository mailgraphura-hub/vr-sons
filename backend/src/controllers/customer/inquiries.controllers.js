import inquiriesModel from "../../models/common/inequiries.model.js";
import { ApiError } from "../../utils/api-error.js";
import { ApiResponse } from "../../utils/api-response.js";

const generateInquiries = async (req, res) => {
    try {
        const { _id } = req.user;

        const { productId,productName, customerName, email, alternativeEmail, contact, alternativeContact, company, country, state, quantity, message } = req.body;

        const inquiryDetails = await inquiriesModel.create({
            productId,
            productName,
            customerId: _id,
            customerName,
            email,
            alternativeEmail,
            contact,
            alternativeContact,
            company,
            country,
            state,
            quantity,
            message,
            inquiry_date: new Date()
        })

        if (!inquiryDetails) {
            return res.status(400).json(new ApiError(400, "Inquiry is not generate."));
        }

        return res.status(200).json(new ApiResponse(200, inquiryDetails, "Successful"));
    }
    catch (err) {
        return res.status(500).json(new ApiError(500, err.message, [{ message: err.message, name: err.name }]));
    }
}

const getMyInquiries = async (req, res) => {
  try {
    const { _id } = req.user;
    const { status } = req.query;

    const query = { customerId: _id };

    if (status) {
      query.status = status;
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const skip = (page - 1) * limit;

    const inquiryList = await inquiriesModel
      .find(query)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });


    const totalItems = await inquiriesModel.countDocuments({
      customerId: _id,
    });

    const open = await inquiriesModel.find({
      customerId: _id,
      status: "Open",
    });

    const processing = await inquiriesModel.find({
      customerId: _id,
      status: "Processing",
    });

    const close = await inquiriesModel.find({
      customerId: _id,
      status: "Close",
    });

    return res.status(200).json(
      new ApiResponse(
        200,
        {
          currentPage: page,
          totalItems,
          totalPage: Math.ceil(totalItems / limit),
          inquiryList,
          stats: {
            open,
            processing,
            close,
          },
        },
        "Successful"
      )
    );
  } catch (err) {
    return res.status(500).json(
      new ApiError(500, err.message, [
        { message: err.message, name: err.name },
      ])
    );
  }
};

export { generateInquiries, getMyInquiries };