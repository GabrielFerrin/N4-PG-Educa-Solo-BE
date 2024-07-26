import { isValidObjectId } from 'mongoose'
import { createToken } from '../helpers/general.js'
import User from '../models/User.js'
import { compare, hash } from 'bcrypt'
import Course from '../models/Course.js'

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
    return res.status(400).json(errorList)
  }
  try {
    const hashedPassword = await hash(req.body.password, 11)
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
  if (!user.password) errorList.push('La contraseña es requerida')
  if (!user.role) errorList.push('El rol es requerido')
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
    if (!user) {
      const message = 'El usuario no existe'
      return res.status(401).json({ success: false, message })
    }
    const match = await compare(req.body.password, user.hash)
    if (!match) {
      const message = 'Las credenciales son inválidas'
      return res.status(401).json({ success: false, message })
    }
    const { hash: _hash, _id, __v, courses, ...userLogin } =
      user.toObject()
    const token = createToken({ id: _id })
    userLogin.token = token
    res.status(201).json({ success: true, data: userLogin })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
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
    if (response.courses.some(course => course.courseId.equals(req.body.courseId))) {
      message = 'El curso ya se encuentra inscrito'
      return res.status(400).json({ success: false, message })
    }
    response = await User.findOneAndUpdate(
      { _id: req.body.userId },
      {
        $addToSet:
          { courses: { courseId: req.body.courseId, grade: 0 } }
      },
      { new: true }
    )
    res.status(201).json(response)
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

export default { getUsers, createUser, login, enrollCourse }
