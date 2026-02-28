import { jwtToken } from "./jwt.js";

export const cookiesForUser = async (res, user) => {
    try {
        const { accessToken, refreshToken } = jwtToken(user); 

        res.cookie("AccessToken", accessToken, {
            httpOnly: true,
            secure: false,       
            sameSite: "Lax",
            maxAge: 60 * 60 * 1000           
        });

        res.cookie("RefreshToken", refreshToken, {
            httpOnly: true,
            secure: false,       
            sameSite: "Lax",
            maxAge: 7 * 24 * 60 * 60 * 1000 
        });

    } catch (err) {
        throw new Error(err.message);
    }
}