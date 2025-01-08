import cloudinary from "../config/cloudinaryConfig.js";

export async function imageUpload(file) {
    const res = await cloudinary.uploader.upload(file, {
      resource_type: "image",
    });
    return res;
}