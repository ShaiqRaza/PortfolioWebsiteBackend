import { createAbout, updateAbout, getAbout } from "../controllers/aboutController.js";
import { isLoggedin } from "../middlewares/isLoggedin.js";
import upload from '../config/multerConfig.js'
import express from 'express'
const router = express.Router();

router.post('/create', isLoggedin, upload.single('avatar'), createAbout);
router.post('/update', isLoggedin, upload.single('avatar'), updateAbout);
router.get('/get', getAbout);

export default router;