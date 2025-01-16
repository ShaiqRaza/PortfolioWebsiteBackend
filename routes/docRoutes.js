import express from "express";
const router = express.Router();
import upload from '../config/multerConfig.js'

import { createDoc, updateTitle, updateDescription, updateImage, getAllDocs } from "../controllers/docControllers.js";

router.get('/get-all', getAllDocs )
router.post('/create',upload.single('image'), createDoc )
router.post('/update-title/:id', updateTitle )
router.post('/update-image/:id', upload.single('image'), updateImage )
router.post('/update-description/:id', updateDescription )

export default router;