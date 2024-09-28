import mongoose, { Document, Schema } from 'mongoose'

interface IAddress extends Document {
  user: mongoose.Schema.Types.ObjectId
  phoneNumber: string
  country: string
  streetAddress: string
  city: string
  stateCountry: string
  zipCode: string
}

const addressSchema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    phoneNumber: {
      type: String
    },
    country: {
      type: String
    },
    streetAddress: {
      type: String
    },
    city: {
      type: String
    },
    stateCountry: {
      type: String
    },
    zipCode: {
      type: String
    }
  },
  { timestamps: true }
)

const AddressModel = mongoose.model<IAddress>('Address', addressSchema)
export default AddressModel
