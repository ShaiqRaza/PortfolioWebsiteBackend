import { createAbout, loginAdmin } from "../controllers/aboutController.js";
import express from 'express'
const router = express.Router();

router.post('/create', createAbout);
router.post('/login', loginAdmin);

export default router;