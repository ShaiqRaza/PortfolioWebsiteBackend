import express from 'express'
const router = express.Router();

import {getAllProjects, createProject, updateProject, deleteProject} from '../controllers/projectController.js'
import upload from '../config/multerConfig.js'
const uploadFields = upload.fields([
    { name: 'videos', maxCount: 1 },
    { name: 'images' }
]);

router.get('/get-all', getAllProjects);
router.post('/create',uploadFields, createProject);

export default router;