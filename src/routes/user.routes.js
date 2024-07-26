import { Router } from 'express'
import userC from '../controllers/user.controller.js'

const router = Router()

router.get('/', userC.getUsers)
router.post('/', userC.createUser)

export default router
