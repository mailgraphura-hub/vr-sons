import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config({
    path: "./.env"
});

cloudinary.config({
    cloud_name: process.env.cloudinary_name,
    api_key: process.env.cloudinary_api,
    api_secret: process.env.cloudinary_secret,
})

function extractPublicId(url) {
    const parts = url.split("/");
    const file = parts.pop();
    const folder = parts.pop();
    return `${folder}/${file.split(".")[0]}`
}

const deleteFromCloudinary = async (imageUrl) => {
    const publicId = extractPublicId(imageUrl);
    return cloudinary.uploader.destroy(publicId);
}

export {cloudinary, deleteFromCloudinary};

