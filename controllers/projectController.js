import mongoose from 'mongoose';
import projectModel from '../models/projectModel.js'

export const getAllProjects = async(req, res) =>{
    try{
        const projects = await projectModel.find();
        res.status(200).send(projects);
    }
    catch(err){
        res.status(500).json({            
            message:"Something error happened! Can't load All projects",
            error: err.message
        });
    }
}

export const createProject = async(req, res) =>{
    try{
        const {title, description} = req.body;
        if(!(title && description))
            return res.status(400).json({ message: "required fields are not given." });
        
        const {images} = req.files;
        const {video} = req.file;

    }
}

export const updateProject = async(req, res) =>{ 
    
}

export const deleteProject = async (req, res)=>{
    
}