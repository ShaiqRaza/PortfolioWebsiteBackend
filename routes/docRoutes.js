import express from "express";
const router = express.Router();
import upload from '../config/multerConfig.js'

import { createDoc } from "../controllers/docControllers.js";

router.post('/create',upload.single('image'), createDoc )

export default router;