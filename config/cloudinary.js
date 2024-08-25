

import { v2 as cloudinary } from 'cloudinary';

const cloudinaryConnect = ()=>{
     
    try {
        cloudinary.config({ 
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
            api_key: process.env.CLOUDINARY_API_KEY, 
            api_secret:  process.env.CLOUDINARY_API_SECRET // Click 'View API Keys' above to copy your API secret
        });
        console.log("Cloudinary is connected");
    } catch (error) {
         console.log("Cloudinary is not connected",error);
         
    }
}

export default cloudinaryConnect;