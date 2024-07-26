import { Schema, model } from 'mongoose'

const itemSchema = new Schema({
  type: { type: String, required: true },
  data: { type: Schema.Types.Mixed, required: true }
})

const activitySchema = new Schema({
  name: { type: String, required: true },
  starts: { type: Date },
  ends: { type: Date },
  minGrade: { type: Number },
  maxGrade: { type: Number },
  course: { type: Schema.Types.ObjectId, ref: 'Course' },
  items: [itemSchema]
}, { timestamps: true })

export default model('Activity', activitySchema)
