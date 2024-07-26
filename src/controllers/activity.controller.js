import Activity from '../models/Activity.js'
import Course from '../models/Course.js'

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

export default { createActivity }
