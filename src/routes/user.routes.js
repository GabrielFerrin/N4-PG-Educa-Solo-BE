import { Router } from 'express'
import userC from '../controllers/user.controller.js'
import { auth } from '../middleware/auth.js'
import { validateTeacherRole } from '../helpers/general.js'

const router = Router()

router.get('/', auth)
router.get('/all', validateTeacherRole, userC.getUsers)
router.post('/', userC.createUser)
router.post('/login', userC.login)
router.post('/enroll', auth, userC.enrollCourse)

export default router
