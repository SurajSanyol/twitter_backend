import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config();


const isAuthentication = async (req, res, next) => {

    try {

        // check user is login or not, if user is login then that have token 
    
        const token = req.cookies.token;

        if (!token) {
            return res.status(400).json({
                message: "User not authenticated",
                sucess: false
            })
        } 

        // // check token is correct or not
        let decoded;
        try {
            decoded = jwt.verify(token, process.env.SECRET_KEY);
           
        } catch (error) {
            return res.status(401).json({
                message: "Invalid token",
                success: false
            });
        }

        // this line need to more focus 🚀🚀🚀
        req.user = decoded.id;
        next()

    } catch (error) {
        console.log(error);
    }

}

export default isAuthentication;