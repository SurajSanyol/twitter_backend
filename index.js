import express from 'express'
import dotenv from 'dotenv';
import detabaseConnect from './config/database.js';
import cookieParser from 'cookie-parser';
import userRoute from './routes/userRoutes.js'
import tweetRoute from "./routes/tweetRoute.js"
import cors from "cors"
import cloudinaryConnect from './config/cloudinary.js';
import fileUpload from './middleware/upload.js'

dotenv.config();
const app = express();
detabaseConnect();
cloudinaryConnect();


app.use(cookieParser());

// middleware to parse json request body;
app.use(express.urlencoded({
  extended: true
}))

app.use(express.json());

const options = {
  origin: process.env.CROSS_ORIGIN_URL,
  methods: 'GET, PUT,DELETE,POST',
  credentials: true,
}

app.use(cors(options))

// api route mounting

app.use("/api/v1/user",  userRoute);
app.use("/api/v1/tweet", tweetRoute);



app.listen(process.env.PORT, () => {
  console.log(`Server is running at Port ${process.env.PORT}`);
})

