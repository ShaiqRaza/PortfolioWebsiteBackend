import mongoose from 'mongoose';
import projectModel from '../models/projectModel.js'
import { imageUpload, imageDelete, videoUpload, videoDelete } from '../utils/uploadHandlers.js';

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

        const uploadedImages = Promise.all(images.map(async (image) => {
            const uploadedImage = await imageUpload(image);
            return {
                image: uploadedImage.secure_url,
                image_id: uploadedImage.public_id
            }
        }));

        const uploadedVideo = await videoUpload(video);

        const newProject = await projectModel.create({
            title,
            description,
            images: uploadedImages,
            video: uploadedVideo.secure_url,
            video_id: uploadedVideo.public_id
        });

        res.status(201).json(newProject);
    }
    catch(err){
        res.status(500).json({            
            message:"Something error happened! Cn't create new project",
            error: err.message
        });
    }
}

export const updateProject = async(req, res) =>{ 
    
}

export const deleteProject = async (req, res)=>{
    
}