import { getAllSkills, createSkill, updateSkill, deleteSkill } from "../controllers/skillController.js";
import { mustLoggedIn } from "../middlewares/mustLoggedIn.js";
import express from 'express'
const router = express.Router();

router.get('/get-all', getAllSkills);
router.post('/create', createSkill);
router.post('/update/:id', updateSkill);
router.post('/delete/:id', deleteSkill);

export default router;