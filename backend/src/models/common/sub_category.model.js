import mongoose, {Schema} from "mongoose";

const {ObjectId} = mongoose.Schema.Types;

const subCategory_Schema = new Schema({
    categoryId:{
        type: ObjectId,
        ref:"category"
    },
    name:{
        type: String,
        required: true
    },
    skuId:{
        type: String,
        required: true,
        unique: true
    },
    decription:{
       type: String,
        required: true, 
    },
    status:{
        type: String,
        enum:["Available", "Un-Available"],
        default: "Available"
    },
    subcategoryImage:{
        type: String,
        required: true
    }
}, {timestamps: true});

subCategory_Schema.index({categoryId: 1});

const subCategory_Model = mongoose.model("subCategory", subCategory_Schema)

export default subCategory_Model;