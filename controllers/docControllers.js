import docModel from "../models/docModel.js";
import { imageDelete, imageUpload } from "../utils/uploadHandlers.js";
import fs from 'fs/promises'

export const createDoc = async(req, res)=>{
    let uploadedImage = null;
    try{
        const image = req.file;
        if(!image)
            return res.status(500).json({message: "All fields are required."});

        const {title, description=null} = req.body || {};
        if(!title)
            return res.status(500).json({message: "All fields are required."});

        uploadedImage = await imageUpload(image.path);

        const createdDoc = await docModel.create({
            title,
            description,
            image: uploadedImage.secure_url,
            image_id: uploadedImage.public_id
        });

        await fs.unlink(image.path);
        res.status(200).json({
            data: createdDoc,
            message: "Document created successfully"
        })
    }
    catch(err){
        let errorMessage = err.message;
        try{
            if(uploadedImage)
                await imageDelete(uploadedImage.public_id);
            await fs.unlink(req.file.path);
        }
        catch(err){
            errorMessage = `${errorMessage} - CleanUpError: ${err.message}`
        }
        res.status(500).json({
            message: "Something error occured at document creation",
            error: errorMessage
        })
    }
}