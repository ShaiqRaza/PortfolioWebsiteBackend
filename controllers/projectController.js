import projectModel from '../models/projectModel.js'
import { imageUpload, imageDelete, videoUpload, videoDelete } from '../utils/uploadHandlers.js';
import fs from "fs/promises";

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
    const {images} = req.files;
    const {videos} = req.files;
    try{
        const {title, description} = req.body;

        if(!(title && description)){
            if (images) {
                await Promise.all(images.map(async (image) => {
                    await fs.unlink(image.path);  // Asynchronous operation
                }));                
            }
            if (videos && videos.length > 0) {
                await fs.unlink(videos[0].path);
            }
            return res.status(400).json({ message: "Required fields are not given." });
        }

        let uploadedImages = [];
        let uploadedVideo = null;  

        if(images)
            uploadedImages = await Promise.all(images.map(async (image) => {
                const uploadedImage = await imageUpload(image.path);
                return {
                    image: uploadedImage.secure_url,
                    image_id: uploadedImage.public_id
                }
            }));

        if(videos)
            uploadedVideo = await videoUpload(videos[0].path);

        const newProject = await projectModel.create({
            title,
            description,
            images: uploadedImages,
            video: uploadedVideo?.secure_url || null,
            video_id: uploadedVideo?.public_id || null
        });

        if (images) {
            await Promise.all(images.map(async (image) => {
                await fs.unlink(image.path);  // Asynchronous operation
            }));            
        }
        if (videos && videos.length > 0) {
            await fs.unlink(videos[0].path);
        }
        res.status(201).json(newProject);
    }
    catch(err){
        try{
            if (images) {
                await Promise.all(images.map(async (image) => {
                    await fs.unlink(image.path);  // Asynchronous operation
                }));                
            }
            if (videos && videos.length > 0) {
                await fs.unlink(videos[0].path);
            }
        }
        catch(err){
            return res.status(500).json({            
                message:"Something error happened! Can't create new project",
                error: err.message
            });
        }
        res.status(500).json({            
            message:"Something error happened! Can't create new project",
            error: err.message
        });
    }
}

export const updateProject = async(req, res) =>{ 
    
}

export const deleteProject = async (req, res)=>{
    
}