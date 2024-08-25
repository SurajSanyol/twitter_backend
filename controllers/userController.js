
import User from "../models/userSchema.js";
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'




dotenv.config()

export const Register = async (req, res) => {
    try {
        const { name, password, username, email } = req.body;

        // basic validation
        if (!(name && password && email && username)) {
            return res.status(400).json({
                message: "All fields are require",
                success: false
            })
        }
        const user = await User.findOne({ email })
        if (user) {
            return res.status(400).json({
                message: "User already exist",
                success: false,
            })
        }

        // hash to the password
        const hashedPassword = await bcrypt.hash(password, 16);
         username.toLowerCase();
        // create user
        await User.create({
            name,
            password: hashedPassword,
            username:username.toLowerCase(),
            email,
        })

        return res.status(200).json({
            message: "Account created successfully ",
            success: true,
        })

    } catch (error) {
        console.log(error);
        return res.status(400).json({
            message: "Account not create ",
            success: false,
        })
    }
}


export const Login = async (req, res) => {
    try {

        //get data from frontend
        const { email, password } = req.body;
        //some basic validation
        if (!(email && password)) {
            return res.status(400).json({
                message: "All fields are required",
                success: false,
            })
        }
        //check user is exist or not
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({
                message: "User not exist",
                success: false,
            })
        }

        // compare the password
        const isPassMatch = await bcrypt.compare(password, user.password);
        if (!isPassMatch) {
            return res.status(400).json({
                message: "Password incorrect !",
                success: false,
            })
        }

        // create token
        const token = jwt.sign(
            {
                id: user._id,
                email
            },
            process.env.SECRET_KEY,
            {
                expiresIn: "5h"
            }
        )

        // create a cookie

        const options = {
            expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days
            httpOnly: true,
            secure: false, // Only set secure flag in production
            sameSite: 'Lax' // Ensure this is correct based on your use case (Strict/Lax/None)
        };
          return res.status(200).cookie('token', token, options).json({
            message: `Welcome back ${user.name}`,
            userId:user._id,
            userName:user.name,
            userFollowing:user.following,
            success: true,
        })

    } catch (error) {
        console.log(error);
        return res.status(400).json({
            message: "Login Api issue",
            success: false,
        })

    }

}

export const Logout = (req, res) => {
    return res.cookie("token", { expiresIn: new Date(Date.now()) }).json({
        message: "User logout successfully",
        success: true
    })
}


export const Bookmark = async (req, res) => {
    try {
        //    const userId = req.cookies.id;
        const userId = req.body.id;
        const tweetId = req.params.id;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                message: "User not found",
                success: false,
            })
        }

        if (user.bookmark.includes(tweetId)) {
            //remove from bookmark
            user.bookmark.pull(tweetId);
            await user.save();
            return res.status(200).json({
                message: "tweet remove from bookmarked",
                success: true
            })
        }
        else {
            // add in the bookmark
            user.bookmark.push(tweetId);
            await user.save();
            return res.status(200).json({
                message: "tweet bookmarked",
                success: true
            })

        }

    } catch (error) {
        console.log(error);
        return res.status(400).json({
            message: "Bookmark api not working",
            success: false
        })
    }
}


export const getMyprofile = async (req, res) => {
    try {
        const id = req.params.id;
        const user = await User.findById(id).select("-password");
        if (!user) {
            return res.status(404).json({
                message: "user not found",
                success: false,
            })
        }
        return res.status(200).json({
            user
        })

    } catch (error) {
        console.log(error);
        return res.status(400).json({
            message: " get profile api issue",
            success: false,
        })
    }
}


export const getOtherUser = async (req, res) => {
    try {
        const { id } = req.params;
        const otherUser = await User.find({ _id: { $ne: id } });
        if (!otherUser) {
            return res.status(404).json({
                message: "Other user not Found",
                success: false
            })
        }

        return res.status(200).json({
            otherUser,
            success: true
        })
    } catch (error) {
        console.log(error);
        return res.status(404).json({
            message: " getotherUser api not working",
            success: false
        })
    }
}


export const follow = async (req, res) => {
    try {
        const loggedInUserId = req.body.id;
        const userId = req.params.id;
        const loggedInUser = await User.findById(loggedInUserId);
        const user = await User.findById(userId);

        if (!(loggedInUser.following.includes(userId))) {
            await user.updateOne({ $push: { followers: loggedInUserId } });
            await loggedInUser.updateOne({ $push: { following: userId } });

        }
        else {
            return res.status(400).json({
                message: `User already followed to ${user.name}`,
                success: false
            })
        }
        return res.status(200).json({
            message: `${loggedInUser.name} just follow to ${user.name}`,
            success: true
        })

    } catch (error) {
        console.log(error);
        return res.status(400).json({
            message: `follow api not working`,
            success: false
        })
    }
}

export const unfollow = async (req, res) => {
    try {
        const loggedInUserId = req.body.id;
        const userId = req.params.id;
        const loggedInUser = await User.findById(loggedInUserId);
        const user = await User.findById(userId);

        if (loggedInUser.following.includes(userId)) {
            await loggedInUser.updateOne({ $pull: { following: userId } });
            await user.updateOne({ $pull: { follower: loggedInUserId } });

        }
        else {
            return res.status(400).json({
                message: `User already unfollowed to ${user.name}`,
                success: false
            })
        }
        return res.status(200).json({
            message: `${loggedInUser.name} unfollow to ${user.name}`,
            success: true
        })

    } catch (error) {
        console.log(error);
        return res.status(400).json({
            message: `Unfollow api not working`,
            success: false
        })
    }
}

