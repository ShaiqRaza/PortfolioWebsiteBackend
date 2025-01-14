import express from "express";
const router = express.Router();
import upload from '../config/multerConfig.js'

import { createDoc, updateTitle, updateDescription } from "../controllers/docControllers.js";

router.post('/create',upload.single('image'), createDoc )
router.post('/update-title/:id', updateTitle )
router.post('/update-description/:id', updateDescription )

export default router;