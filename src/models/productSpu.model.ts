import mongoose, { Document, Schema } from 'mongoose'

interface ProductSpu extends Document {
  title: string
  price: number
  discount: number
  description: string
  category: string
  brand: string
  reviews: number
  skus: mongoose.Schema.Types.ObjectId[]
  thumb: {
    url: string
    public_id: string
  }
  images: {
    url: string
    public_id: string
  }[]
}

const productSpuShema = new Schema(
  {
    title: {
      type: String
    },
    slug: {
      type: String
    },
    price: {
      type: Number
    },
    discount: {
      type: Number,
      default: 0
    },
    description: {
      type: String
    },
    thumb: {
      url: { type: String },
      public_id: { type: String }
    },
    images: [
      {
        url: { type: String },
        public_id: { type: String }
      }
    ],
    category: {
      type: String
    },
    brand: {
      type: String
    },
    reviews: {
      type: Number,
      default: 0
    },
    skus: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Sku'
      }
    ]
  },
  { timestamps: true }
)

const ProductSpuModel = mongoose.model<ProductSpu>('ProductSpu', productSpuShema)
export default ProductSpuModel
