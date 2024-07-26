import { Schema, model } from 'mongoose'

const actividadSchema = new Schema({
  name: { type: String, required: true },
  active: { type: Date },
  due: { type: Date },
  minGrade: { type: Number },
  maxGrade: { type: Number },
  course: { type: Schema.Types.ObjectId, ref: 'Course' }
}, { timestamps: true })

export default model('Activity', actividadSchema)
