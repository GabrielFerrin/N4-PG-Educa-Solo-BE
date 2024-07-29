import Activity from '../models/Activity.js'
import Attempt from '../models/Attempt.js'

const createAttempt = async (req, res) => {
  let message = 'Se requiere el id de la actividad'
  if (!req.body.activityId) {
    return res.status(400).json({ success: false, message })
  }
  try {
    const activity = await Activity.findOne({ _id: req.body.activityId })
    if (!activity) {
      message = 'La actividad no existe'
      return res.status(400).json({ success: false, message })
    }
    const answers = activity.items.map(({ _id }) => ({ itemId: _id }))
    const response = await Attempt.create({
      userId: req.body.userId,
      activityId: req.body.activityId,
      grade: req.body.grade,
      answers
    })
    return res.send(response)
  } catch (error) {
    return res.status(500)
      .json({ success: false, message: error.message })
  }
}

const answerQuestion = async (req, res) => {
  let message = 'Falta información requerida'
  const { attemptId, itemId, data } = req.body
  if (!attemptId || !itemId || !data) {
    return res.status(400).json({ success: false, message })
  }
  try {
    const attempt = await Attempt.findOne({ _id: attemptId })
    if (!attempt) {
      message = 'El intento no existe'
      return res.status(400).json({ success: false, message })
    }
    const answer = attempt.answers.find(answer => answer.itemId.equals(itemId))
    if (!answer) {
      const message = 'La pregunta no existe'
      return res.status(400).json({ success: false, message })
    }
    answer.data = data
    await attempt.save()
    return res.status(200).json({ success: true, message: 'Datos actualizados correctamente', attempt })
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message })
  }
}

export default { createAttempt, answerQuestion }
