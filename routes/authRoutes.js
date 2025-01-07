import { loginAdmin, logoutAdmin } from "../controllers/authController.js";
import { isLoggedin } from "../middlewares/isLoggedin.js";
import express from 'express'
const router = express.Router();

router.post('/login', loginAdmin)
router.post('/logout', isLoggedin, logoutAdmin)

export default router;