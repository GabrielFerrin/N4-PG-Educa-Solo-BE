import { config } from 'dotenv'
import { connect } from 'mongoose'

config()

export const PORT = process.env.PORT || 3000
export const DB_HOST = process.env.DB_HOST
export const SECRET_KEY = process.env.SECRET_KEY

export const connectDB = async () => {
  try {
    await connect(DB_HOST)
    console.log('DB connected')
  } catch (error) {
    console.log(error)
  }
}
