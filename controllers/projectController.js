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

export const addImage = async(req, res)=>{

    //if req.file is not given, then using multer image is not uploaded, so no need to unlink file if returning before saving doc
    const image = req.file;
    if(!image)
        return res.json({message: "Image is not given to add."})
    
    try{
        const id = req.params.id;
        if(!id || !mongoose.Types.ObjectId.isValid(id)){
            await fs.unlink(image.path);
            return res.status(500).json({message: "Id is not correct in url."});
        }

        const existingProject = await projectModel.findById(id);

        //if error occurs here, then no need to delete image from cloudinary, as that will not be uploaded yet
        const uploadedImage = await imageUpload(image.path);
        const uploadedImageObject = {
            image: uploadedImage.secure_url,
            image_id: uploadedImage.public_id
        }

        existingProject.images.push(uploadedImageObject)
        try{
            await fs.unlink(image.path);
            await existingProject.save();
        }
        catch(err){
            await imageDelete(uploadedImageObject.image_id)
            return res.status(500).json({            
                message:"Something error happened! Can't add image",
                error: err.message
            });
        }
        return res.send(existingProject)
    }
    catch(err){
        try{
            if(image)
                await fs.unlink(image.path);
        }
        catch(cleanUpErr){
            return res.status(500).json({            
                message:"Something error happened! Can't add image",
                error: cleanUpErr.message
            });
        }
        return res.status(500).json({            
            message:"Something error happened! Can't add image",
            error: err.message
        });
    }
}

export const deleteImage = async(req, res)=>{
    try{
        const {public_id} = req.body;
        const id = req.params.id;
        if(!id || !mongoose.Types.ObjectId.isValid(id))
            return res.status(400).json({ message: "Project ID is required for updating." });
        if(!public_id)
            return res.status(400).json({ message: "All fields are required." });
        const existingProject = await projectModel.findById(id);

        // stored the original array of images for backup
        const originalImageArray = existingProject.images;
       
        //Remove image objects in an images array of project schema
        const reducedImagesArray = existingProject.images.filter((image)=>{
            return image.image_id != public_id;
        })
        
        existingProject.images = reducedImagesArray;
        
        await existingProject.save();
        
        try{
            await imageDelete(public_id);
        }
        catch(err){
            existingProject.images = reducedImagesArray;      
            //if error doesn't occur in above save then here also, will not  
            await existingProject.save();
            return res.status(500).json({            
                message:"Something error happened! Can't delete image",
                error: err.message
            });
        }

        return res.send(existingProject);
    }
    catch(err){
        return res.status(500).json({            
            message:"Something error happened! Can't delete image",
            error: err.message
        });
    }
}

export const addVideo = async (req, res)=>{
    try{
        const video = req.file;
        if(!video)
            return res.status(400).json({message:"video is not given to add."})
        
        const id = req.params.id;
        if(!id || !mongoose.Types.ObjectId.isValid(id)){
            await fs.unlink(video.path);
            return res.status(400).json({ message: "Project ID is required." });
        }

        const existingProject = await projectModel.findById(id);
        if(!existingProject){
            await fs.unlink(video.path);
            return res.status(400).json({message: "Project ID is incorrect."})
        }

        if(existingProject.video){
            await fs.unlink(video.path);
            return res.status(400).json({message: "Can't add another video"})
        }
        
        const uploadedVideo = await videoUpload(video.path);

        existingProject.video = uploadedVideo.secure_url;
        existingProject.video_id = uploadedVideo.public_id;

        await existingProject.save();
        try{
            await fs.unlink(video.path);
        }
        catch(err){
            return res.status(500).json({
                message:"Something error happened! Can't add video",
                error: err.message
            });
        }
        return res.send(existingProject);
    }
    catch(err){
        if(req.file)
            await fs.unlink(req.file.path);            
        return res.status(500).json({
            message:"Something error happened! Can't add video",
            error: err.message
        });
    }
}

export const deleteVideo = async(req, res)=>{
    try{
        const id = req.params.id;
        if(!id || !mongoose.Types.ObjectId.isValid(id))
            return res.status(400).json({ message: "Project ID is required." });

        const {public_id} = req.body;
        if(!public_id)
            return res.status(400).json({ message: "All fields are required." });

        const existingProject = await projectModel.findById(id);
        if(!existingProject)
            return res.status(400).json({ message: "ID is incorrect." });

        //for backup
        const original_video = existingProject.video;
        const original_video_id = existingProject.video_id;

        existingProject.video = null;
        existingProject.video_id = null;
        await existingProject.save();

        try{
            await videoDelete(public_id);
        }
        catch(err){
            existingProject.video = original_video;
            existingProject.video_id = original_video_id;
            //if error doesn't occur in above save then here also will not
            await existingProject.save();
            return res.status(500).json({
                message:"Something error happened! Can't delete video",
                error: err.message
            });
        }

        return res.send(existingProject);
    }
    catch(err){
        return res.status(500).json({
            message:"Something error happened! Can't delete video",
            error: err.message
        });
    }
}

export const deleteProject = async (req, res)=>{
    
}