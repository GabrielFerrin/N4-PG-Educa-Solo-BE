import { Router } from 'express'
import activityC from '../controllers/activity.controller.js'
import { validateTeacherRole } from '../helpers/general.js'

const router = Router()

router.use(validateTeacherRole)
router.post('/', activityC.createActivity)
router.post('/act-item', activityC.createActItem)

export default router
