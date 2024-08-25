import mongoose from "mongoose";

const tweetSchema = new mongoose.Schema({
    description: {
        type: String,
        required: true,
    },
    like: {
        type: Array,
        default: [],

    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    userDetails: [],
    imageUrl:{
        type:String
    }

}, { timestamps: true })

const Tweet = mongoose.model("Tweet", tweetSchema);
export default Tweet;