import { Schema, model } from 'mongoose'

const courseSchema = new Schema({
  name: { type: String, required: true },
  code: { type: String, required: true },
  description: { type: String },
  area: { type: String }
}, { timestamps: true })

export default model('Course', courseSchema)
