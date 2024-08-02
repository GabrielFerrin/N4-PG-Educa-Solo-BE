const allowedOrigins = new Set([
  'http://localhost:5173',
  'https://n4-mp-auth-fe.onrender.com'
])

const setCorsHeaders = (req, res) => {
  const origin = req.headers.origin || req.headers.host
  console.log('ORIGIN:', origin)
  const isAllowed = allowedOrigins.has(origin)
  if (isAllowed) {
    res.setHeader('Access-Control-Allow-Origin', origin)
    res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, authorization')
  } else {
    res.setHeader('Access-Control-Allow-Origin', '')
  }
  res.removeHeader('X-Powered-By')
}

export const cors = (req, res, next) => {
  setCorsHeaders(req, res)
  next()
}

export const options = (req, res) => {
  setCorsHeaders(req, res)
  res.status(200).end()
}
