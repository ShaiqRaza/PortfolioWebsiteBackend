import cloudinary from "../config/cloudinaryConfig.js";
import fs from "fs";

export async function imageUpload(filePath) {
    try{
        if (!filePath) 
          throw new Error("No image provided to upload");

        const res = await cloudinary.uploader.upload(filePath, {
          resource_type: "image",
        });

        fs.unlinkSync(filePath);

        return res;
    }
    catch(err){
      fs.unlinkSync(filePath);
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

export async function videoUpload(filePath) {
  try {
    if (!filePath) 
      throw new Error("No image provided to upload");
    
    // Upload the video from the local file path
    const result = await cloudinary.uploader.upload(filePath, {
      resource_type: "video",
    });

    // Remove the file from the local storage after upload
    fs.unlinkSync(filePath);

    return result;
  } catch (err) {
    // Remove the file if there's an error
    fs.unlinkSync(filePath);
    throw new Error(`Video upload failed: ${JSON.stringify(err)}`);
  }
}

export async function videoDelete(public_id) {
  try{
    if(!public_id)
      throw new Error("no video id provided to delete");
    const res = await cloudinary.uploader.destroy(public_id);

    if (res.result === 'ok')
      return res.result;
    else
        throw new Error('Failed to delete video');
  }
  catch(err){
    throw new Error(`Video delete failed: ${err.message}`);
  }
}