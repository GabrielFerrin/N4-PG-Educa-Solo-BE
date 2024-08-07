import express from 'express'
import morgan from 'morgan'
import { connectDB } from './config/config.js'
import notImplemented from './middleware/notImplemented.js'
import error from './middleware/error.js'
import userR from './routes/user.routes.js'
import courseR from './routes/course.routes.js'
import activityR from './routes/activity.routes.js'
import attemptR from './routes/attempt.routes.js'
import { cors, options } from './middleware/cors.js'

const app = express()

connectDB()
// Apply middlewares
app.use(morgan('dev'))
app.use(express.json())
app.use(cors)

// Handle OPTIONS requests for all routes
app.options('*', options)
// routes
app.use('/api/users', userR)
app.use('/api/courses', courseR)
app.use('/api/activities', activityR)
app.use('/api/attempts', attemptR)

app.use(notImplemented)
app.use(error)

export default app
