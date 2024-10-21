import UserModel from '../models/user.model'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { AppError } from '../utils/app-error'
import crypto from 'crypto'
import transporter from '../configs/mail.config'
import AddressModel from '../models/address.model'

class UserService {
  async register(payload: { email: string; password: string; fullName: string }) {
    const { email, password, fullName } = payload
    const emailExist = await this.checkEmailExist(email)
    if (emailExist) {
      throw new AppError('Email is already exists', 400)
    }
    const hashPassword = await bcrypt.hash(password, 12)
    const newUser = new UserModel({
      email,
      fullName,
      password: hashPassword
    })
    await newUser.save()
    return newUser
  }

  async login(payload: { email: string; password: string }, res: any) {
    const { email, password } = payload
    const emailExist = await this.checkEmailExist(email)
    if (!emailExist) {
      throw new AppError('Email is not found', 404)
    }
    const comparePassword = await bcrypt.compare(password, emailExist.password)
    if (!comparePassword) {
      throw new AppError('Email or Password is not correct', 400)
    }

    const accessToken = await this.generateAccessToken(String(emailExist._id))
    const refreshToken = await this.generateRefreshToken(String(emailExist._id), '7d')

    emailExist.refreshToken = refreshToken
    await emailExist.save()

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: false, // Set to true if using HTTPS
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    })
    return accessToken
  }

  async loginAdmin(payload: { email: string; password: string }, res: any) {
    const { email, password } = payload
    const emailExist = await this.checkEmailExist(email)
    if (!emailExist) {
      throw new AppError('Email is not found', 404)
    }
    if (emailExist.roles !== 'admin') {
      throw new AppError('You are not admin', 400)
    }
    const comparePassword = await bcrypt.compare(password, emailExist.password)
    if (!comparePassword) {
      throw new AppError('Email or Password is not correct', 400)
    }

    const accessToken = await this.generateAccessToken(String(emailExist._id))
    const refreshToken = await this.generateRefreshToken(String(emailExist._id), '7d')

    emailExist.refreshToken = refreshToken
    await emailExist.save()

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: false, // Set to true if using HTTPS
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    })
    return accessToken
  }

  async logout(req: any, res: any) {
    const refreshToken = req.cookies?.refreshToken
    if (refreshToken) {
      res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: true,
        sameSite: 'strict'
      })
      await UserModel.findOneAndUpdate({ refreshToken: '' }, { new: true })
    }
  }

  async resetAccessToken(req: any, res: any) {
    const refreshToken = req.cookies?.refreshToken
    if (!refreshToken) {
      return { error: true, status: 401, message: 'Refresh token not found' }
    }

    // Tìm người dùng có refresh token tương ứng
    const user = await UserModel.findOne({ refreshToken })
    if (!user) {
      return { error: true, status: 401, message: 'Invalid refresh token' }
    }

    try {
      console.log('Refresh token:', refreshToken)

      const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET as string) as jwt.JwtPayload
      console.log('Decoded token:', decoded)

      const expirationDate = decoded.exp ? decoded.exp * 1000 : null
      console.log('Expiration date:', expirationDate)

      if (!expirationDate || new Date().getTime() > expirationDate) {
        console.log('Token has expired')
        return { error: true, status: 401, message: 'Refresh token has expired' }
      }

      const remainingTime = (expirationDate - new Date().getTime()) / 1000
      console.log('Remaining time:', remainingTime)

      const accessToken = this.generateAccessToken(String(user._id))
      const newRefreshToken = this.generateRefreshToken(String(user._id), String(remainingTime))

      console.log('Setting cookie:', newRefreshToken)
      res.cookie('refreshToken', newRefreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: remainingTime * 1000,
        sameSite: 'strict',
        path: '/'
      })

      await UserModel.updateOne({ _id: user._id }, { refreshToken: newRefreshToken }, { new: true })
      console.log('Cookie set and user updated')
      return { accessToken }
    } catch (err) {
      console.error('Error during resetAccessToken:', err)
      return { error: true, status: 500, message: 'Failed to verify token' }
    }
  }

  async editProfile(payload: { fullName?: string; email?: string; phoneNumber?: string }, req: any) {
    const { fullName, email, phoneNumber } = payload
    const { id } = req.user
    const user = await UserModel.findById(id)
    if (!user) {
      throw new AppError('User not found', 404)
    }
    if (fullName) {
      user.fullName = fullName
    }
    if (email) {
      user.email = email
    }

    if (phoneNumber) {
      user.phoneNumber = phoneNumber
    }
    await user.save()
    return {
      user: {
        fullName: user.fullName,
        email: user.email,
        phoneNumber: user.phoneNumber
      }
    }
  }

  async changePassword(payload: { oldPassword: string; newPassword: string }, req: any) {
    const { id } = req.user
    const user = await UserModel.findById(id)
    if (!user) {
      throw new AppError('User not found', 404)
    }

    const comparePassword = await bcrypt.compare(payload.oldPassword, user.password)
    if (!comparePassword) {
      return {
        message: 'Mật khẩu cũ không đúng',
        success: false
      }
    }
    const hashPassword = await bcrypt.hash(payload.newPassword, 12)
    user.password = hashPassword
    await user.save()
  }

  async forgotPassword(payload: { email: string }) {
    const { email } = payload
    const user = await this.checkEmailExist(email)
    if (!user) {
      throw new AppError('User not found', 404)
    }
    const resetToken = crypto.randomBytes(32).toString('hex')
    user.resetPasswordToken = resetToken
    user.resetPasswordExpire = new Date(Date.now() + 900000)
    await user.save()

    const resetUrl = `http://localhost:5173/reset-password/${resetToken}`
    try {
      await transporter.sendMail({
        from: `Ecomerce support <${process.env.EMAIL_USER}>`,
        to: user.email,
        subject: 'Reset your password',
        html: `
          <h2>Reset your password</h2>
          <p>You have requested a password reset for your account</p>
          <p>Please click the link below to reset your password</p>
          <a href="${resetUrl}">Reset your password</a>
          <p>If you did not request a your password, please ignore this email</p>
        `
      })
      return { success: true }
    } catch (error) {
      console.error('Error email: ', error)
      return { success: error }
    }
  }

  async resetPassword(payload: { token: string; newPassword: string }) {
    const { token, newPassword } = payload
    const user = await UserModel.findOne({
      resetPasswordToken: token,
      resetPasswordExpire: { $gt: Date.now() }
    })
    if (!user) {
      throw new AppError('Token is invalid or has expired', 400)
    }
    const hashedPassword = await bcrypt.hash(newPassword, 12)
    user.password = hashedPassword
    user.resetPasswordToken = undefined
    user.resetPasswordExpire = undefined
    await user.save()
    return { success: true }
  }

  async addNewAddress(
    payload: {
      phoneNumber: string
      country: string
      streetAddress: string
      city: string
      stateCountry: string
      zipCode: string
    },
    req: any
  ) {
    const { phoneNumber, city, country, stateCountry, streetAddress, zipCode } = payload
    const { id } = req.user
    const user = await UserModel.findById(id)
    if (!user) {
      throw new AppError('Token is invalid or has expired', 400)
    }
    const newAddress = new AddressModel({
      user: id,
      phoneNumber,
      city,
      country,
      streetAddress,
      stateCountry,
      zipCode
    })
    await newAddress.save()
    return newAddress
  }

  async checkEmailExist(email: string) {
    return await UserModel.findOne({ email })
  }

  generateAccessToken(id: string) {
    return jwt.sign({ id }, process.env.JWT_SECRET as string, { expiresIn: '1d' })
  }

  generateRefreshToken(id: string, expiresIn: string) {
    return jwt.sign({ id }, process.env.JWT_SECRET as string, { expiresIn })
  }
}

const userService = new UserService()
export default userService
