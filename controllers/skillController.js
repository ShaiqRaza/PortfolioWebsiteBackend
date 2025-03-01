import mongoose from 'mongoose';
import skillModel from '../models/skillModel.js'
import { imageUpload, imageDelete } from '../utils/uploadHandlers.js';
import fs from "fs/promises";

export const getAllSkills = async(req, res) =>{
    await skillModel.find()
    .then((response)=>{
        res.status(200).json({
            success: true,
            data: response,
            message: "All skills loaded successfully"
        });
    })
    .catch((err)=>{
        res.status(500).json({   
            success: false,         
            message:"Something error happened! Can't load All skills",
            error: err.message
        });
    })
}

export const createSkill = async(req, res) =>{
    let uploadedLogo = null;
    const {title, description} = req.body;
    const logo = req.file;
    try{
        const existingSkill = await skillModel.findOne({title});

        if(!(title || logo))
            return res.status(400).json({ success: false, message: "Must add title or logo." });

        if(existingSkill){
            return res.status(400).json({ success: false, message: `${title} skill already exists`});
        }

        if(logo){          
            uploadedLogo = await imageUpload(logo.path);
            await fs.unlink(logo.path);
        }

        const newSkill = await skillModel.create({
            title,
            description,
            logo: uploadedLogo?.secure_url,
            logo_url: uploadedLogo?.public
        });

        return res.status(200).json({
            success: true,
            data:newSkill,
            message: "Skill created successfully"
        });
    }
    catch(err){
        try{
            if(logo)
                await fs.unlink(logo.path);
            if(uploadedLogo)
                await imageDelete(uploadedLogo.public_id);
        }
        catch(err){
            return res.status(500).json({ 
                success: false,
                message: "An error occurred while deleting the uploaded image.",
                error: err.message
            });
        }
        res.status(500).json({ 
            success: false,
            message: "An error occurred while creating the skill.",
            error: err.message 
        });
    }
}

export const updateSkill = async(req, res) =>{ 
    try{
        const {title, description} = req.body;
        const id = req.params.id;

        if(!id){
            return res.status(400).json({ success: false, message: "Skill ID is required for updating." });
        }
        
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ success: false, message: "Invalid Skill ID format." });
        }
        
        const existingSkill = await skillModel.findById(id);
        
        if(!existingSkill){
            return res.status(400).json({ success: false, message: "Skill not found!" });
        }
        
        if((!title || title == existingSkill.title) && (!description || description == existingSkill.description))
            return res.status(400).json({ success: false, message: "Nothing to update." });

        if (title) existingSkill.title = title;
        if (description) existingSkill.description = description;

        await existingSkill.save();
        return res.status(200).json({
            success: true,
            data: existingSkill,
            message: "Skill updated successfully"
        });
    }
    catch(err){
        return res.status(500).json({
            success: false, 
            message: "An error occurred while updating the skill.",
            error: err.message 
        });
    }
}

export const deleteSkill = async (req, res)=>{
    try{
        const id = req.params.id;

        if (!id) {
            return res.status(400).json({ success: false, message: "Skill ID is required for deletion." });
        }

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ success: false, message: "Invalid Skill ID format." });
        }

        const deletedSkill = await skillModel.findByIdAndDelete(id);

        if (!deletedSkill) {
            return res.status(400).json({ success: false, message: "Skill not found." });
        }

        return res.status(200).json({
            success: true,
            message: "Skill document deleted successfully"
        });
    }
    catch(err){
        return res.status(500).json({ 
            success: false,
            message: "An error occurred while deleting the skill.",
            error: err.message
        });
    }
}