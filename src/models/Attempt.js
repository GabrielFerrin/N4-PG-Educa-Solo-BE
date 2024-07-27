import { Schema, model } from 'mongoose'

const answerSchema = new Schema({
  itemId: { type: Schema.Types.ObjectId, ref: 'Item', required: true },
  data: { type: Schema.Types.Mixed }
}, { timestamps: true }, { _id: false })

const attemptSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId, ref: 'User', required: true
  },
  activityId: {
    type: Schema.Types.ObjectId, ref: 'Activity', required: true
  },
  grade: { type: Number },
  answers: [answerSchema]
}, { timestamps: true })

export default model('Attempt', attemptSchema)
