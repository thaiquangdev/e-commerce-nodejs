import UserModel from '../models/user.model'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

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

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: 'production', // Set to true if using HTTPS
      maxAge: 24 * 60 * 60 * 1000 // 1 day
    })
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: 'production', // Set to true if using HTTPS
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    })
    return emailExist
  }

  async logout(req: any) {}

  async checkEmailExist(email: string) {
    return await UserModel.findOne({ email })
  }

  async generateAccessToken(id: string) {
    return await jwt.sign({ id }, process.env.JWT_SECRET as string, { expiresIn: '1d' })
  }

  async generateRefreshToken(id: string) {
    return await jwt.sign({ id }, process.env.JWT_SECRET as string, { expiresIn: '7d' })
  }
}

const userService = new UserService()
export default userService
