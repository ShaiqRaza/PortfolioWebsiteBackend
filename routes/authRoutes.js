import { loginAdmin, logoutAdmin } from "../controllers/authController.js";
import express from 'express'
const router = express.Router();

router.post('/login', loginAdmin)
router.post('/logout', logoutAdmin)

export default router;