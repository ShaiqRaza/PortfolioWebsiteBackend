import express from 'express'
const router = express.Router();

import {createAdmin, updateAdmin} from '../controllers/adminController.js'

router.post('/create', createAdmin)
router.post('/update', updateAdmin)

export default router;