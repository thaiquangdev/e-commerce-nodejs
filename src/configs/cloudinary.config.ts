import { v2 as cloudinary, UploadApiErrorResponse, UploadApiResponse } from 'cloudinary'
import { NextFunction, Request, Response } from 'express'
import multer, { Multer } from 'multer'
import sharp from 'sharp'

export default cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

interface CloudinaryFile extends Express.Multer.File {
  buffer: Buffer
}

const storage = multer.memoryStorage()
export const upload: Multer = multer({ storage: storage })

export const uploadToCloudinary = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const files: CloudinaryFile[] = req.files as CloudinaryFile[]
    if (!files || files.length === 0) {
      return next(new Error('No files provided'))
    }
    const cloudinaryUrls: { url: string; public_id: string }[] = []
    for (const file of files) {
      const resizedBuffer: Buffer = await sharp(file.buffer).resize({ width: 800, height: 600 }).toBuffer()

      const uploadStream = cloudinary.uploader.upload_stream(
        {
          resource_type: 'auto',
          folder: 'shop'
        } as any,
        (err: UploadApiErrorResponse | undefined, result: UploadApiResponse | undefined) => {
          if (err) {
            console.error('Cloudinary upload error:', err)
            return next(err)
          }
          if (!result) {
            console.error('Cloudinary upload error: Result is undefined')
            return next(new Error('Cloudinary upload result is undefined'))
          }
          const { secure_url, public_id } = result
          cloudinaryUrls.push({ url: secure_url, public_id })

          if (cloudinaryUrls.length === files.length) {
            //All files processed now get your images here
            req.body.cloudinaryUrls = cloudinaryUrls
            next()
          }
        }
      )
      uploadStream.end(resizedBuffer)
    }
  } catch (error) {
    console.error('Error in uploadToCloudinary middleware:', error)
    next(error)
  }
}
