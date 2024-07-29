import { Router } from 'express'
import attemptC from '../controllers/attempt.controller.js'
import { auth } from '../middleware/auth.js'

const router = Router()

router.use(auth)
router.post('/', attemptC.createAttempt)
router.post('/answer', attemptC.answerQuestion)

export default router
