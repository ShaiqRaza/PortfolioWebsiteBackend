import { getAllSkills } from "../controllers/skillController.js";
import express from 'express'
const router = express.Router();

router.get('/get-all', getAllSkills);

export default router;