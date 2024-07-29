import { Router } from 'express'
import attemptC from '../controllers/attempt.controller.js'
import { auth } from '../middleware/auth.js'
import { videoUpload } from '../middleware/videoUpload.js'

const router = Router()

router.use(auth)
router.post('/', attemptC.createAttempt)
router.post('/answer', videoUpload.single('video'),
  attemptC.answerQuestion)

export default router
