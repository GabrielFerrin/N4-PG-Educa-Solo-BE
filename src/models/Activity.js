import { Schema, model } from 'mongoose'

const itemSchema = new Schema({
  _id: { type: Schema.Types.ObjectId, auto: true },
  type: { type: String, required: true },
  data: { type: Schema.Types.Mixed, required: true }
}, { timestamps: true })

const activitySchema = new Schema({
  name: { type: String, required: true },
  starts: { type: Date },
  ends: { type: Date },
  timeAllowed: { type: Number },
  minGrade: { type: Number, default: 7 },
  maxGrade: { type: Number, default: 10 },
  attempts: { type: Number, default: 1 },
  course: { type: Schema.Types.ObjectId, ref: 'Course' },
  items: [itemSchema]
}, { timestamps: true })

export default model('Activity', activitySchema)
