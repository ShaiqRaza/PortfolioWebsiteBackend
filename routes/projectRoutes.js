import express from 'express'
const router = express.Router();

import {getAllProjects, createProject, updateProject, deleteProject, addImage, deleteImage, addVideo} from '../controllers/projectController.js'
import upload from '../config/multerConfig.js'
const uploadFields = upload.fields([
    { name: 'videos', maxCount: 1 },
    { name: 'images' }
]);

router.get('/get-all', getAllProjects);
router.post('/create',uploadFields, createProject);
router.post('/update/:id',uploadFields, updateProject);
router.post('/add-image/:id', upload.single('image'), addImage);
router.post('/delete-image/:id', deleteImage);
router.post('/add-video/:id', upload.single('video'), deleteImage);

export default router;