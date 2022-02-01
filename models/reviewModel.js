const mongoose = require("mongoose");
require("dotenv").config();
let PASSWORD = process.env.PASSWORD;

let dbLink
    = `mongodb+srv://admin:${PASSWORD}@cluster0.yjooj.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
mongoose.connect(dbLink, {
}).then(function (db) {
    // console.log(db);
    console.log("connected to db2")
}).catch(function (err) {
    console.log("err", err);
})
const reviewSchema = new mongoose.Schema({
    review: {
        type: String,
        required: [true, "Review can't be empty"]
    },
    rating: {
        type: Number,
        min: 1,
        max: 5,
        required: [true, "Review must contain some rating"]
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: "userModel",
        required: [true, "Review must belong to a user"]
    },
    plan: {
        type: mongoose.Schema.ObjectId,
        ref: "planModel",
        required: [true, "Review must belong to a plan "]
    }
    
})

const ReviewModel = mongoose.model("reviewModel", reviewSchema);
module.exports = ReviewModel;