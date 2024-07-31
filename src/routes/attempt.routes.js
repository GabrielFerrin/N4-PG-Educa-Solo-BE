import { Router } from 'express'
import attemptC from '../controllers/attempt.controller.js'
import { auth } from '../middleware/auth.js'
import { videoUpload } from '../middleware/videoUpload.js'

const router = Router()

router.use(auth)
router.get('/', attemptC.getAttempt)
router.get('/all', attemptC.getAttempts)
router.post('/', attemptC.createAttempt)
router.post('/answer', videoUpload.single('video'),
  attemptC.answerQuestion)
router.post('/close', attemptC.closeAttempt)

export default router
