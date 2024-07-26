import jwt from 'jsonwebtoken'
import { SECRET_KEY } from '../config/config.js'

export const createToken = (payload) => {
  return jwt.sign(payload, SECRET_KEY, { expiresIn: '1h' })
}

export const validateToken = (token) => {
  return jwt.verify(token, SECRET_KEY)
}
