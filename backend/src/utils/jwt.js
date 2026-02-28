import jwt from "jsonwebtoken";

export const jwtToken = (user) => {
    try {
        const accessToken = jwt.sign(
            { user },
            process.env.jwtKey,  
            { expiresIn: "1h" }
        );

        const refreshToken = jwt.sign(
            { user },
            process.env.jwtKey, 
            { expiresIn: "7d" } 
        );

        return { accessToken, refreshToken };

    } catch (err) {
        throw new Error(err.message);
    }
}