import mongoose, { Document, Schema } from 'mongoose'

interface IBlog extends Document {
  user: mongoose.Schema.Types.ObjectId
  title: string
  slug: string
  content: string
  thumb: string
}

const blogSchema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    title: {
      type: String
    },
    slug: {
      type: String
    },
    content: {
      type: String
    },
    thumb: {
      type: String
    }
  },
  { timestamps: true }
)

const BlogModel = mongoose.model<IBlog>('Blog', blogSchema)
export default BlogModel
