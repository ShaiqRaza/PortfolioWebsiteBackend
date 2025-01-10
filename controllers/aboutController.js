import dotenv from 'dotenv';
dotenv.config();
import aboutModel from "../models/aboutModel.js";
import { imageUpload, imageDelete } from '../utils/uploadHandlers.js';
import fs from "fs";

export const createAbout = async(req, res) => {
    try {
        if (process.env.NODE_ENV == 'production')
            return res.status(400).json({ message: "You are not allowed to create about." });

        const { intro, description } = req.body;
        const uploadedFile = req.file ? req.file : null;

        if (!(intro && description && uploadedFile))
            return res.status(400).json({ message: "All fields are required." });

        const existingAbout = await aboutModel.find();

        if (existingAbout.length > 0)
            return res.status(400).json({ message: "About already exists" });

        //image upload to cloudinary
        const avatar = await imageUpload(req.file);

        const newAbout = await aboutModel.create({
            intro,
            description,
            avatar: avatar.secure_url,
            avatar_id: avatar.public_id
        });

        res.status(201).json(newAbout);       

    } catch (err) {
        res.status(500).json({ 
            message: "An error occurred while creating the about.",
            error: err.message 
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
        if(!prevAbout)
            return res.status(500).json({ message: "About section is not created yet"})

        if((intro == prevAbout.intro || !intro) && (description == prevAbout.description || !description) && (!uploadedFile))
            return res.json({message: "Nothing to update!"});

        if(intro != prevAbout.intro && intro) prevAbout.intro = intro;
        if(description != prevAbout.description && description) prevAbout.description = description;
        if( uploadedFile ){
            //delete previous image from cloudinary
            await imageDelete(prevAbout.avatar_id);
            const avatar = await imageUpload(uploadedFile);
            prevAbout.avatar = avatar.secure_url;
            prevAbout.avatar_id = avatar.public_id;
            fs.unlinkSync(uploadedFile.path);
        }
        await prevAbout.save();
        return res.status(200).send("About updated successfully")
    }
    catch(err){
        if(uploadedFile)
            fs.unlinkSync(uploadedFile.path);
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