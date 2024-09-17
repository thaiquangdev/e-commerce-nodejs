import mongoose, { Document, Schema } from 'mongoose'
import { UserRole, UserStatus } from '../utils/user-enum'

export interface IUser extends Document {
  fullName: string
  email: string
  password: string
  phoneNumber: string
  roles: UserRole
  status: UserStatus
  refreshToken: string
  resetPasswordToken: string
  resetPasswordExpire: Date
  createdAt: Date
  updatedAt: Date
}

const UserSchema: Schema = new Schema({
  fullName: {
    type: String
  },
  email: {
    type: String,
    unique: true
  },
  password: {
    type: String
  },
  roles: {
    type: String,
    enum: Object.values(UserRole),
    default: UserRole.CUSTOMER
  },
  status: {
    type: String,
    enum: Object.values(UserStatus),
    default: UserStatus.ACTIVE
  },
  refreshToken: { type: String },
  resetPasswordToken: { type: String },
  resetPasswordExpire: { type: Date },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
})

const UserModel = mongoose.model<IUser>('User', UserSchema)
export default UserModel
