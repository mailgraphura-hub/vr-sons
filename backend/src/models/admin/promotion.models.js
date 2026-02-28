import mongoose, {Schema} from "mongoose";

const promotionSchema = new Schema({
    email:{
        type: String,
        required: true,
        unique: true
    }
});

const promotionModel = mongoose.model("subscriber", promotionSchema);

export default promotionModel;
