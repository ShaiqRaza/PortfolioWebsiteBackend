import dotenv from 'dotenv';
dotenv.config();
import aboutModel from "../models/aboutModel.js";

export const createAbout = async(req, res) => {
    try {
        if (process.env.NODE_ENV == 'production')
            return res.status(400).json({ message: "You are not allowed to create about in production environment" });

        const { intro, description, avatar } = req.body;

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