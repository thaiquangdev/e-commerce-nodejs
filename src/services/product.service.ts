import slugify from 'slugify'
import ProductSpuModel from '../models/productSpu.model'
import ProductSkuModel from '../models/productSku.model'
import mongoose from 'mongoose'

class ProductService {
  async createProductSpu(
    payload: {
      title: string
      price: number
      discount: number
      description: string
      stock: number
      category: string
      brand: string
    },
    req: any
  ) {
    const { title, price, discount, description, stock, category, brand } = payload
    const slug = slugify(title)

    // Kiểm tra nếu sản phẩm đã tồn tại
    if (await this.findOneSpu(slug)) {
      throw new Error('Sản phẩm này đã tồn tại')
    }

    // Xác định thumb và images
    const thumb = req.body.cloudinaryUrls.length > 0 ? req.body.cloudinaryUrls[0] : null
    const images = req.body.cloudinaryUrls.slice(1) || []

    // Tạo đối tượng sản phẩm mới
    const productSpu = new ProductSpuModel({
      title,
      price,
      discount,
      description,
      stock,
      category,
      brand,
      slug,
      thumb: thumb
        ? {
            url: thumb.url,
            public_id: thumb.public_id
          }
        : null, // Đảm bảo không gán thumb nếu không có
      images: images.map((file: { url: string; public_id: string }) => ({
        url: file.url,
        public_id: file.public_id
      }))
    })

    // Lưu sản phẩm vào cơ sở dữ liệu
    await productSpu.save()
    return productSpu
  }

  async createProductSku(payload: {
    sku: string
    stock: number
    price: number
    storage?: string
    color?: string
    slug: string
  }) {
    const { sku, stock, price, storage, color, slug } = payload

    // Kiểm tra nếu SKU đã tồn tại
    if (await this.findOneSku(sku)) {
      throw new Error('Sản phẩm này đã tồn tại')
    }

    // Tìm ProductSpu dựa vào slug
    const productSpu = await ProductSpuModel.findOne({ slug })
    if (!productSpu) {
      throw new Error('Không tìm thấy sản phẩm tương ứng với slug')
    }

    // Tạo SKU mới
    const newSku = new ProductSkuModel({
      sku,
      price,
      stock,
      storage,
      color,
      productSpu: productSpu._id as mongoose.Schema.Types.ObjectId // Liên kết SKU với SPU
    })

    await newSku.save()

    productSpu.skus.push(newSku._id as mongoose.Schema.Types.ObjectId)
    await productSpu.save()

    return newSku
  }

  async getAllProducts(req: any) {}

  async getProducts(id: string) {
    return ProductSkuModel.findById(id)
  }

  async findOneSku(sku: string) {
    return ProductSkuModel.findOne({ sku })
  }

  async findOneSpu(slug: string) {
    return ProductSpuModel.findOne({ slug })
  }
}

const productService = new ProductService()
export default productService
