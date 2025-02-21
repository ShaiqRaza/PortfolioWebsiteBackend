import { createSocials, getSocials, updateSocials } from "../controllers/socialsController.js";
import express from 'express'

const router = express.Router();

router.get('/', getSocials);
router.post('/create', createSocials);
router.post('/update', updateSocials);

export default router;