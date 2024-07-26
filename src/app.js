import express from 'express'
import morgan from 'morgan'
import { connectDB } from './config/config.js'
import notImplemented from './middleware/notImplemented.js'
import error from './middleware/error.js'
import userR from './routes/user.routes.js'
import courseR from './routes/course.routes.js'
import activityR from './routes/activity.routes.js'

const app = express()

connectDB()
// middlewares
app.use(express.json())
app.use(morgan('dev'))
// routes
app.use('/api/users', userR)
app.use('/api/courses', courseR)
app.use('/api/activities', activityR)

app.use(notImplemented)
app.use(error)

export default app
