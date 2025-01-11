import projectModel from '../models/projectModel.js'
import { imageUpload, imageDelete, videoUpload, videoDelete } from '../utils/uploadHandlers.js';
import fs from "fs/promises";
import mongoose from 'mongoose';

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
    const {images=null, videos=null} = req.files || {};
    try{
        const {title, description} = req.body;
        const id = req.params.id;

        if(!id || !mongoose.Types.ObjectId.isValid(id)){
            if (images) {
                await Promise.all(images.map(async (image) => {
                    await fs.unlink(image.path);  // Asynchronous operation
                }));                
            }
            if (videos && videos.length > 0) {
                await fs.unlink(videos[0].path);
            }
            return res.status(400).json({ message: "Project ID is required for updating." });
        }

        const existingProject = await projectModel.findById(id);

        if((!title || title == existingProject.title) && (!description || description == existingProject.description) && (!images || images.length==0) && (!videos || videos.length==0))
            return res.status(400).json({ message: "Nothing to update." });

        if(title && title != existingProject.title) existingProject.title = title;
        if(description && description != existingProject.description) existingProject.description = description;
        if(videos && videos.length>0){
            const uploadedVideo = await videoUpload(videos[0].path);
            existingProject.video = uploadedVideo.secure_url;
            existingProject.video_id = uploadedVideo.public_id;
        }
        let uploadedImages = [];
        if(images && images.length>0){
            uploadedImages = await Promise.all( images.map(async(image)=>{
                const uploadedImage = await imageUpload(image.path);
                return {
                    image: uploadedImage.secure_url,
                    image_id: uploadedImage.public_id
                }
            }));
            existingProject.images = uploadedImages;
        }

        await existingProject.save();
        if (images) {
            await Promise.all(images.map(async (image) => {
                await fs.unlink(image.path);  // Asynchronous operation
            }));                
        }
        if (videos && videos.length > 0) {
            await fs.unlink(videos[0].path);
        }
        return res.send(existingProject)
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
        catch(cleanUpErr){
            return res.status(500).json({            
                message:"Something error happened! Can't update project",
                error: cleanUpErr.message
            });
        }
        res.status(500).json({            
            message:"Something error happened! Can't update project",
            error: err.message
        });
    }
}

export const deleteProject = async (req, res)=>{
    
}