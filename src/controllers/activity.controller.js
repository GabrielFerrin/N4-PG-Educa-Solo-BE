import { createToken } from '../helpers/general.js'
import jwt from 'jsonwebtoken'
import Activity from '../models/Activity.js'
import Course from '../models/Course.js'
import User from '../models/User.js'
import { SECRET_KEY } from '../config/config.js'

const createActivity = async (req, res) => {
  const errorList = []
  await validateActivity(req.body, errorList)
  if (errorList.length > 0) {
    return res.status(400).json(errorList)
  }
  try {
    const response = await Activity.create({
      name: req.body.name,
      starts: req.body.starts,
      ends: req.body.ends,
      minGrade: req.body.minGrade,
      maxGrade: req.body.maxGrade,
      course: req.body.course
    })
    res.status(201).json({ success: true, data: response })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

const validateActivity = async (activity, errorList) => {
  if (!activity.name) errorList.push('El nombre es requerido')
  if (!activity.course) errorList.push('El curso es requerido')
  if (activity.name && activity.course) {
    const courseExists = await Course.findOne({ _id: activity.course })
    console.log(activity.course)
    if (!courseExists) errorList.push('El curso no existe')
  }
}

// activity itmes
const createActItem = async (req, res) => {
  if (!req.body.type || !req.body.data || !req.body.activityId) {
    const message = 'Datos incompletos'
    return res.status(400).json({ success: false, message })
  }
  const errorList = []
  validateItem(req.body, errorList)
  if (errorList.length > 0) {
    return res.status(400).json(errorList)
  }
  try {
    const response = await Activity.findOneAndUpdate(
      { _id: req.body.activityId },
      {
        $push: {
          items: {
            type: req.body.type,
            data: req.body.data
          }
        }
      },
      { new: true }
    )
    if (!response) {
      const message = 'La actividad no existe'
      return res.status(400).json({ success: false, message })
    }
    res.status(201).json({ success: true, data: response })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

const validateItem = (activity, errorList) => {
  switch (activity.type) {
    case 'video':
    case 'text':
      validateVideoItem(activity.data, errorList)
      break
    case 'mult':
      validateMultItem(activity.data, errorList)
      break
    case 'bool':
      validateBoolItem(activity.data, errorList)
      break
    default:
      errorList.push('Tipo de actividad inválido')
      break
  }
}

const validateVideoItem = (item, errorList) => {
  if (!item.prompt) errorList.push('El promt es requerido')
}

const validateMultItem = (activity, errorList) => {
  if (!activity.question) errorList.push('Se requiere la pregunta')
  if (!activity.options) errorList.push('Se requieren las opciones')
  if (activity?.options?.length < 2) errorList.push('Se requieren al menos dos opciones')
  if (!activity.answer) errorList.push('Se requiere la respuesta')
}

const validateBoolItem = (activity, errorList) => {
  console.log(activity.answer === null)
  if (!activity.statement) errorList.push('Se requiere la afirmación')
  if (!activity.answer === null) errorList.push('Se requiere la respuesta')
}

export const validateTeacherRole = async (req, res, next) => {
  const { authorization } = req.headers
  let message = 'No autorizado'
  if (!authorization) {
    return res.status(401).json({ success: false, message })
  }
  try {
    const decoded = await jwt.verify(authorization, SECRET_KEY)
    const user = await User.findById(decoded.id)
    if (!user) {
      message = 'No autorizado'
      return res.status(401).json({ success: false, message })
    }
    if (user.role !== 'maestro') {
      console.log(user)
      message = 'El usuario no tiene los permisos necesarios'
      return res.status(401).json({ success: false, message })
    }
    const token = createToken({ id: user._id })
    req.body.userId = decoded.id
    req.body.token = token
    next()
  } catch (error) {
    return res.status(401)
      .json({ success: false, message: error.message })
  }
}

export default { createActivity, createActItem, validateTeacherRole }
