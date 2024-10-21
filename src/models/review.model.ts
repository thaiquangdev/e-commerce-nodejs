import mongoose, { Document, Schema } from 'mongoose'

interface IReview extends Document {
  user: mongoose.Schema.Types.ObjectId
  product: mongoose.Schema.Types.ObjectId
  star: number
  comment: string
}

const reviewSchema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      index: true
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ProductSpu',
      index: true
    },
    star: {
      type: Number,
      min: 1,
      max: 5
    },
    comment: {
      type: String
    },
    isBanned: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
)

const ReviewModel = mongoose.model<IReview>('Review', reviewSchema)

export default ReviewModel
