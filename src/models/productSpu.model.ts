import mongoose, { Document, Schema } from 'mongoose'
import slugify from 'slugify'

interface ProductSpu extends Document {
  title: string
  slug: string
  price: number
  discount: number
  description: string
  category: string
  brand: string
  reviews: number
  viewProduct: number
  totalReviews: number
  skus?: mongoose.Schema.Types.ObjectId[]
  thumb: {
    url: string
    public_id: string
  }
  images: {
    url: string
    public_id: string
  }[]
}

// Định nghĩa schema cho ProductSpu
const productSpuSchema = new Schema<ProductSpu>(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    slug: {
      type: String,
      unique: true
    },
    price: {
      type: Number,
      required: true
    },
    discount: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    },
    description: {
      type: String,
      required: true
    },
    thumb: {
      url: { type: String, required: true },
      public_id: { type: String, required: true }
    },
    images: [
      {
        url: { type: String, required: true },
        public_id: { type: String, required: true }
      }
    ],
    category: {
      type: String,
      required: true
    },
    brand: {
      type: String,
      required: true
    },
    reviews: {
      type: Number,
      default: 0
    },
    totalReviews: {
      type: Number,
      default: 0
    },
    viewProduct: {
      type: Number,
      default: 0
    },
    skus: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Sku',
        required: false,
        default: []
      }
    ]
  },
  { timestamps: true }
)

// Tự động tạo slug từ title trước khi lưu
// productSpuSchema.pre('save', function (next) {
//   const product = this as ProductSpu;
//   if (!product.slug) {
//     product.slug = slugify(product.title, { lower: true, strict: true });
//   }
//   next();
// });

// Thêm phương thức tính giá sau khi giảm giá
// productSpuSchema.methods.finalPrice = function (): number {
//   return this.price * (1 - this.discount / 100);
// };

const ProductSpuModel = mongoose.model<ProductSpu>('ProductSpu', productSpuSchema)
export default ProductSpuModel
