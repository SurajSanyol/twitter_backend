import mongoose from "mongoose"
import dotenv from 'dotenv'

dotenv.config();
const detabaseConnect = async ()=>{
    try {
       await mongoose.connect(process.env.DATABASE_URL);
       console.log("Database is  connected");
        
    } catch (error) {
        console.log(error);
        console.log("Database is not connected");
    }
}

export default  detabaseConnect;