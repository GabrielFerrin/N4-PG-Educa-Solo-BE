import { Schema, Types, model } from 'mongoose'

const userSchema = new Schema({
  username: { type: String, required: true },
  hash: { type: String, required: true },
  name: { type: String },
  surname: { type: String },
  email: { type: String },
  role: { type: String, required: true },
  courses: [{ type: Types.ObjectId, ref: 'Course' }]
}, { timestamps: true })

export default model('User', userSchema)
