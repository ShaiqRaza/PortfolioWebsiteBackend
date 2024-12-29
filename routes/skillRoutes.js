import { getAllSkills, createSkill, updateSkill, deleteSkill } from "../controllers/skillController.js";
import express from 'express'
const router = express.Router();

router.get('/get-all', getAllSkills);
router.post('/create', createSkill)
export default router;
