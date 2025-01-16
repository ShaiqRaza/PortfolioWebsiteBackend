import docModel from "../models/docModel.js";
import mongoose from "mongoose";
import { imageDelete, imageUpload } from "../utils/uploadHandlers.js";
import fs from 'fs/promises'

export const getAllDocs = async(req, res)=>{
    try{
        const docs = await docModel.find();
        return res.status(200).json({
            success: true,
            data: docs,
            message: "Documents sent successfully."
        })
    }
    catch(err){
        res.status(500).json({
            success: false,
            error: err.message,
            message: "Something error occured! Can't get all documents."
        })
    }
}

export const removeDescription = async()=>{
    try{
        const id = req.params.id;
        if(!id || !mongoose.Types.ObjectId.isValid(id))
            return res.status(400).json({success: false, message: "Document ID is not correct." });

        const existingDoc = await docModel.findById(id);
        if(!existingDoc)
            return res.status(400).json({success: false, message: "Document not found."})

        existingDoc.description = null;
        await existingDoc.save();

        return res.status(200).json({
            success: true,
            data: existingDoc,
            message: "Description removed successfully."
        });
    }
    catch(err){
        res.status(500).json({   
            success: false,         
            message:"Something error happened! Can't remove description.",
            error: err.message
        });
    }
}

export const createDoc = async(req, res)=>{
    let uploadedImage = null;
    try{
        const image = req.file;
        if(!image)
            return res.status(400).json({success: false, message: "All fields are required."});

        const {title, description=null} = req.body || {};
        if(!title)
            return res.status(400).json({success: false, message: "All fields are required."});

        uploadedImage = await imageUpload(image.path);

        const createdDoc = await docModel.create({
            title,
            description,
            image: uploadedImage.secure_url,
            image_id: uploadedImage.public_id
        });

        await fs.unlink(image.path);
        res.status(200).json({
            success: true,
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
            success: false,
            message: "Something error occured at document creation",
            error: errorMessage
        })
    }
}

export const updateTitle = async(req, res)=>{
    try{
        const {title} = req.body;
        if(!title)
            return res.status(400).json({success: false, message: "Nothing to update!"});

        const id = req.params.id;
        if(!id || !mongoose.Types.ObjectId.isValid(id))
            return res.status(400).json({success: false, message: "Document ID is not correct." });

        const existingDoc = await docModel.findById(id);
        if(!existingDoc)
            return res.status(400).json({success: false, message: "Document not found."})

        if(title == existingDoc.title)
            return res.status(400).json({success: false, message: "Nothing to update!"});

        existingDoc.title = title;
        await existingDoc.save();

        return res.status(200).json({
            success: true,
            data: existingDoc,
            message: "Title updated successfully."
        });
    }
    catch(err){
        res.status(500).json({     
            success: false,       
            message:"Something error happened! Can't update title.",
            error: err.message
        });
    }
}

export const updateDescription = async(req, res)=>{
    try{
        const {description} = req.body;
        if(!description)
            return res.status(400).json({success: false, message: "Nothing to update!"});

        const id = req.params.id;
        if(!id || !mongoose.Types.ObjectId.isValid(id))
            return res.status(400).json({success: false, message: "Document ID is not correct." });

        const existingDoc = await docModel.findById(id);
        if(!existingDoc)
            return res.status(400).json({success: false, message: "Document not found."})

        if(description == existingDoc.description)
            return res.status(400).json({success: false, message: "Nothing to update!"});

        existingDoc.description = description;
        await existingDoc.save();
        
        return res.status(200).json({
            success: true,
            data: existingDoc,
            message: "Description updated successfully."
        });
    }
    catch(err){
        res.status(500).json({   
            success: false,         
            message:"Something error happened! Can't update description.",
            error: err.message
        });
    }
}

export const updateImage = async(req, res)=>{
    let uploadedImage = null;
    try{
        const image = req.file;
        if(!image)
            return res.status(400).json({success: false, message: "All fields are required."});

        const id = req.params.id;
        if(!id || !mongoose.Types.ObjectId.isValid(id))
            return res.status(400).json({success: false, message: "Document ID is not correct." });

        const existingDoc = await docModel.findById(id);
        if(!existingDoc)
            return res.status(400).json({success: false, message: "Document not found."});

        const prevImageId = existingDoc.image_id;

        uploadedImage = await imageUpload(image.path);
        
        existingDoc.image = uploadedImage.secure_url;
        existingDoc.image_id = uploadedImage.public_id;
        
        await existingDoc.save();
        
        await fs.unlink(image.path);
        
        try{
            await imageDelete(prevImageId);
        }
        catch(err){
            return res.status(200).json({
                success: true,
                data: existingDoc,
                message: "Document created but image couldn't delete from server.",
            });
        }

        return res.status(200).json({
            success: true,
            data: existingDoc,
            message: "Image updated successfully."
        });
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
            success: false,
            message: "Some error occured at image updation.",
            message: errorMessage
        })
    }
}