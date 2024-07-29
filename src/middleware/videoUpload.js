import multer from 'multer'
import path from 'path'

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'videos')
  },
  filename: function (req, file, cb) {
    const filename = `${Date.now()}${path.extname(file.originalname)}`
    req.body.data = filename
    console.log(req.body)
    cb(null, filename)
  }
})

const fileFilter = (req, file, cb) => {
  if (file.mimetype.includes('mp4')) {
    cb(null, true)
  } else {
    cb(new Error('Solo se admiten archivos mp4'))
  }
}

const limits = {
  fileSize: 1024 * 1024 * 50,
  files: 1
}

export const videoUpload = multer({ storage, fileFilter, limits })
