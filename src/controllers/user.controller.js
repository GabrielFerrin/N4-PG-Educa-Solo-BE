import User from '../models/User.js'
import { hash } from 'bcrypt'

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
    res.status(201).json(user)
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// helper
const validateUser = async (user, errorList) => {
  if (!user.username) errorList.push('Username is required')
  if (!user.password) errorList.push('Password is required')
  if (!user.role) errorList.push('Role is required')
  if (user.role) {
    (user.role !== 'estudiante' && user.role !== 'maestro') &&
      errorList.push('Rol inválido')
  }
  if (user.username) {
    const userExists = await User.findOne({ username: user.username })
    if (userExists) {
      const message = 'User already exists'
      errorList.push(message)
    }
  }
  if (user.email) {
    const emailExists = await User.findOne({ email: user.email })
    if (emailExists) {
      const message = 'Email already exists'
      errorList.push(message)
    }
  }
}

export default { getUsers, createUser }
