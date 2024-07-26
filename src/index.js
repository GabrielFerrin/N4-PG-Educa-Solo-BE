import { PORT } from './config/config.js'
import app from './app.js'

const message = `Server running on port ${PORT}`
app.listen(PORT, () => { console.log(message) })
