// import mongoose, { Schema } from "mongoose";

// const adminAuth_Schema = new Schema({
//     name:{
//         type: String,
//         required:true
//     },
//     email:{
//         type: String,
//         required: true,
//         unique: true
//     },
//     password:{
//         type: String,
//         required: true
//     },
//     contact: {
//         type: Number,
//         unique: true,
//         sparse: true
//     },
//     profileImage:{
//         type: String
//     },
//     gender:{
//         type: String,
//         enum:["Male", "Female", "Other"]
//     },
//     dob:{
//         type: String,
//     },
//     country:{
//         type: String,
//     },
//     state:{
//         type: String,
//     }
// }, {timestamps: true});

// const adminAuth_Model = mongoose.model("admin", adminAuth_Schema);

// export default adminAuth_Model;








import mongoose, { Schema } from "mongoose";

const adminAuth_Schema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    contact: { type: Number, unique: true, sparse: true },
    profileImage: { type: String },
    gender: { type: String, enum: ["Male", "Female", "Other"] },
    dob: { type: String },
    country: { type: String },
    state: { type: String },

    
    otp: { type: String, default: null },
    otpExpiry: { type: Date, default: null },
    isOtpVerified: { type: Boolean, default: false }

}, { timestamps: true });

const adminAuth_Model = mongoose.model("admin", adminAuth_Schema);
export default adminAuth_Model;