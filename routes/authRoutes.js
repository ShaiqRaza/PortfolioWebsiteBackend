import { loginAdmin, logoutAdmin, isLoggedIn } from "../controllers/authController.js";
import { mustLoggedIn } from "../middlewares/mustLoggedIn.js";
import express from 'express'
const router = express.Router();

router.post('/login', loginAdmin)
router.post('/logout', mustLoggedIn, logoutAdmin)
router.get('/', isLoggedIn)

export default router;
