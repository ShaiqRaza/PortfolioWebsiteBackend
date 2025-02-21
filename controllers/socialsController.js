import socialModel from "../models/socialModel.js";
import dotenv from 'dotenv';
dotenv.config();

export const getSocials = async(req, res) =>{
    await socialModel.find()
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

export const createSocial = async(req, res) =>{
    try{
        if(process.env.NODE_ENV=='production')
            return res.status(400).json({success: false, message: "Request not acceptable in production."});
        const existingSocial = await socialModel.findOne();
        if(existingSocial)
            return res.status(400).json({success: false, message: "Request not acceptable as socials are already created."});
        const {instagram, x, facebook, phone} = req.body;
        const socials = await socialModel.create({
            instagram,
            x,
            facebook,
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