// import multer from 'multer'
// import fs from 'fs'
// import path from 'path';
// import { fileURLToPath } from 'url';


// // Manually define __dirname for ES modules
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// const uploadDir = path.join(__dirname, 'controllers', 'uploadFiles');
// if (!fs.existsSync(uploadDir)) {
//   fs.mkdirSync(uploadDir, { recursive: true });
//   console.log('uploadFiles directory created.');

// }

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, uploadDir)
//   },
//   filename: function (req, file, cb) {
//     const uniqueSuffix = Date.now() + '-';
//     cb(null, uniqueSuffix + file.originalname)

//   }
// })
// const upload = multer({ storage: storage })

// export default upload

import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Manually define __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Set up multer storage with dynamic destination and filename
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, 'controllers', 'uploadFiles');

    // Check if the directory exists, if not, create it
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
      console.log('uploadFiles directory created.');
    }

    // Pass the directory to the callback
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Generate a unique suffix for the file
    const uniqueSuffix = Date.now() + '-' + file.originalname;
    
    // Pass the filename to the callback
    cb(null, uniqueSuffix);
  }
});

// Initialize multer with the configured storage
const upload = multer({ storage: storage });

export default upload;

