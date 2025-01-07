import { getAllSkills, createSkill, updateSkill, deleteSkill } from "../controllers/skillController.js";
import { isLoggedin } from "../middlewares/isLoggedin.js";
import express from 'express'
const router = express.Router();

router.get('/get-all', getAllSkills);
router.post('/create', isLoggedin,  createSkill);
router.post('/update/:id', isLoggedin, updateSkill);
router.post('/delete/:id', isLoggedin, deleteSkill);

export default router;