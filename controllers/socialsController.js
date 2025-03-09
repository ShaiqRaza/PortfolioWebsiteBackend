import socialModel from "../models/socialModel.js";
import dotenv from 'dotenv';
dotenv.config();

export const getSocials = async(req, res) =>{
    await socialModel.findOne()
    .then((response)=>{
        res.status(200).json({data:response, success: true});
    })
    .catch((err)=>{
        res.status(500).json({    
            success: false,        
            message:"Something error happened! Can't load All socials",
            error: err.message
        });
    })
}

export const createSocials = async(req, res) =>{
    try{
        if(process.env.NODE_ENV=='production')
            return res.status(400).json({success: false, message: "Request not acceptable in production."});
        const existingSocial = await socialModel.findOne();
        if(existingSocial)
            return res.status(400).json({success: false, message: "Request not acceptable as socials are already created."});
        const {instagram, x, github, linkedin, phone} = req.body;
        const socials = await socialModel.create({
            instagram,
            x,
            linkedin,
            github,
            phone
        });
        res.status(201).json({success: true, data: socials, message: "Socials created successfully."});
    }
    catch(err){
        res.status(500).json({ 
            success: false,
            message: "An error occurred while creating the socials.",
            error: err.message 
        });
    }
}

export const updateSocials = async(req, res) => {
    try
    {
        const {instagram, x, github, linkedin, phone} = req.body;
        const existingSocial = await socialModel.findOne();
        if(!existingSocial)
            return res.status(404).json({success: false, message: "Can't update socials as they are not created yet!"});
        if(instagram) existingSocial.instagram = instagram;
        if(x) existingSocial.x = x;
        if(github) existingSocial.github = github;
        if(linkedin) existingSocial.linkedin = linkedin;
        if(phone) existingSocial.phone = phone;
        await existingSocial.save();
        return res.json({success: true, data: existingSocial, message: "Socials updated successfully."});
    }
    catch(err){
        res.status(500).json({ 
            success: false,
            message: "An error occurred while updating the socials.",
            error: err.message
        });
    }
}