import { isValidObjectId } from 'mongoose'
import { createToken } from '../helpers/general.js'
import User from '../models/User.js'
import { compare, hash } from 'bcrypt'
import Course from '../models/Course.js'
import Attempt from '../models/Attempt.js'
import path from 'path'

const getUsers = async (req, res) => {
  try {
    const response = await User.find()
    res.json({ success: true, data: response })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

const createUser = async (req, res) => {
  const errorList = []
  await validateUser(req.body, errorList)
  if (errorList.length > 0) {
    return res.status(400).json({ success: false, message: errorList })
  }
  try {
    const hashedPassword = await hash(req.body.hash, 11)
    const response = await User.create({
      username: req.body.username,
      hash: hashedPassword,
      name: req.body.name || '',
      surname: req.body.surname || '',
      email: req.body.email || '',
      role: req.body.role
    })
    const { hash: _hash, _id, __v, courses, ...user } =
      response.toObject()
    const token = createToken({ id: _id })
    user.token = token
    res.status(201).json({ success: true, data: user })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// helper
const validateUser = async (user, errorList) => {
  if (!user.username) errorList.push('El usuario es requerido')
  if (!user.hash) errorList.push('La contraseña es requerida')
  if (user.role) {
    (user.role !== 'estudiante' && user.role !== 'maestro') &&
      errorList.push('Rol inválido')
  }
  if (user.username) {
    const userExists = await User.findOne({ username: user.username })
    if (userExists) {
      const message = 'El usuario ya existe'
      errorList.push(message)
    }
  }
  if (user.email) {
    const emailExists = await User.findOne({ email: user.email })
    if (emailExists) {
      const message = 'El correo ya existe'
      errorList.push(message)
    }
  }
}

const login = async (req, res) => {
  if (!req.body.username || !req.body.password) {
    const message = 'El usuario y la contraseña son requeridos'
    return res.status(401).json({ success: false, message })
  }
  try {
    const user = await User.findOne({ username: req.body.username })
      .populate({
        path: 'courses.courseId',
        populate: [
          { path: 'activities.activityId' },
          { path: 'author', select: 'name surname' }
        ]
      })
    if (!user) {
      const message = 'Las credenciales son inválidas'
      return res.status(401).json({ success: false, message })
    }
    const match = await compare(req.body.password, user.hash)
    if (!match) {
      const message = 'Las credenciales son inválidas'
      return res.status(401).json({ success: false, message })
    }
    const { hash: _hash, _id, __v, ...userLogin } =
      user.toObject()
    const token = createToken({ id: _id })
    userLogin.token = token
    return res.status(201).json({ success: true, data: userLogin })
  } catch (error) {
    return res.status(500)
      .json({ success: false, message: error.message })
  }
}

const enrollCourse = async (req, res) => {
  let message = 'El id del curso es requerido'
  if (!req.body.courseId) {
    return res.status(400).json({ success: false, message })
  }
  if (!isValidObjectId(req.body.courseId)) {
    message = 'El curso es inválido'
    return res.status(400).json({ success: false, message })
  }
  try {
    // verify the course exists
    const course = await Course.findById(req.body.courseId)
    if (!course) {
      message = 'El curso no existe'
      return res.status(400).json({ success: false, message })
    }
    let response = await User.findOne({ _id: req.body.userId })
    const registered = response.courses
      .some(course => course.courseId.equals(req.body.courseId))
    if (registered) {
      message = 'El curso ya se encuentra inscrito'
      return res.status(400).json({ success: false, message })
    }
    response = await User.findOneAndUpdate(
      { _id: req.body.userId },
      {
        $addToSet: {
          courses: { courseId: req.body.courseId, grade: 0 }
        }
      },
      { new: true }
    )
    res.status(201).json(response)
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

const updateUser = async (req, res) => {
  try {
    const { userId, ...updateData } = req.body

    // Eliminar el campo 'role' de updateData si existe
    delete updateData.role

    const updatedUsers = await User.findByIdAndUpdate(userId, updateData, { new: true })

    if (!updatedUsers) {
      return res.status(404).json({ message: 'Usuario no encontrado' })
    }

    res.status(200).json({ success: true, data: updatedUsers })
  } catch (error) {
    console.error('Error al actualizar el usuario:', error)
    res.status(500).json({ success: false, message: 'Error interno del servidor' })
  }
}

const deleteUser = async (req, res) => {
  try {
    // Extraer el ID del usuario autenticado desde req.body.userId
    const userId = req.body.userId

    // Eliminar el usuario por su ID
    const deletedUser = await User.findByIdAndDelete(userId)

    // Verificar si el usuario fue encontrado y eliminado
    if (!deletedUser) {
      return res.status(404).json({ message: 'Usuario no encontrado' })
    }

    // Enviar una respuesta de éxito con el usuario eliminado
    res.status(200).json({ success: true, data: deletedUser })
  } catch (error) {
    // Manejo de errores
    console.error('Error al eliminar el usuario:', error)
    res.status(500).json({ success: false, message: 'Error interno del servidor' })
  }
}
const getUserVideos = async (req, res) => {
  try {
    const { userId } = req.body
    if (!userId) {
      return res.status(400).json({ success: false, message: 'Se requiere el Id del usuario' })
    }
    const userAttempts = await Attempt.find({ userId })
    const videos = []
    userAttempts.forEach(attempt => {
      attempt.answers.forEach(answer => {
        if (typeof answer.data === 'string' && answer.data.endsWith('.mp4')) {
          videos.push({ video: answer.data, activityId: attempt.activityId })
        }
      })
    })
    res.status(200).json({ success: true, videos })
  } catch (error) {
    console.error('Error al obtener los videos del usuario:', error)
    res.status(500).json({ success: false, message: 'Error interno del servidor' })
  }
}

const getVideo = async (req, res) => {
  try {
    const { video } = req.query
    if (!video) {
      return res.status(400).json({ success: false, message: 'Se requiere el nombre del archivo' })
    }
    const filePath = path.resolve('videos', video)
    if (!filePath) {
      return res.status(400).json({ success: false, message: 'Ruta de archivo incorrecta' })
    }
    res.sendFile(filePath, (err) => {
      if (err) {
        return res.status(500).json({ success: false, message: 'Error al enviar el video' })
      }
    })
  } catch (err) {
    return res.status(500).json({ success: false, message: `Error al procesar la solicitud: ${err.message}` })
  }
}

export default {
  getUsers,
  createUser,
  login,
  enrollCourse,
  getUserVideos,
  getVideo,
  updateUser,
  deleteUser
}
