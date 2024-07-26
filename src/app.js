import express from 'express'
import morgan from 'morgan'
import userR from './routes/user.routes.js'
import notImplemented from './middleware/notImplemented.js'
import error from './middleware/error.js'
import { connectDB } from './config/config.js'

const app = express()

connectDB()

app.use(express.json())
app.use(morgan('dev'))

app.use('/api/users', userR)

app.use(notImplemented)
app.use(error)

export default app
