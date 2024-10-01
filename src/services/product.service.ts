import slugify from 'slugify'
import ProductSpuModel from '../models/productSpu.model'
import ProductSkuModel from '../models/productSku.model'
import mongoose from 'mongoose'
import cloudinaryConfig from '../configs/cloudinary.config'
import { AppError } from '../utils/app-error'

class ProductService {
  async createProduct(
    payload: {
      title: string
      price: number
      discount: number
      description: string
      category: string
      brand: string
      skus: Array<{ sku: string; price: number; stock: number; storage: string; color: string }>
    },
    req: any
  ) {
    const { title, price, discount, description, category, brand, skus } = payload
    const slug = slugify(title)

    // Kiểm tra nếu sản phẩm đã tồn tại
    if (await this.findOneSpu(slug)) {
      throw new AppError('Product is exist', 400)
    }

    // Xác định thumb và images
    const thumb = req.body.cloudinaryUrls.length > 0 ? req.body.cloudinaryUrls[0] : null
    const images = req.body.cloudinaryUrls.slice(1) || []

    // Tạo đối tượng sản phẩm mới (SPU)
    const productSpu = new ProductSpuModel({
      title,
      price,
      discount,
      description,
      category,
      brand,
      slug,
      thumb: thumb
        ? {
            url: thumb.url,
            public_id: thumb.public_id
          }
        : null,
      images: images.map((file: { url: string; public_id: string }) => ({
        url: file.url,
        public_id: file.public_id
      }))
    })

    // Lưu SPU vào database
    await productSpu.save()

    // Tạo các SKU liên quan nếu có
    if (skus && skus.length > 0) {
      for (const sku of skus) {
        const newSku = new ProductSkuModel({
          sku: sku.sku,
          price: sku.price,
          stock: sku.stock,
          storage: sku.storage,
          color: sku.color,
          productSpu: productSpu._id
        })
        await newSku.save()
        productSpu.skus.push(newSku._id as mongoose.Schema.Types.ObjectId)
      }
      await productSpu.save() // Cập nhật lại SPU với danh sách SKU
    }

    return productSpu
  }

