import express from "express";
const router = express.Router();
import upload from '../config/multerConfig.js'

import { createDoc, updateTitle, updateDescription, updateImage } from "../controllers/docControllers.js";

router.post('/create',upload.single('image'), createDoc )
router.post('/update-title/:id', updateTitle )
router.post('/update-image/:id', upload.single('image'), updateImage )
router.post('/update-description/:id', updateDescription )

export default router;