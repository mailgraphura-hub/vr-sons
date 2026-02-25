import mongoose, {Schema} from "mongoose";

const categorySchema = new Schema({
    name:{
        type:String,
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
    categoryImage:{
        type: String,
        required: true
    }
}, {timestamps: true});

const categoryModel = mongoose.model("category", categorySchema);

export default categoryModel