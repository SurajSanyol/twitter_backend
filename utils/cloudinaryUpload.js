import { v2 as cloudinary } from 'cloudinary';
import fs from  'fs'

const cloudinaryUpload = async (filePath,folder)=>{
    const options = {
        use_filename: true,
        unique_filename: false,
        overwrite: true,    
        resource_type: 'auto',
        folder: folder
        
      };
      
  
      try {
         if(!filePath)return null;
        // Upload the image
        const result = await cloudinary.uploader.upload(filePath,options);
        
        fs.unlinkSync(filePath);
        return result
      } catch (error) {
        fs.unlinkSync(filePath) // if there is an error, delete the temporary file
        
      }
}

export default cloudinaryUpload