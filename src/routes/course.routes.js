import { Router } from 'express'
import courseC from '../controllers/course.controller.js'
import { validateTeacherRole } from '../helpers/general.js'

const router = Router()

router.use(validateTeacherRole)
router.post('/', courseC.createCourse)
router.patch('/edit', courseC.updateCourse)
router.delete('/delete', courseC.deleteCourse)

export default router
