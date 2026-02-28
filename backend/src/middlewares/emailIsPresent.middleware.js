import customerAuth_Model from "../models/customer/auth.model.js";
import adminAuth_Model from "../models/admin/auth.model.js";
import { ApiError } from "../utils/api-error.js";

export const customerPresent = async (req, res, next) => {
    try{
        const {email} = req.body;

        const isEmail = await customerAuth_Model.findOne({email: email});

        if(!isEmail){
            return res.status(401).json(new ApiError(401, "Email is not Found"));
        }

        req.user = isEmail

        return next();
    }
    catch(err){
        return res.status(500).json(new ApiError(500, err.message, [{message: err.message, name: err.name}]));
    }
}

export const adminPresent = async (req, res, next) => {
    try {
        // console.log(req.body);
        const { email } = req.body;
    
        if (!email) {
            return res.status(400).json(new ApiError(400, "Email is required"));
        }

        const adminDetail = await adminAuth_Model.findOne({ email });

        if (!adminDetail) {
            return res.status(404).json(new ApiError(404, "Email not found"));
        }

        
        req.user = adminDetail;

        return next();
    } catch (err) {
        return res.status(500).json(new ApiError(500, err.message));
    }
}