import { Router } from 'express'
import userC from '../controllers/user.controller.js'
import { auth } from '../middleware/auth.js'

const router = Router()

router.get('/', auth, userC.getUsers)
router.post('/', userC.createUser)
router.post('/login', userC.login)
router.post('/enroll', auth, userC.enrollCourse)

export default router
