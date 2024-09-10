import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs'
import path from 'path';

const cloudinaryUpload = async (filePathUrl, folder,file) => {
  const options = {
    use_filename: true,
    unique_filename: false,
    overwrite: true,
    resource_type: 'auto',
    folder: folder

  };

 // this is very important
const filePath = path.join(file.destination, file.filename);
const fileBuffer = await fs.promises.readFile(filePath);
const mime = file.mimetype;
const encoding = 'base64';
const base64Data = fileBuffer.toString('base64');
const fileUri = 'data:' + mime + ';' + encoding + ',' + base64Data;
 

  try {
    if (!filePath) return null;
    // Upload the image

    const result = await cloudinary.uploader.upload(fileUri, options);

    fs.promises.unlink(filePathUrl);
    return result
  } catch (error) {
    fs.promises.unlink(filePathUrl) // if there is an error, delete the temporary file

  }
}

export default cloudinaryUpload