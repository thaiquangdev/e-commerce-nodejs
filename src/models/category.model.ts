import mongoose, { Document, model, Schema } from 'mongoose'

export interface ICategory extends Document {
  title: string
  slug: string
  isActive: boolean
}

const CategorySchema = new Schema(
  {
    title: {
      type: String
    },
    slug: { type: String },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
)

const CategoryModel = mongoose.model<ICategory>('Category', CategorySchema)
export default CategoryModel
