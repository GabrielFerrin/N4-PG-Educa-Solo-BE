import { Router } from 'express'
import userC from '../controllers/user.controller.js'
import { auth } from '../middleware/auth.js'
import { authVideo } from '../middleware/authVideo.js'
import { validateTeacherRole } from '../helpers/general.js'

const router = Router()

router.get('/', auth)
router.get('/all', validateTeacherRole, userC.getUsers)
router.post('/', userC.createUser)
router.post('/login', userC.login)
router.post('/enroll', auth, userC.enrollCourse)
router.put('/update', auth, userC.updateUser)
router.delete('/users', auth, userC.deleteUser)
router.get('/videos', auth, userC.getUserVideos)
router.get('/video', authVideo, userC.getVideo)

export default router
