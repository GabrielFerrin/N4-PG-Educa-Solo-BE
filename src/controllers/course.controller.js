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

const updateCourse = async (req, res) => {
  try {
    const { id, author, ...updateData } = req.body
    console.log(updateData)
    const updatedCourse = await Course.findByIdAndUpdate(id, updateData, { new: true })

    if (!updatedCourse) {
      return res.status(404).json({ message: 'Curso no encontrado' })
    }

    res.status(200).json({ success: true, data: updatedCourse })
  } catch (error) {
    console.error('Error al actualizar el curso:', error)
    res.status(500).json({ success: false, message: 'Error interno del servidor' })
  }
}

const deleteCourse = async (req, res) => {
  try {
    const { id } = req.body
    if (!id) {
      return res.status(400).json({ success: false, message: 'Se requeire el Id del curso' })
    }
    // recorrer users, verificar si alguien está inscrito en el curso
    const deletedCourse = await Course.findByIdAndDelete(id)
    if (!deletedCourse) {
      return res.status(404).json({ success: false, message: 'Curso no encontrado' })
    }

    res.status(200).json({ success: true, message: 'Curso eliminado correctamente' })
  } catch (error) {
    console.error('Error al eliminarl el curso:', error)
    res.status(500).json({ success: false, message: 'Error interno del servidor' })
  }
}

export default { createCourse, updateCourse, deleteCourse }
