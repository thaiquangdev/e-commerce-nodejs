import mongoose, { Document, Schema } from 'mongoose'

interface IWishlist extends Document {
  user: mongoose.Schema.Types.ObjectId
  product: mongoose.Schema.Types.ObjectId
}

const wishlistSchema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product'
    }
  },
  { timestamps: true }
)

const WishlistModel = mongoose.model<IWishlist>('Wishlist', wishlistSchema)
export default WishlistModel
