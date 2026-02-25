import mongoose, {Schema} from "mongoose";

const {ObjectId} = mongoose.Schema.Types;

const productSchema = new Schema({
    categoryId:{
        type: ObjectId,
        ref:"category",
        required: true
    },
    subCategoryId:{
        type: ObjectId,
        ref:"subCategory",
        required: true,
    },
    name:{
        type: String,
        required: true,
    },
    skuId:{
        type: String,
        required: true,
        unique: true
    },
    description:{
        type:String,
        required: true
    },
    specifications:{
        type: String,
        required: true
    },
     status:{
        type: String,
        enum:["Available", "Un-Available"],
        default:"Available"
     },
     productImage:[String]
}, {timestamps: true});

productSchema.index({categoryId:1});
productSchema.index({subCategoryId:1})
productSchema.index({categoryId:1, subCategoryId:1})

const productModel = mongoose.model("product", productSchema);

export default productModel
