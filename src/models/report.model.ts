import mongoose, { Document, Schema } from 'mongoose'

interface IReport extends Document {
  review: mongoose.Schema.Types.ObjectId
  user: mongoose.Schema.Types.ObjectId
  content: string
  isResolved: boolean
}

const reportSchema = new Schema(
  {
    review: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Review',
      required: true
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    content: {
      type: String,
      required: true
    },
    isResolved: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
)

const ReportModel = mongoose.model<IReport>('Report', reportSchema)

export default ReportModel
