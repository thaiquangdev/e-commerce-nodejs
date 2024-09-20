import mongoose, { Document, Schema } from 'mongoose'

interface Thumb {
  url: string
  public_id: string
}

interface IBrand extends Document {
  title: string
  isActive: boolean
}

const BrandSchema = new Schema(
  {
    title: { type: String },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
)

const BrandModel = mongoose.model<IBrand>('Brand', BrandSchema)
export default BrandModel
