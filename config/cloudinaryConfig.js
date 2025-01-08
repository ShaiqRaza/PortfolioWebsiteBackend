// cloudinaryConfig.js
import dotenv from 'dotenv';
dotenv.config();
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process,
    api_secret: process.env.API_SECRET
});

export default cloudinary;