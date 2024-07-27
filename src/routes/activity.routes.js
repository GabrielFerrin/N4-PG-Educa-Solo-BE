import { Router } from 'express'
import activityC, { validateTeacherRole } from '../controllers/activity.controller.js'

const router = Router()

router.post('/', activityC.createActivity)
router.post('/act-item', validateTeacherRole, activityC.createActItem)

export default router
