import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config({
    path:"./.env"
})

const databaseConfig = async () => {
    try{
        const db = await mongoose.connect(process.env.mongodbURL);
        console.log("Database Connect Successful");
        return db
    }
    catch(err){
        console.error(err.message)
    }
}

export default databaseConfig;