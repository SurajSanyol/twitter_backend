import multer from 'multer'
import fs from 'fs'
import path from 'path';


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, 'controllers', 'uploadFiles');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
      console.log('uploadFiles directory created.');

    }
    cb(null, uploadDir)
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-';
    cb(null, uniqueSuffix + file.originalname)

  }
})
const upload = multer({ storage: storage })

export default upload