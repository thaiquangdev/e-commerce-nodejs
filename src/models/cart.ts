import mongoose, { Document, Schema } from 'mongoose'
import { CartStatus } from '../utils/cart-enum'

interface ICart extends Document {
  user: mongoose.Schema.Types.ObjectId
  product: mongoose.Schema.Types.ObjectId
  quantity: number
  storage?: string
  color?: string
  price: number
  totalPrice: number
  status: CartStatus
}

const cartSchema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product'
    },
    quantity: {
      type: Number
    },
    storage: {
      type: String
    },
    color: {
      type: String
    },
    price: {
      type: Number
    },
    totalPrice: {
      type: Number
    },
    status: {
      type: String,
      enum: Object.values(CartStatus),
      default: CartStatus.PENDING
    }
  },
  { timestamps: true }
)

const CartModel = mongoose.model<ICart>('Cart', cartSchema)
export default CartModel
