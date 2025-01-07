import { createAbout, updateAbout } from "../controllers/aboutController.js";
import { isLoggedin } from "../middlewares/isLoggedin.js";
import express from 'express'
const router = express.Router();

router.post('/create', isLoggedin, createAbout);
router.post('/update', isLoggedin, updateAbout);

export default router;