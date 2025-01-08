import cloudinary from "../config/cloudinaryConfig.js";

export async function imageUpload(file) {
    try{
        if (!file) 
          throw new Error("No image provided to upload");

        const b64 = Buffer.from(file.buffer).toString("base64");
        let dataURI = "data:" + file.mimetype + ";base64," + b64;

        const res = await cloudinary.uploader.upload(dataURI, {
          resource_type: "image",
        });
        return res;
    }
    catch(err){
      throw new Error(`Image upload failed: ${err.message}`);
    }
}