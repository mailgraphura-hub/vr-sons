import mongoose, {Schema} from "mongoose";

const blogSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description:{
        type: String,
        required: true
    },
    blogMedia:{
        type:[String],
        required: true
    },
    status:{
        type: Boolean,
        default: true
    },
    author:{
        type: String,
        required: true
    }
}, {timestamps: true});

const blogModel = mongoose.model("blog", blogSchema);

export default blogModel;