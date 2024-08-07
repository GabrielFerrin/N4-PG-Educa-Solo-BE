import { Schema, Types, model } from 'mongoose'

const courseSchema = new Schema({
  courseId: { type: Types.ObjectId, ref: 'Course', required: true },
  grade: { type: Number }
}, { _id: false, timestamps: true })

const userSchema = new Schema({
  username: { type: String, required: true },
  hash: { type: String, required: true },
  name: { type: String },
  surname: { type: String },
  email: { type: String },
  role: { type: String, default: 'estudiante' },
  picture: { type: String },
  courses: [courseSchema]
}, { timestamps: true })

export default model('User', userSchema)
