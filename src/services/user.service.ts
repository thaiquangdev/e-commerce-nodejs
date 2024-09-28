import UserModel from '../models/user.model'
import bcrypt from 'bcrypt'
import jwt, { Jwt } from 'jsonwebtoken'

class UserService {
  async register(payload: { email: string; password: string; fullName: string }) {
    const { email, password, fullName } = payload
    const emailExist = await this.checkEmailExist(email)
    if (emailExist) {
      throw new Error('Email này đã tồn tại')
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
      throw new Error('Email này chưa được đăng ký hoặc không tìm thấy email')
    }
    const comparePassword = await bcrypt.compare(password, emailExist.password)
    if (!comparePassword) {
      throw new Error('Email hoặc mật khẩu không đúng')
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
      return { message: 'Đăng xuất thành công' }
    }
  }

  async editProfile(payload: { fullName?: string; email?: string }, req: any) {
    const { fullName, email } = payload
    const { id } = req.user
    const user = await UserModel.findById(id)
    if (!user) {
      return {
        message: 'Không có người dùng',
        success: false
      }
    }
    if (fullName) {
      user.fullName = fullName
    }
    if (email) {
      user.email = email
    }
    await user.save()
    return {
      message: 'Thay đổi thông tin thành công',
      success: true,
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
      return {
        message: 'Không có người dùng',
        success: false
      }
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
    return {
      status: 'success',
      message: 'Thay đổi mật khẩu thành công'
    }
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
