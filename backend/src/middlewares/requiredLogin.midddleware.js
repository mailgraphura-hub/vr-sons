import jwt from "jsonwebtoken";
import { cookiesForUser } from "../utils/cookiesForUser.js";
import { ApiError } from "../utils/api-error.js";

export const requiredLogin = async (req, res, next) => {
    // console.log("I was in reqired login there.");
    try {
        const accessToken = req.cookies?.AccessToken;
        const refreshToken = req.cookies?.RefreshToken;

        if (accessToken) {
            const jwtVerification = jwt.verify(accessToken, process.env.jwtKey); // ✅
            req.user = jwtVerification.user;
            return next();
        }
        else if (refreshToken) {
            const jwtVerification = jwt.verify(refreshToken, process.env.jwtKey); // ✅
            req.user = jwtVerification.user;
            await cookiesForUser(res, req.user);
            return next();
        }
        else {
            return res.status(401).json(new ApiError(401, "Please Login"));
        }
       
    }
    catch (err) {
        
        if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError") {
            return res.status(401).json(new ApiError(401, "Session expired, please login again"));
        }
        return res.status(500).json(new ApiError(500, err.message));
    }
}