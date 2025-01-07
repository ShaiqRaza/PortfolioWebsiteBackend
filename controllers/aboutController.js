import dotenv from 'dotenv';
dotenv.config();
import aboutModel from "../models/aboutModel.js";

export const createAbout = async(req, res) => {
    try {
        if (process.env.NODE_ENV == 'production')
            return res.status(400).json({ message: "You are not allowed to create about in production environment" });

        const { intro, description } = req.body;
        const avatar = req.file ? req.file.path : null;

        if (!(intro && description && avatar))
            return res.status(400).json({ message: "All fields are required." });

        const existingAbout = await aboutModel.find();

        if (existingAbout.length > 0)
            return res.status(400).json({ message: "About already exists" });

        const newAbout = await aboutModel.create({
            intro,
            description,
            avatar
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
        const {intro, description, avatar} = req.body;
        if(!(intro || description || avatar))
            return res.status(500).json({message: "Nothing to change!"});
        const prevAbout = await aboutModel.findOne();

        if(!prevAbout)
            return res.status(500).json({ message: "About section is not created yet"})

        if(intro) prevAbout.intro = intro;
        if(description) prevAbout.description = description;
        if(avatar) prevAbout.avatar = avatar;
        await prevAbout.save();
        return res.status(200).send("About updated successfully")
    }
    catch(err){
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