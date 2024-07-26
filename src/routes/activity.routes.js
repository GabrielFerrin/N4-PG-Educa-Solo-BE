import { Router } from 'express'
import activityC from '../controllers/activity.controller.js'

const router = Router()

router.post('/', activityC.createActivity)

export default router
