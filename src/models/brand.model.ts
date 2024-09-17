import mongoose, { Document, Schema } from 'mongoose'

interface Thumb {
  url: string
  public_id: string
}

interface IBrand extends Document {
  title: string
  thumb: Thumb
  isActive: boolean
}

const BrandSchema = new Schema(
  {
    title: { type: String },
    thumb: { url: String, public_id: String },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
)

const BrandModel = mongoose.model<IBrand>('Brand', BrandSchema)
export default BrandModel
