import dotenv from 'dotenv';
dotenv.config();
import aboutModel from "../models/aboutModel.js";
import { imageUpload, imageDelete } from '../utils/uploadHandlers.js';
import fs from "fs/promises";

export const createAbout = async(req, res) => {
    let avatar = null;
    try {       
        const uploadedFile = req.file ? req.file : null;
        const { intro, description } = req.body;

        if (process.env.NODE_ENV == 'production'){
            if(uploadedFile)
                await fs.unlink(uploadedFile.path);
            return res.status(400).json({success: false, message: "You are not allowed to create about." });
        }

        if (!(intro && description && uploadedFile)){
            if(uploadedFile)
                await fs.unlink(uploadedFile.path);
            return res.status(400).json({success: false, message: "All fields are required." });
        }


        const existingAbout = await aboutModel.find();

        if (existingAbout.length > 0){
            await fs.unlink(uploadedFile.path);
            return res.status(400).json({success: false, message: "About already exists" });
        }

        //image upload to cloudinary
        avatar = await imageUpload(uploadedFile.path);

        const newAbout = await aboutModel.create({
            intro,
            description,
            avatar: avatar.secure_url,
            avatar_id: avatar.public_id
        });

        await fs.unlink(uploadedFile.path);
        res.status(200).json({
            success: true,
            data: newAbout,
            message: "About created successfully."
        });       

    } catch (err) {
        let errorMessage = err.message;
        try{
            if(req.file)
                await fs.unlink(req.file.path);
            if(avatar)
                await imageDelete(avatar.public_id);
        }
        catch(err){
            errorMessage = `${errorMessage} -  CleanUpError: ${err.message}`
        }
        res.status(500).json({ 
            success: false,
            message: "An error occurred while creating the about.",
            error: errorMessage 
        });
    }
}

export const updateAvatar = async(req, res)=>{
    let avatar = null;
    try{
        const uploadedFile = req.file;
        if(!uploadedFile)
            return res.status(400).json({success: false, message: "Nothing to update!"});
        
        const prevAbout = await aboutModel.findOne();
        if(!prevAbout){
            await fs.unlink(uploadedFile.path);
            return res.status(400).json({success: false, message: "About section is not created yet."})
        }
        
        const prevAvatarId = prevAbout.avatar_id;

        avatar = await imageUpload(uploadedFile.path);        
               
        prevAbout.avatar = avatar.secure_url;
        prevAbout.avatar_id = avatar.public_id;        
        await prevAbout.save();
        
        await fs.unlink(uploadedFile.path);

        try{
            await imageDelete(prevAvatarId);
        }
        catch(err){
            return res.status(500).json({
                success: false,  
                data: prevAbout,
                message: "Avatar updated but previous avatar can't delete from server."
            });
        }

        return res.status(200).json({
            success: true, 
            data: prevAbout,
            message: "Avatar updated successfully."
        });
    }
    catch(err){
        let errorMessage = err.message;
        try{
            if(avatar)
                //delete uploaded image
                await imageDelete(avatar.public_id);
            await fs.unlink(req.file.path);
        }
        catch(err){
            errorMessage = `${errorMessage} -  CleanUpError: ${err.message}`
        }
        res.status(500).json({ 
            success: false, 
            message: "An error occurred while updating the avatar.",
            error: errorMessage
        });
    }
}

export const updateIntro = async(req, res)=>{
    try{
        const {intro} = req.body;
        if(!intro)
            return res.status(400).json({success: false, message: "Nothing to update!"});
        
        const about = await aboutModel.findOne();
        if(!about)
            return res.status(400).json({success: false, message: "About section is not created yet."});

        if(intro == about.intro)
            return res.status(400).json({success: false, message: "Nothing to update!"});

        about.intro = intro;
        await about.save();
        return res.json({
            success: true,
            data: about,
            message: "Intro updated successfully."
        });
    }
    catch(err){
        res.status(500).json({
            success: false,            
            message:"Something error happened! Can't update intro.",
            error: err.message
        });
    }
}

export const updateDescription = async(req, res)=>{
    try{
        const {description} = req.body;
        if(!description)
            return res.status(400).json({success: false, message: "Nothing to update!"});
        
        const about = await aboutModel.findOne();
        if(!about)
            return res.status(400).json({success: false, message: "About section is not created yet."});

        if(description == about.description)
            return res.status(400).json({success: false, message: "Nothing to update!"});

        about.description = description;
        await about.save();
        return res.json({
            success: true,
            data: about,
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

export const getAbout = async(req, res)=>{
    try{
        const about = await aboutModel.findOne();
        if(!about)
            return res.status(400).json({success: false, message: "About section is empty yet!"})
        return res.status(200).json({
            success: true,
            data: about,
            message: "About data sent successfuly."
        })
    }
    catch(err){
        res.status(500).json({ 
            success: false,
            message: "An error occurred while getting the about.",
            error: err.message 
        });
    }
}