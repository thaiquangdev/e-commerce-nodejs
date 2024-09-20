import dotenv from 'dotenv'
import multer, { Multer } from 'multer'
import { v2 as cloudinary, UploadApiResponse, UploadApiErrorResponse } from 'cloudinary'
import sharp from 'sharp'
import { Request, Response, NextFunction } from 'express'

dotenv.config()

export default cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET
})

interface CloudinaryFile extends Express.Multer.File {
  buffer: Buffer
}

const storage = multer.memoryStorage()
export const upload: Multer = multer({ storage })

interface Files {
  [fieldname: string]: CloudinaryFile[]
}

export const uploadToCloudinary = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Kiểm tra req.files có tồn tại và đúng kiểu không
    const files = req.files as Files

    const thumbFiles = files['thumb']
    const imageFiles = files['images']

    if (!thumbFiles && !imageFiles) {
      return next(new Error('No files provided'))
    }

    const cloudinaryUrls: { url: string; public_id: string }[] = []

    // Hàm tải lên tệp lên Cloudinary
    const uploadFile = async (file: CloudinaryFile) => {
      const resizedBuffer: Buffer = await sharp(file.buffer).resize({ width: 800, height: 600 }).toBuffer()

      return new Promise<{ url: string; public_id: string }>((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            resource_type: 'auto',
            folder: 'ecomerce'
          },
          (err: UploadApiErrorResponse | undefined, result: UploadApiResponse | undefined) => {
            if (err) {
              console.error('Cloudinary upload error:', err)
              reject(err)
            } else if (!result) {
              console.error('Cloudinary upload error: Result is undefined')
              reject(new Error('Cloudinary upload result is undefined'))
            } else {
              resolve({ url: result.secure_url, public_id: result.public_id })
            }
          }
        )
        uploadStream.end(resizedBuffer)
      })
    }

    // Tải lên các tệp từ trường 'thumb'
    if (thumbFiles && thumbFiles.length > 0) {
      const thumbFile = thumbFiles[0]
      const thumbUrl = await uploadFile(thumbFile)
      cloudinaryUrls.push(thumbUrl)
    }

    // Tải lên các tệp từ trường 'images'
    if (imageFiles && imageFiles.length > 0) {
      const imagePromises = imageFiles.map((file) => uploadFile(file))
      const imageUrls = await Promise.all(imagePromises)
      cloudinaryUrls.push(...imageUrls)
    }

    // Gán URL và public_id vào req.body để sử dụng ở middleware tiếp theo
    req.body.cloudinaryUrls = cloudinaryUrls
    next()
  } catch (error) {
    console.error('Error in uploadToCloudinary middleware:', error)
    next(error)
  }
}
