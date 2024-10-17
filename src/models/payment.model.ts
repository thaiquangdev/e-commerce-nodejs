import mongoose, { Document, Schema } from 'mongoose'
import { PaymentMethod } from '../utils/payment-enum'

interface IPayment extends Document {
  user: mongoose.Schema.Types.ObjectId
  order: mongoose.Schema.Types.ObjectId
  paymentMethod: PaymentMethod
  amount: number
  paymentDate: Date
  address: mongoose.Schema.Types.ObjectId
}

const paymentSchema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Cart'
    },
    amount: {
      type: Number
    },
    paymentDate: {
      type: Date
    },
    paymentMethod: {
      type: String,
      enum: Object.values(PaymentMethod),
      default: PaymentMethod.PAYPAL
    },
    address: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Address'
    }
  },
  { timestamps: true }
)

const PaymentModel = mongoose.model<IPayment>('Payment', paymentSchema)
export default PaymentModel
