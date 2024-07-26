import { Schema, Types, model } from 'mongoose'

const userSchema = new Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  surname: { type: String, required: true },
  email: { type: String, required: true },
  role: { type: String, required: true },
  enroledCourses: [{ type: Types.ObjectId, ref: 'Course' }]
})

export default model('User', userSchema)
