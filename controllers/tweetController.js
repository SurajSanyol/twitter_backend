import Tweet from '../models/tweetSchema.js'
import User from '../models/userSchema.js';
import cloudinaryUpload from '../utils/cloudinaryUpload.js';


function isFileTypeSupported(fileType, supportedTypes) {
    return supportedTypes.includes(fileType);
}

export const createTweet = async (req, res) => {
    try {
        // get data 
        const { description, id } = req.body;
        // basic validation
        if (!(description && id)) {
            return res.status(400).json({
                message: " All fields are required",
                success: false
            })
        }

        const file = req.file;
        let response = null;
          
    
        if (file) {
            const supportedTypes = ["jpg", "jpeg", "png","tif","tiff", "webp", "bmp", "gif"];
            const type =file.originalname.split(".");
            const fileType = type[type.length - 1].toLowerCase();


            if (!isFileTypeSupported(fileType, supportedTypes)) {
                return res.status(400).json({
                    success: false,
                    message: `File formate is not supported `,
                })
            }
          

             response = await cloudinaryUpload(file.path,"tweetImage",file);
        }
        //validiation 

        const user = await User.findById(id).select("-password");

        // create the tweet
        await Tweet.create({
            description,
            userId: id,
            userDetails: user,
            imageUrl: response ? (response?.url) : "",
        });

        return res.status(200).json({
            message: "Tweet created Successfully",
            success: true
        })

    } catch (error) {
        console.log(error);
    }
}

export const deleteTweet = async (req, res) => {
    try {
        const { id } = req.params;

        await Tweet.findByIdAndDelete(id);
        return res.status(200).json({
            message: "tweet deleted Successfully",
            success: true,
        })

    } catch (error) {
        console.log(error);
    }
}


export const likeOrDislike = async (req, res) => {
    try {
        const userId = req.body.id;
        const tweetId = req.params.id;
        // console.log(userId);

        // find the tweet 
        const tweet = await Tweet.findById(tweetId);

        if (!tweet) {
            return res.status(400).json({
                message: "tweet is not found",
                success: false,
            })
        }

        if (tweet.like.includes(userId)) {
            // dislike
            //   await Tweet.findByIdAndUpdate({tweetId,$pull:{like:userId}});
            tweet.like.pull(userId);
            await tweet.save();
            return res.status(200).json({
                message: "user disliked your tweet"
            })
        }
        else {
            // like
            //  await Tweet.findByIdAndUpdate({tweetId,$push:{like:userId}});
            tweet.like.push(userId);
            await tweet.save();
            return res.status(200).json({
                message: "user liked your tweet"
            })
        }



    } catch (error) {
        console.log(error);
        return res.status(401).json({
            message: "likeorDislike api me issue hai ",
            success: false
        })

    }
}

export const getAllTweet = async (req, res) => {

    try {
        const loggedInUserId = req.params.id;
        const loggedInUser = await User.findById(loggedInUserId);
        const loggedInUserTweets = await Tweet.find({ userId: loggedInUserId });
        const followingUserTweets = await Promise.all(loggedInUser.following.map((id) => { return Tweet.find({ userId: id }) }));
        return res.status(200).json({
            // tweets: { ...loggedInUserTweets, ...followingUserTweets }
            tweets: loggedInUserTweets.concat(...followingUserTweets)
        })


    } catch (error) {
        console.log(error);
        return res.status(200).json({
            message: "getAllTweet api not working",
            success: false,
        })
    }
}


export const getFollowingTweet = async (req, res) => {

    try {
        const loggedInUserId = req.params.id;
        const loggedInUser = await User.findById(loggedInUserId);
        const followingUserTweets = await Promise.all(loggedInUser.following.map((id) => { return Tweet.find({ userId: id }) }))

        return res.status(200).json({

            tweets: [].concat(...followingUserTweets)
        })
    } catch (error) {
        console.log(error);
        return res.status(200).json({
            message: "getFollowingTweet api not working",
            success: false,
        })

    }
}