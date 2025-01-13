import express from 'express'
const router = express.Router();

import {getAllProjects, createProject, deleteProject, addImage, deleteImage, addVideo, deleteVideo} from '../controllers/projectController.js'
import upload from '../config/multerConfig.js'
const uploadFields = upload.fields([
    { name: 'videos', maxCount: 1 },
    { name: 'images' }
]);

router.get('/get-all', getAllProjects);
router.post('/create',uploadFields, createProject);
router.post('/add-image/:id', upload.single('image'), addImage);
router.post('/delete-image/:id', deleteImage);
router.post('/add-video/:id', upload.single('video'), addVideo);
router.post('/delete-video/:id', deleteVideo);
router.post('/delete/:id', deleteProject);

export default router;