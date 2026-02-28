import mongoose, { Schema } from "mongoose";

const { ObjectId } = mongoose.Schema.Types;

const inquiriesSchema = new Schema({
    productId: {
        type: ObjectId,
        ref: "product",
        required: true
    },
    productName: {
        type: String,
        required: true
    },
    customerId: {
        type: ObjectId,
        ref: "Customer",
        required: true
    },
    customerName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    alternativeEmail: {
        type: String
    },
    contact: {
        type: Number,
    },
    alternativeContact: {
        type: Number
    },
    company: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    quantity: {
        type: String,
        required: true
    },
    message: {
        type: String
    },
    inquiry_date: {
        type: Date
    },
    status: {
        type: String,
        enum: ["Open", "Processing", "Close"],
        default: "Open"
    }
}, { timestamps: true });

inquiriesSchema.index({ customerId: 1 });

const inquiriesModel = mongoose.model("inquiries", inquiriesSchema);

export default inquiriesModel;


