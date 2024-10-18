import dotenv from 'dotenv';
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import path from 'path';

dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null; // Check if the file path is provided

        // Upload the file to Cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, { resource_type: "auto" });

        // Check if the upload was successful and the URL is available
        if (response.secure_url) {
            console.log("File has been uploaded:", response.secure_url);
        } else {
            console.log("URL not found in response.");
        }

        // Delete the local file after successful upload
        fs.unlinkSync(localFilePath); 
        return response; // Return the Cloudinary response
    } catch (error) {
        console.error("Error uploading file:", error);  
        
        // Ensure the file is deleted even if the upload fails
        if (fs.existsSync(localFilePath)) {
            fs.unlinkSync(localFilePath);
        }

        return null; // Return null in case of error
    }
};

export { uploadOnCloudinary };
