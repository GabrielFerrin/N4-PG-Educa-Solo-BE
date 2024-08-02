import jwt from 'jsonwebtoken'
import { SECRET_KEY } from '../config/config.js'
import User from '../models/User.js'
import { createToken } from '../helpers/general.js'

export const authVideo = async (req, res, next) => {
  const authorization = req.query.token
  console.log(authorization)
  if (!authorization) {
    const message = 'No autorizado'
    return res.status(401).json({ success: false, message })
  }
  try {
    const decoded = await jwt.verify(authorization, SECRET_KEY)
    const user = await User.findById(decoded.id)
      .populate({
        path: 'courses.courseId',
        populate: [
          { path: 'activities.activityId' },
          { path: 'author', select: 'name surname' }
        ]
      })
    if (!user) {
      const message = 'No autorizado'
      return res.status(401).json({ success: false, message })
    }
    const token = createToken({ id: user._id })
    req.body.userId = decoded.id
    const { __v, _id, hash, ...userData } = user.toObject()
    userData.token = token
    if (req.query.verifyToken) {
      userData.userId = decoded.id
      return res.status(201).json({ success: true, data: userData })
    }
    next()
  } catch (error) {
    return res.status(500)
      .json({ success: false, message: error.message })
  }
}
