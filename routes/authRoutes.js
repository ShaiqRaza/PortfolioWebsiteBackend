import { loginAdmin, logoutAdmin, isLoggedIn } from "../controllers/authController.js";
import { isLoggedin } from "../middlewares/isLoggedin.js";
import express from 'express'
const router = express.Router();

router.post('/login', loginAdmin)
router.post('/logout', isLoggedin, logoutAdmin)
router.get('/', isLoggedIn)

export default router;
