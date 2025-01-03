import { createAbout } from "../controllers/aboutController.js";
import express from 'express'
const router = express.Router();

router.post('/create', createAbout);

export default router;