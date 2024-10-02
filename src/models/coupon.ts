import mongoose, { Document, Schema } from 'mongoose'

interface ICoupon extends Document {
  couponCode: string
  couponTitle: string
  couponExpiry: Date
}

const couponSchema = new Schema(
  {
    couponCode: {
      type: String
    },
    couponTitle: {
      type: String
    },
    couponExpiri: {
      type: Date
    }
  },
  { timestamps: true }
)

const CouponModel = mongoose.model<ICoupon>('Coupon', couponSchema)
export default CouponModel
