import { createAbout } from "../controllers/aboutController.js";
import { isLoggedin } from "../middlewares/isLoggedin.js";
import express from 'express'
const router = express.Router();

router.post('/create', isLoggedin, createAbout);

export default router;