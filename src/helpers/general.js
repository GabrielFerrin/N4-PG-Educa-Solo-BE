import jwt from 'jsonwebtoken'
import { SECRET_KEY } from '../config/config.js'
import User from '../models/User.js'

export const createToken = (payload) => {
  return jwt.sign(payload, SECRET_KEY, { expiresIn: '1h' })
}

export const validateToken = (token) => {
  return jwt.verify(token, SECRET_KEY)
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
