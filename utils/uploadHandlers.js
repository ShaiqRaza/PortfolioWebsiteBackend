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

export async function imageDelete(public_id) {
    try{
      if(!public_id)
        throw new Error("no image id provided to delete");
      const res = await cloudinary.uploader.destroy(public_id);

      if (res.result === 'ok')
        return res.result;
      else
          throw new Error('Failed to delete image');
    }
    catch(err){
      throw new Error(`Image delete failed: ${err.message}`);
    }
}