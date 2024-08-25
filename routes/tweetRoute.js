import express from 'express'
import { createTweet, deleteTweet, getAllTweet, getFollowingTweet, likeOrDislike } from '../controllers/tweetController.js';
import  isAuthentication  from '../config/auth.js';
import fileUpload from '../middleware/upload.js';


const router = express.Router();
// yaha pr pahe isAuthentication call hoga agar usme error nahi ata hai to wo createTweet wala api call krega 
router.route("/createtweet").post(isAuthentication,fileUpload.single("imageupload"),createTweet)
router.route("/deletetweet/:id").delete(isAuthentication,deleteTweet);
router.route("/like/:id").put(isAuthentication,likeOrDislike);
router.route("/alltweet/:id").get(isAuthentication,getAllTweet)
router.route("/followingtweet/:id").get(isAuthentication,getFollowingTweet)




export default router;