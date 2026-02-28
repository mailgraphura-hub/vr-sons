import mongoose, {Schema} from "mongoose";


const customerAuth_Schema = new Schema({
    name:{
        type: String,
        required:true
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,   
    },
    contact: {
        type: Number,
        unique: true,
        sparse: true
    },
    profileImage:{
        type: String
    },
    gender:{
        type: String,
        enum:["Male", "Female", "Other"]
    },
    dob:{
        type: String,
    },
    country:{
        type: String,
    },
    state:{
        type: String,
    }
}, {timestamps: true});


const customerAuth_Model = mongoose.model("Customer", customerAuth_Schema);

export default customerAuth_Model;