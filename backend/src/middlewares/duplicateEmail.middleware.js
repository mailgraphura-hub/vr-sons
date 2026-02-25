import customerAuth_Model from "../models/customer/auth.model.js";
import adminAuth_Model from "../models/admin/auth.model.js";
import { ApiError } from "../utils/api-error.js";

export const duplicateEmail = async (req, res, next) => {
    try{

        const {email} = req.body;

        const customerIsEmail  = await customerAuth_Model.findOne({email: email});

        const adminIsEmail = await adminAuth_Model.findOne({email: email});

        if(customerIsEmail || adminIsEmail){
            return res.status(401).json(new ApiError(401, "Duplicate Email"));
        }

        return next();

    }
    catch(err){
        return res.status(500).json(new ApiError(500, err.message, [{message: err.message, name: err.name}]));
    }
}