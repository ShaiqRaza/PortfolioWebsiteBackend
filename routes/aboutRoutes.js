import { createAbout, updateAvatar, updateIntro, updateDescription, getAbout } from "../controllers/aboutController.js";
import { mustLoggedIn } from "../middlewares/mustLoggedIn.js";
import upload from '../config/multerConfig.js'
import express from 'express'
const router = express.Router();

router.post('/create', upload.single('avatar'), createAbout);
router.post('/update-intro', upload.single('avatar'), updateIntro);
router.post('/update-avatar', upload.single('avatar'), updateAvatar);
router.post('/update-description', upload.single('avatar'), updateDescription);
router.get('/get', getAbout);

export default router;