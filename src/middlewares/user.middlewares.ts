import { NextFunction, Request, Response } from 'express'
import { checkSchema } from 'express-validator'

export const loginValidator = (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body
  if (!email || !password) {
    return res.status(400).json({
      error: 'Chưa nhập Email và mật khẩu'
    })
  }
  next()
}

export const registerValidator = checkSchema({
  fullName: {
    notEmpty: {
      errorMessage: 'Họ tên không được để trống'
    },
    isString: {
      errorMessage: 'Họ tên phải là một chuỗi'
    },
    isLength: {
      options: { min: 1, max: 100 },
      errorMessage: 'Họ tên phải có độ dài từ 1 đến 100 ký tự'
    },
    trim: true
  },
  email: {
    notEmpty: {
      errorMessage: 'Email không được để trống'
    },
    isEmail: {
      errorMessage: 'Email không hợp lệ'
    },
    trim: true
  },
  password: {
    notEmpty: {
      errorMessage: 'Mật khẩu không được để trống'
    },
    isString: {
      errorMessage: 'Mật khẩu phải là một chuỗi'
    },
    isLength: {
      options: { min: 6, max: 50 },
      errorMessage: 'Mật khẩu phải có độ dài từ 6 đến 50 ký tự'
    },
    isStrongPassword: {
      options: {
        minLength: 6,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1
      },
      errorMessage: 'Mật khẩu không đủ mạnh'
    }
  },
  confirmPassword: {
    notEmpty: {
      errorMessage: 'Xác nhận mật khẩu không được để trống'
    },
    isString: {
      errorMessage: 'Xác nhận mật khẩu phải là một chuỗi'
    },
    isLength: {
      options: { min: 6, max: 50 },
      errorMessage: 'Xác nhận mật khẩu phải có độ dài từ 6 đến 50 ký tự'
    },
    isStrongPassword: {
      options: {
        minLength: 6,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1
      },
      errorMessage: 'Xác nhận mật khẩu không đủ mạnh'
    },
    custom: {
      options: (value, { req }) => {
        if (value !== req.body.password) {
          throw new Error('Mật khẩu và xác nhận mật khẩu không khớp')
        }
        return true
      }
    }
  }
})
