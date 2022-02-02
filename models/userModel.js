const mongoose = require("mongoose");
const emailValidator = require("email-validator");
require("dotenv").config();
let PASSWORD = process.env.PASSWORD;


// try {
//     await mongoose.connect('mongodb://localhost:27017/test');
// } catch (error) {
//     handleError(error);
// }
let dbLink
    = `mongodb+srv://admin:${PASSWORD}@cluster0.yjooj.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
    connectToDb();
    async function connectToDb(){
        try {
            await mongoose.connect(dbLink);
        } catch (error) {
            console.log("err", error);
        }
    }
// syntax 
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "kindly enter the name"],
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate: function () {
            return emailValidator.validate(this.email);
        }
    },
    age: {
        type: Number
    },
    password: {
        type: String,
        minlength: 7,
        required: true
    },
    confirmPassword: {
        type: String,
        minlength: 7,
        validate:
            function () {
                return this.password == this.confirmPassword
            },
        required: true
    },
    createdAt: Date,
    token: String,

    role: {
        type: String,
        enum: ["admin", "user", "manager"],
        default: "user"
    },
    bookings: {
        //   array of object id 
        type: [mongoose.Schema.ObjectId],
        ref: "bookingModel"
    },
})
// order matters 
// middleware 
userSchema.pre("save", function () {
    // db confirm password will not be saved
    console.log("Hello");
    this.confirmPassword = undefined;
})

const userModel = mongoose.model("userModel", userSchema);

module.exports = userModel