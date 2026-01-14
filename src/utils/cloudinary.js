import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';

// Configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadOnCloudinary = async (localfilePath, folder) => {
    try {
        if(!localfilePath) return null

        // Uploads file to cloudinary
        // method .uploder.upload()
       const response = await cloudinary.uploader.upload(localfilePath, {
            resource_type: 'auto',
        });
        //file is uploaded
        console.log("File is uploaded",response.url);
        return response;
        
    } catch (error) {

        fs.unlinkSync(localfilePath); // remove the locally saved temprorary file
        console.log("Error while uploading on cloudinary", error);
        return null;
        
    }
}

export { uploadOnCloudinary };