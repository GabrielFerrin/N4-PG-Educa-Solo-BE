import { Router } from 'express'
import courseC from '../controllers/course.controller.js'
import { validateTeacherRole } from '../helpers/general.js'

const router = Router()

router.use(validateTeacherRole)
router.get('/', courseC.createCourse)

export default router
