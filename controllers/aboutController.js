import dotenv from 'dotenv';
dotenv.config();
import aboutModel from "../models/aboutModel.js";
import bcrypt from 'bcrypt';

export const createAbout = async(req, res) => {
    try {
        if (process.env.NODE_ENV == 'production')
            return res.status(400).json({ message: "You are not allowed to create about in production environment" });

        const { intro, description, avatar, password } = req.body;

        if (!(intro && description && avatar && password))
            return res.status(400).json({ message: "All fields are required." });

        const existingAbout = await aboutModel.find();

        if (existingAbout.length > 0)
            return res.status(400).json({ message: "About already exists" });

        bcrypt.genSalt(10, function(err, salt) {
            if (err) 
                return res.status(500).json({ message: "Error occurred at salt generation.", error: err.message });

            bcrypt.hash(password, salt, async function(err, hash) {
                if (err) 
                    return res.status(500).json({ message: "Error occurred at hash generation.", error: err.message });

                const newAbout = await aboutModel.create({
                    intro,
                    description,
                    avatar,
                    password: hash
                });

                res.status(201).json(newAbout);
            });
        });

    } catch (err) {
        res.status(500).json({ 
            message: "An error occurred while creating the about.",
            error: err.message 
        });
    }
}

export const loginAdmin = async(req, res) => {
    try{
        const about = await aboutModel.findOne();
        if(!about)
            return res.status(404).json({ message: "About not found!" });
        const hash = about.password;
        const {password} = req.body;
        bcrypt.compare(password, hash, function(err, result) {
            if(err)
                return res.status(500).json({message: "Error occured in hash comparing", error: err.message})
            if(result){
                res.cookie('admin', "success", {httpOnly: true});
                return res.status(200).json({ message: "Login successful!" });
            }
        });
    }
    catch(err){
        res.status(500).json({
            message: "An error occures while login the admin",
            error: err.message
        })
    }
}