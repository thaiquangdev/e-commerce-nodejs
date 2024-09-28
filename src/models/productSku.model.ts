import mongoose, { Document, Schema } from 'mongoose'

// Định nghĩa interface cho SKU
interface Sku extends Document {
  sku: string
  stock: number
  price: number
  sold: number
  storage: string
  color: string
  product: mongoose.Schema.Types.ObjectId // Liên kết tới ProductSpu
}

// Định nghĩa schema cho SKU
const productSkuSchema = new Schema<Sku>(
  {
    sku: {
      type: String,
      required: true
    },
    stock: {
      type: Number,
      min: 0
    },
    price: {
      type: Number,
      min: 0
    },
    sold: {
      type: Number,
      default: 0
    },
    storage: {
      type: String
    },
    color: {
      type: String
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ProductSpu'
    }
  },
  {
    timestamps: true
  }
)

// Tạo model cho SKU
const ProductSkuModel = mongoose.model<Sku>('Sku', productSkuSchema)
export default ProductSkuModel
