import nodeMailer from 'nodemailer'
import dotenv from 'dotenv'
dotenv.config()

const transporter = nodeMailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
})

transporter.verify((error, success) => {
  if (error) {
    console.error('Connect faild SMTP:', error)
  } else {
    console.log('SMTP server already send mail.')
  }
})

export default transporter
