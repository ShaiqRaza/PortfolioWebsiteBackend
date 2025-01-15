import projectModel from '../models/projectModel.js'
import { imageUpload, imageDelete, videoUpload, videoDelete } from '../utils/uploadHandlers.js';
import fs from "fs/promises";
import mongoose from 'mongoose';

//utlis for project controller only
const cleanUpFromDisk = async (images, videos)=>{
    if (images) {
        await Promise.all(images.map(async (image) => {
            await fs.unlink(image.path);  // Asynchronous operation
        }));                
    }
    if (videos && videos.length > 0) {
        await fs.unlink(videos[0].path);
    }
}

export const getAllProjects = async(req, res) =>{
    try{
        const projects = await projectModel.find();
        res.status(200).json({
            success: true,
            data: projects,
            message: "All projects loaded successfully"
        });
    }
    catch(err){
        res.status(500).json({  
            success: false,          
            message:"Something error happened! Can't load All projects",
            error: err.message
        });
    }
}

export const createProject = async(req, res) =>{
    const {images=null, videos=null} = req.files || {};
    let uploadedImages = [];
    let uploadedVideo = null;  

    try{
        const {title, description} = req.body;

        if(!(title && description)){
            await cleanUpFromDisk(images, videos);
            return res.status(400).json({success: false, message: "Required fields are not given." });
        }

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

        await cleanUpFromDisk(images, videos);
        res.status(200).json({
            success: true,
            data: newProject,
            message: "Project created successfully"
        });
    }
    catch(err){
        let errorMessage = err.message;
        try{
            await cleanUpFromDisk(images, videos);
            if(uploadedImages.length>0)
                await Promise.all(images.map(async (image) => await imageDelete(image.image_id)));
            if(uploadedVideo)
                await videoDelete(uploadedVideo.public_id);
        }
        catch(err){
            errorMessage = `${errorMessage} - ClenaUpError: ${err.message}`;
        }
        res.status(500).json({    
            success: false,        
            message:"Something error happened! Can't create new project",
            error: errorMessage
        });
    }
}

export const updateTitle = async(req, res)=>{
    try{
        const {title} = req.body;
        if(!title)
            return res.status(400).json({success: false, message: "Nothing to update!"});

        const id = req.params.id;
        if(!id || !mongoose.Types.ObjectId.isValid(id))
            return res.status(400).json({success: false, message: "Project ID is not correct." });

        const existingProject = await projectModel.findById(id);
        if(!existingProject)
            return res.status(400).json({success: false, message: "Project not found."})

        if(title == existingProject.title)
            return res.status(400).json({success: false, message: "Nothing to update!"});

        existingProject.title = title;
        await existingProject.save();
        return res.status(200).json({
            success: true,
            data: existingProject,
            message: "Title updated successfully"
        });
    }
    catch(err){
        res.status(500).json({     
            success: false,       
            message:"Something error happened! Can't update title.",
            error: err.message
        });
    }
}

export const updateDescription = async(req, res)=>{
    try{
        const {description} = req.body;
        if(!description)
            return res.status(400).json({success: false, message: "Nothing to update!"});

        const id = req.params.id;
        if(!id || !mongoose.Types.ObjectId.isValid(id))
            return res.status(400).json({success: false, message: "Project ID is not correct." });

        const existingProject = await projectModel.findById(id);
        if(!existingProject)
            return res.status(400).json({success: false, message: "Project not found."})

        if(description == existingProject.description)
            return res.status(400).json({success: false, message: "Nothing to update!"});

        existingProject.description = description;
        await existingProject.save();
        return res.json({
            success: true,
            data: existingProject,
            message: "Description updated successfully"
        });
    }
    catch(err){
        res.status(500).json({
            success: false,            
            message:"Something error happened! Can't update description.",
            error: err.message
        });
    }
}

export const addImage = async(req, res)=>{
    //if req.file is not given, then using multer image is not uploaded, so no need to unlink file if returning before saving doc
    const image = req.file;
    if(!image)
        return res.status(400).json({success: false, message: "Image is not given to add."});
    let uploadedImage = null;
    
    try{
        const id = req.params.id;
        if(!id || !mongoose.Types.ObjectId.isValid(id)){
            await fs.unlink(image.path);
            return res.status(400).json({success: false, message: "Project ID is not correct."});
        }

        const existingProject = await projectModel.findById(id);
        if(!existingProject){
            await fs.unlink(image.path);
            return res.status(400).json({success: false, message: "Project not found."})
        }

        //if error occurs here, then no need to delete image from cloudinary, as that will not be uploaded yet
        uploadedImage = await imageUpload(image.path);
        const uploadedImageObject = {
            image: uploadedImage.secure_url,
            image_id: uploadedImage.public_id
        }
        existingProject.images.push(uploadedImageObject);

        await fs.unlink(image.path);
        await existingProject.save();

        return res.status(200).json({
            success: true,
            data: existingProject,
            message: "Image added successfully"
        })
    }
    catch(err){
        let errorMessage = err.message;
        try{
            if(image)
                await fs.unlink(image.path);
            if(uploadedImage)
                await imageDelete(uploadedImage.public_id);
        }
        catch(err){
            errorMessage = `${errorMessage} -  CleanUpError: ${err.message}`
        }
        return res.status(500).json({    
            success: false,        
            message:"Something error happened! Can't add image",
            error: errorMessage
        });
    }
}

