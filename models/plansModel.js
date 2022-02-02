const mongoose = require("mongoose");
const emailValidator = require("email-validator")
require("dotenv").config();
let PASSWORD = process.env.PASSWORD;

let dbLink
    = `mongodb+srv://admin:${PASSWORD}@cluster0.yjooj.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
mongoose.connect(dbLink, {})
.then(function () {
    // console.log(db);
    console.log("connected to db4")
}).catch(function (err) {
    console.log("err", err);
})
// syntax 
const planSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "kindly pass the name"],
        unique: true,
        // errors
        maxlength: [40, "Your plan length is more than 40 characters"],
    },
    duration: {
        type: Number,
        required: [true, "You Need to provide duration"]
    },
    price: {
        type: Number,
        required: true,
    },
    ratingsAverage: {
        type: Number,
    },
    discount: {
        type: Number,
        validate: {
            validator: function () {
                return this.discount < this.price;
            },
            message: "Discount must be less than actual price",
        },
    },
    reviews: {
        //   array of object id 
        type: [mongoose.Schema.ObjectId],
        ref: "reviewModel"
    },
    averageRating: Number,
    planImages: {
        type: [String]
    }
})
// order matters 
// middleware 
const planModel = mongoose.model("planModel", planSchema);
module.exports = planModel;