  async getAllProducts(req: any) {
    // Lấy các query từ req
    const queries = { ...req.query }

    // Tách các trường đặc biệt ra khỏi query
    const excludedFields = ['page', 'limit', 'sort', 'fields']
    excludedFields.forEach((el) => delete queries[el])

    // Format lại các toán tử so sánh của MongoDB
    let queryStr = JSON.stringify(queries)
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`)
    const formatedQueries = JSON.parse(queryStr)

    // Filtering theo title (nếu có)
    if (queries?.title) {
      formatedQueries.title = { $regex: queries.title, $options: 'i' }
    }

    // Filtering theo nhiều category (nếu có)
    if (queries?.category) {
      const categories = queries.category.split(',') // Tách các category bằng dấu phẩy
      formatedQueries.category = { $in: categories } // Sử dụng toán tử $in để lọc theo nhiều category
    }

    // Filtering theo brand (nếu có)
    if (queries?.brand) {
      formatedQueries.brand = queries.brand
    }

    // Khởi tạo query từ Mongoose
    let query = ProductSpuModel.find(formatedQueries).populate('skus')

    // Sorting: nếu có `sort` thì áp dụng, nếu không thì mặc định sort theo ngày tạo
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ')
      query = query.sort(sortBy)
    } else {
      query = query.sort('-createdAt')
    }

    // Pagination: Lấy giá trị page và limit từ req.query
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 12
    const skip = (page - 1) * limit
    query = query.skip(skip).limit(limit)

    // Tính tổng số sản phẩm (totalProducts)
    const totalProducts = await ProductSpuModel.countDocuments(formatedQueries)

    // Tính tổng số trang (totalPage)
    const totalPage = Math.ceil(totalProducts / limit)

    // Thực thi query và lấy danh sách sản phẩm
    const products = await query

    // Trả về kết quả với các thông tin page, limit, products, totalProducts, totalPage
    return {
      page,
      limit,
      products,
      totalProducts,
      totalPage
    }
  }

  async getProduct(req: any) {
    const { slug } = req.params
    return await ProductSpuModel.findOne({ slug })
  }

  async deleteProduct(req: any) {
    const { slug } = req.params
    const productSpu = await this.findOneSpu(slug)

    if (productSpu) {
      // Xóa tất cả các ảnh trong productSpu.images nếu có
      if (productSpu.images && productSpu.images.length > 0) {
        const deleteImages = productSpu.images.map((image: any) => {
          const publicId = image.public_id
          return cloudinaryConfig.uploader
            .destroy(publicId)
            .then((result: any) => console.log(`Deleted image with public_id: ${publicId}`, result))
            .catch((error: any) => console.error(`Failed to delete image with public_id: ${publicId}`, error))
        })
        await Promise.all(deleteImages) // Chờ tất cả các ảnh được xóa
      }

      // Xóa thumbnail nếu có
      if (productSpu.thumb) {
        await cloudinaryConfig.uploader
          .destroy(productSpu.thumb.public_id)
          .then((result: any) => console.log(`Deleted thumb with public_id: ${productSpu.thumb.public_id}`, result))
          .catch((error: any) =>
            console.error(`Failed to delete thumb with public_id: ${productSpu.thumb.public_id}`, error)
          )
      }

      // Xóa các SKU liên quan
      const productSku = await ProductSkuModel.find({ spu: productSpu._id })
      if (productSku.length > 0) {
        await ProductSkuModel.deleteMany({ spu: productSpu._id })
      }

      // Xóa sản phẩm SPU
      await ProductSpuModel.findByIdAndDelete(productSpu._id)
    } else {
      throw new AppError('Product is not found', 404)
    }
  }

  async updateProductSpu(req: any) {
    const { slug } = req.params
    const { title, price, discount, description, category, brand, cloudinaryUrls, skus } = req.body
    const productSpu = await this.findOneSpu(slug)
    if (!productSpu) {
      throw new AppError('Product is not found', 404)
    }

    // Cập nhật thông tin SPU
    productSpu.title = title
    productSpu.price = price
    productSpu.discount = discount
    productSpu.description = description
    productSpu.category = category
    productSpu.brand = brand

    if (cloudinaryUrls && cloudinaryUrls.length > 0) {
      // Xóa ảnh cũ trên Cloudinary
      if (productSpu.images && productSpu.images.length > 0) {
        for (const image of productSpu.images) {
          await cloudinaryConfig.uploader.destroy(image.public_id)
        }
      }

      // Kiểm tra thumb trước khi xóa
      if (productSpu.thumb && productSpu.thumb.public_id) {
        await cloudinaryConfig.uploader.destroy(productSpu.thumb.public_id)
      }

      // Cập nhật thumb và images mới
      productSpu.thumb = {
        url: cloudinaryUrls[0].url,
        public_id: cloudinaryUrls[0].public_id
      }
      productSpu.images = cloudinaryUrls.slice(1).map((file: { url: string; public_id: string }) => ({
        url: file.url,
        public_id: file.public_id
      }))
    }

    await productSpu.save()

    // Cập nhật SKU
    if (skus && skus.length > 0) {
      for (const skuData of skus) {
        const { sku, stock, price, storage, color } = skuData

        // Tìm SKU
        const productSku = await ProductSkuModel.findOne({ sku })
        if (productSku) {
          // Cập nhật thông tin SKU
          productSku.sku = sku
          productSku.stock = stock
          productSku.price = price
          productSku.storage = storage
          productSku.color = color
          await productSku.save()
        } else {
          throw new AppError(`SKU is not found with: ${sku}`, 404)
        }
      }
    }

    return {
      productSpu
    }
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
