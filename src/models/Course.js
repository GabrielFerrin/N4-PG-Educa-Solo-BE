import { Schema, model } from 'mongoose'

const activitySchema = new Schema({
  activityId: { type: Schema.Types.ObjectId, ref: 'Activity', required: true },
  grade: { type: Number },
  enrolled: { type: Boolean, default: true }
}, { _id: false })

const courseSchema = new Schema({
  name: { type: String, required: true },
  code: { type: String, required: true },
  author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  description: { type: String },
  area: { type: String },
  starts: { type: Date },
  ends: { type: Date },
  active: { type: Boolean, default: true },
  activities: [activitySchema]
}, { timestamps: true })

export default model('Course', courseSchema)
