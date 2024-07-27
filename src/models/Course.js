import { Schema, model } from 'mongoose'

const activitySchema = new Schema({
  activityId: { type: Schema.Types.ObjectId, ref: 'Activity', required: true },
  grade: { type: Number }
}, { timestamps: true })

const courseSchema = new Schema({
  name: { type: String, required: true },
  code: { type: String, required: true },
  description: { type: String },
  area: { type: String },
  starts: { type: Date },
  ends: { type: Date },
  activities: [activitySchema]
}, { timestamps: true })

export default model('Course', courseSchema)
