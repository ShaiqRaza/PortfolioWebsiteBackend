import mongoose from 'mongoose';
import skillModel from '../models/skillModel.js'

export const getAllSkills = async(req, res) =>{
    await skillModel.find()
    .then((response)=>{
        res.status(200).json(response);
    })
    .catch((err)=>{
        res.status(500).json({            
            message:"Something error happened! Can't load All skills",
            error: err.message
        });
    })
}

export const createSkill = async(req, res) =>{
    try{
        const {title, description} = req.body;
        const existingSkill = await skillModel.findOne({title});

        if(existingSkill){
            return res.status(400).send(`${title} skill already exists`);
        }

        const newSkill = await skillModel.create({
            title,
            description
        });
        res.status(201).json(newSkill);
    }
    catch(err){
        res.status(500).json({ 
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
            return res.status(400).json({ message: "Skill ID is required for updating." });
        }

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid Skill ID format." });
        }

        const existingSkill = await skillModel.findById(id);

        if(!existingSkill){
            return res.status(404).json({ message: "Skill not found!" });
        }

        if (title) existingSkill.title = title;
        if (description) existingSkill.description = description;

        await existingSkill.save();
        return res.status(200).json(existingSkill);
    }
    catch(err){
        return res.status(500).json({ 
            message: "An error occurred while updating the skill.",
            error: err.message 
        });
    }
}

export const deleteSkill = async (req, res)=>{
    try{
        const id = req.params.id;

        if (!id) {
            return res.status(400).json({ message: "Skill ID is required for deletion." });
        }

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid Skill ID format." });
        }

        const deletedSkill = await skillModel.findByIdAndDelete(id);

        if (!deletedSkill) {
            return res.status(404).json({ message: "Skill not found or already deleted." });
        }

        return res.status(200).json({
            message: "Skill document deleted successfully"
        });
    }
    catch(err){
        return res.status(500).json({ 
            message: "An error occurred while deleting the skill.",
            error: err.message
        });
    }
}