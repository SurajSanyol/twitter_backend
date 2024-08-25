import isAuthentication from '../config/auth.js';
import {Logout, Register, Login, Bookmark, getMyprofile, getOtherUser, follow, unfollow} from '../controllers/userController.js'
import express from 'express'
// import fileUpload from '../middleware/upload.js'
const router = express.Router();

router.route("/register").post(Register);
router.route("/login").post(Login)
router.route("/logout").get(Logout)
router.route("/bookmark/:id").put(isAuthentication,Bookmark)
router.route("/profile/:id").get(isAuthentication,getMyprofile)
router.route("/otheruser/:id").get(isAuthentication,getOtherUser)
router.route("/follow/:id").post(isAuthentication,follow)
router.route("/unfollow/:id").post(isAuthentication,unfollow)
// router.route("/upload").post( fileUpload.single("file"), (req, res) => {
//     // Handle the uploaded file here
//     if (!req.file) {
//         return res.status(400).json({
//            message: 'No file selected.',
//            success: false
//         }
//         );
//     }

//     return res.status(200).json({
//         message: ' file uploaded Successfully.',
//         success: true
        
//      }
//      );
// })


export default router;