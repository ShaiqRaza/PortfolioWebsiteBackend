import { getAllSkills, createSkill, updateSkill, deleteSkill } from "../controllers/skillController.js";
import { mustLoggedIn } from "../middlewares/mustLoggedIn.js";
import upload from '../config/multerConfig.js'
import express from 'express'
const router = express.Router();

router.get('/get-all', getAllSkills);
router.post('/create', upload.single('logo'),  createSkill);
router.post('/update/:id', upload.single('logo'), updateSkill);
router.post('/delete/:id', deleteSkill);

export default router;