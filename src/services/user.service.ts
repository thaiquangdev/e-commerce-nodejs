import UserModel from '../models/user.model'
import bcrypt from 'bcrypt'
import jwt, { Jwt } from 'jsonwebtoken'
import { AppError } from '../utils/app-error'
import crypto from 'crypto'
import transporter from '../configs/mail.config'

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
    const refreshToken = await this.generateRefreshToken(String(emailExist._id))

    emailExist.refreshToken = refreshToken
    await emailExist.save()

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: 'production', // Set to true if using HTTPS
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
      await UserModel.findOneAndDelete({ refreshToken: refreshToken }, { new: true })
    }
  }

  async editProfile(payload: { fullName?: string; email?: string }, req: any) {
    const { fullName, email } = payload
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
    await user.save()
    return {
      user: {
        fullName: user.fullName,
        email: user.email
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

    const resetUrl = `http://localhost:3000/reset-password/${resetToken}`
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
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex')
    const user = await UserModel.findOne({
      resetPasswordToken: hashedToken,
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

  async checkEmailExist(email: string) {
    return await UserModel.findOne({ email })
  }

  generateAccessToken(id: string) {
    return jwt.sign({ id }, process.env.JWT_SECRET as string, { expiresIn: '1d' })
  }

  generateRefreshToken(id: string) {
    return jwt.sign({ id }, process.env.JWT_SECRET as string, { expiresIn: '7d' })
  }
}

const userService = new UserService()
export default userService
