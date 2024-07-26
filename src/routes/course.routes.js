import { Router } from 'express'
import courseC from '../controllers/course.controller.js'

const router = Router()

router.get('/', courseC.createCourse)

export default router
