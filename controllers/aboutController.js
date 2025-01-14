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

        if (!(intro && description && uploadedFile)){
            if(uploadedFile)
                await fs.unlink(uploadedFile.path);
            return res.status(400).json({ message: "All fields are required." });
        }

        if (process.env.NODE_ENV == 'production'){
            await fs.unlink(uploadedFile.path);
            return res.status(400).json({ message: "You are not allowed to create about." });
        }

        const existingAbout = await aboutModel.find();

        if (existingAbout.length > 0){
            await fs.unlink(uploadedFile.path);
            return res.status(400).json({ message: "About already exists" });
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
        res.status(201).send(newAbout);       

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
            message: "An error occurred while creating the about.",
            error: errorMessage 
        });
    }
}

export const updateAbout = async(req, res)=>{
    try{
        const {intro, description} = req.body;
        const uploadedFile = req.file;
        if(!(intro || description || uploadedFile))
            return res.status(500).json({message: "Nothing to update!"});
        
        const prevAbout = await aboutModel.findOne();
        if(!prevAbout){
            if(uploadedFile)
                await fs.unlink(uploadedFile.path);
            return res.status(500).json({ message: "About section is not created yet"})
        }

        if((intro == prevAbout.intro || !intro) && (description == prevAbout.description || !description) && (!uploadedFile))
            return res.json({message: "Nothing to update!"});

        if(intro != prevAbout.intro && intro) prevAbout.intro = intro;
        if(description != prevAbout.description && description) prevAbout.description = description;
        if( uploadedFile ){
            //delete previous image from cloudinary
            const avatar = await imageUpload(uploadedFile.path);
            await imageDelete(prevAbout.avatar_id);
            prevAbout.avatar = avatar.secure_url;
            prevAbout.avatar_id = avatar.public_id;
        }
        await prevAbout.save();
        await fs.unlink(uploadedFile.path);
        return res.status(200).send(prevAbout);
    }
    catch(err){
        if(req.file)
            await fs.unlink(req.file.path);
        res.status(500).json({ 
            message: "An error occurred while updating the about.",
            error: err.message 
        });
    }
}

export const getAbout = async(req, res)=>{
    try{
        const about = await aboutModel.findOne();
        if(!about)
            return res.status(500).json({ message: "About section is empty yet!"})
        return res.send(about)
    }
    catch(err){
        res.status(500).json({ 
            message: "An error occurred while getting the about.",
            error: err.message 
        });
    }
}