export const deleteImage = async(req, res)=>{
    try{
        const id = req.params.id;
        if(!id || !mongoose.Types.ObjectId.isValid(id))
            return res.status(400).json({success: false, message: "Project ID is not correct." });
        
        const {image_id} = req.body;//getting public_id of particular image to delete
        if(!image_id)
            return res.status(400).json({success: false, message: "All fields are required." });

        const existingProject = await projectModel.findById(id);
        if(!existingProject)
            return res.status(400).json({success: false, message: "Project not found."})

        // stored the original array of images for backup
        const originalImageArray = existingProject.images;
       
        //Remove image objects in an images array of project schema
        const reducedImagesArray = existingProject.images.filter((image)=>{
            return image.image_id != image_id;
        })
        
        existingProject.images = reducedImagesArray;        
        await existingProject.save();
        
        try{
            await imageDelete(image_id);
        }
        catch(err){
            existingProject.images = originalImageArray;      
            //if error doesn't occur in above save then here also, will not  
            await existingProject.save();
            return res.status(500).json({ 
                success: false,           
                message:"Something error happened! Can't delete image",
                error: err.message
            });
        }

        return res.status(200).json({
            success: true,
            data: existingProject,
            message: "Image deleted successfully"
        });
    }
    catch(err){
        return res.status(500).json({  
            success: false,          
            message:"Something error happened! Can't delete image",
            error: err.message
        });
    }
}

export const addVideo = async (req, res)=>{
    let uploadedVideo = null;
    try{
        const video = req.file;
        if(!video)
            return res.status(400).json({success: false, message:"video is not given to add."})
        
        const id = req.params.id;
        if(!id || !mongoose.Types.ObjectId.isValid(id)){
            await fs.unlink(video.path);
            return res.status(400).json({success: false, message: "Project ID is not correct." });
        }

        const existingProject = await projectModel.findById(id);
        if(!existingProject){
            await fs.unlink(video.path);
            return res.status(400).json({success: false, message: "Project not found."})
        }

        if(existingProject.video){
            await fs.unlink(video.path);
            return res.status(400).json({success: false, message: "Cannot add more than one video."})
        }
        
        uploadedVideo = await videoUpload(video.path);

        existingProject.video = uploadedVideo.secure_url;
        existingProject.video_id = uploadedVideo.public_id;

        await existingProject.save();
        await fs.unlink(video.path);

        return res.status(200).json({
            success: true,
            data: existingProject,
            message: "Video added successfully"
        });
    }
    catch(err){
        let errorMessage = err.message;
        try{
            if(req.file)
                await fs.unlink(req.file.path);
            if(uploadedVideo)
                await videoDelete(uploadedVideo.public_id);
        }
        catch(err){
            errorMessage = `${errorMessage} -  CleanUpError: ${err.message}`
        }
        return res.status(500).json({
            success: false,
            message:"Something error happened! Can't add video",
            error: errorMessage
        });
    }
}

export const deleteVideo = async(req, res)=>{
    try{
        const id = req.params.id;
        if(!id || !mongoose.Types.ObjectId.isValid(id))
            return res.status(400).json({success: false, message: "Project ID is not correct." });

        const {video_id} = req.body;
        if(!video_id)
            return res.status(400).json({success: false, message: "All fields are required." });

        const existingProject = await projectModel.findById(id);
        if(!existingProject)
            return res.status(400).json({success: false, message: "Project not found." });

        //for backup
        let originalVideo = existingProject.video;
        let originalVideo_id = existingProject.video_id;

        existingProject.video = null;
        existingProject.video_id = null;       
        await existingProject.save();

        try{
            await videoDelete(video_id);
        }
        catch(err){
            existingProject.video = originalVideo;
            existingProject.video_id = originalVideo_id;       
            await existingProject.save();

            return res.status(500).json({
                success: false,
                message:"Something error happened! Can't delete video from server.",
                error: err.message
            });
        }

        return res.status(200).json({
            success: true,
            data: existingProject,
            message: "Video deleted successfully"
        });
    }
    catch(err){
        return res.status(500).json({
            success: false,
            message:"Something error happened! Can't delete video.",
            error: err.message
        });
    }
}

//need transaction kind of concept in mongoose to handle all edge case errors
// so will this update in future
export const deleteProject = async (req, res)=>{
    try{
        const id = req.params.id;
        if(!id || !mongoose.Types.ObjectId.isValid(id))
            return res.status(400).json({success: false, message: "Project ID is not correct." });

        const existingProject = await projectModel.findById(id);
        if(!existingProject)
            return res.status(400).json({success: false, message: "Project not found." });
       
        if(existingProject.video)
            await videoDelete(existingProject.video_id);
        
        if(existingProject.images.length>0)
            try{
                await Promise.all(existingProject.images.map(async(image)=>await imageDelete(image.image_id)));
            }
            catch(err){
                await existingProject.deleteOne();
                return res.status(200).json({ 
                    success: true,           
                    message:"Project deleted but images can't delete from server",
                    error: err.message
                });
            }
        
        await existingProject.deleteOne();
        res.status(200).json({
            success: true,
            message: "Project deleted successfully.",
        });
    }
    catch(err){
        res.status(500).json({        
            success: false,    
            message:"Something error happened! Can't delete project",
            error: err.message
        });
    }
}