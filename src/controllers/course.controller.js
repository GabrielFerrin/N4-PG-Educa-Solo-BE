import Course from '../models/Course.js'

const createCourse = async (req, res) => {
  const errorList = []
  await validateCourse(req.body, errorList)
  if (errorList.length > 0) {
    return res.status(400).json(errorList)
  }
  try {
    const response = await Course.create({
      name: req.body.name,
      description: req.body.description,
      area: req.body.area,
      code: req.body.code
    })
    res.status(201).json(response)
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

const validateCourse = async (couse, errorList) => {
  if (!couse.name) errorList.push('El nombre es requerido')
  if (!couse.code) errorList.push('El código es requerido')
}

export default { createCourse }
