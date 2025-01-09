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
    
}

export const updateProject = async(req, res) =>{ 
    
}

export const deleteProject = async (req, res)=>{
    
}