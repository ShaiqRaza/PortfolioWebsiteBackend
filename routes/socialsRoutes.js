import { createSocials, getSocials } from "../controllers/socialsController.js";
import express from 'express'

const router = express.Router();

router.get('/', getSocials);
router.post('/create', createSocials);

export default router;