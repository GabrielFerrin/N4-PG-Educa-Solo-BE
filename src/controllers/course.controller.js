import Course from '../models/Course.js'

const createCourse = async (req, res) => {
  const errorList = []
  await validateCourse(req.body, errorList)
  if (errorList.length > 0) {
    return res.status(400).json({ success: false, message: errorList })
  }
  try {
    const response = await Course.create({
      name: req.body.name,
      code: req.body.code,
      author: req.body.author,
      description: req.body.description,
      area: req.body.area,
      starts: req.body.starts,
      ends: req.body.ends
    })
    return res.status(201).json({ success: true, data: response })
  } catch (error) {
    return res.status(500)
      .json({ success: false, message: error.message })
  }
}

const validateCourse = async (couse, errorList) => {
  if (!couse.name) errorList.push('El nombre es requerido')
  if (!couse.code) errorList.push('El código es requerido')
  if (!couse.author) errorList.push('El autor es requerido')
}

export default { createCourse }
