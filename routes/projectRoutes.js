import express from 'express'
const router = express.Router();

import {getAllProjects, createProject, updateProject, deleteProject} from '../controllers/projectController.js'

router.get('/get-all', getAllProjects);

export default router;