const userModel = require("../models/userModel");
const mongoose = require("mongoose");
const express = require("express");
const jwt = require("jsonwebtoken");
require("dotenv").config();
let JWT_KEY = process.env.JWT_KEY;
const authRouter = express.Router();
let emailSender = require("../helpers/emailSender");
authRouter
    .post("/signup", setCreatedAt, signupUser)
    .post("/login", loginUser)
    .post("/forgetPassword", forgetPassword)
    .post("/resetPassword", resetPassword)

//http://localhost:8080/api/auth/signup
//ispar hit lagte hi pehle setCreatedAt chalega then signupUser
//request response ka kaam express karta hai
//aur, db me object creation ka kam mongoose karta hai

//-----------------------------------------//
//Auth functions
function setCreatedAt(req, res, next) {
    let body = req.body;
    let length = Object.keys(body).length;

    if (length == 0) {
        //Agar body ke object length zero hogi, toh signup ko call nahi lagegi, aur yhi se response bhej denge
        return res.status(400).json({
            message: "Can't create user when body is empty"
        })
    }

    req.body.createdAt = new Date().toISOString();
    next();
}
async function signupUser(req, res) {
    //create user object(email, password, name) in database with the requested data
    try {
        let userObject = req.body;
        console.log("userObj", userObject);
        //userModel.create(object) call hote hi
        //object ke upar userSchema ka code parse karke check hoga 
        //ki thik tarah se u=object define hua hai ya nahi
        //then, userSchema vala hook chalega, then document store hoga db ke andar
        let user = await userModel.create(userObject);
        console.log("user", user);

        res.status(200).json({
            message: "User created",
            createdUser: user,
        })
    }
    catch (err) {
        res.status(500).json({
            message: err.message,
        })
    }
}
async function loginUser(req, res) {
    try {
        //Ye posted user ka object ayega
        let loginUserObject = req.body;
        console.log(loginUserObject)
        if (loginUserObject.email) {
            //ye hum db se object nikal ke layenge, posted object ke email nam ke according
            let user = await userModel.findOne({ "email": loginUserObject.email });
            if (user) { 
                if (user.password == loginUserObject.password) {
                    //After validation, we send cookie in response for further validation
                    //httpOnly ko true karne se edit nahi ho payegi cookie
                    //Cookie ke liye ek unique token bhi create karna padega
                    let payLoad = user["_id"];
                    //Token creation
                    let token = jwt.sign({id: payLoad}, JWT_KEY+"");
                    res.cookie("jwt", token, {httpOnly: true});
    
                    return res.status(200).json({
                        user,
                        "message": "user logged in "
                    })
                }
                else {
                    return res.status(401).json({
                        "message": "Email or password is wrong"
                    })
                }
            }
            else {
                return res.status(401).json({
                    "message": "Email or password is wrong"
                })
            }
        }
        else {
            return res.status(403).json({
                "message": "Email is not present",
            })
        }
    }
    catch (err) {
        res.status(500).json({
            message: err.message + "yha hai dikat",
        })
    }
}
async function forgetPassword(req, res){
    let email = req.body.email;
    //creating special code to send to email
    let seq = (Math.floor(Math.random() * 10000) + 10000).toString().substring(1);
    console.log(seq);
    try{
        if(email){
            //first, update the person's obj with this mail id with special code
            await userModel.updateOne({email}, { token: seq });

            //to check, whether this person's obj get updated or not
            let user = await userModel.findOne({ email });
            await emailSender(seq);
            console.log(user);

            //agar user ke andar token mila toh kuch,varna kuch
            if(user?.token){
                return res.status(200).json({
                    message: "Email send with token" + seq,
                })
            }
            else{
                return res.status(404).json({
                    message: "User not found"
                })
            }
        }
        else{
            res.status(400).json({
                message: "Kindly enter email"
            })
        }
    }
    catch(err){
        console.log(err);
        res.status(500).json({
            message: err.message
        })
    }
}
async function resetPassword(req, res){
    let {token, password, confirmPassword} = req.body;

    try{
        //token tru value honi chahiye, input token
        if(token){
            //ye token wale user ko db me find karke layenge
            //then is user ka password change kardenge
            let user = await userModel.findOne({ token });

            if(user){
                //user.resetHandler(password, confirmPassword)
                user.password = password;
                user.confirmPassword = confirmPassword;
                //token reuse is not possible
                user.token = undefined;
                await user.save();
                console.log(user);

                res.status(200).json({
                    message: "user password changed"
                })
            }
            else{
                return res.status(404).json({
                    message: "incorrect token"
                })
            }
        }
        else{
            return res.status(404).json({
                message: "incorrect token"
            })
        }
    }
    catch(err){
        console.log(err);
        return res.status(500).json({
            message: err.message
        })
    }
}
//----------------------------------------//

module.exports = authRouter;