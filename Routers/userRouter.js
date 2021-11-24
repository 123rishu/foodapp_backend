const UserModel = require("../models/userModel");
const mongoose = require("mongoose");
const express = require("express");
const userRouter = express.Router();
const protectRoute = require("./authHelper");
const factory = require("../helpers/factory");

const createUser = factory.createElement(UserModel);
const getUsers = factory.getElements(UserModel);
const deleteUser = factory.deleteElement(UserModel);
const updateUser = factory.updateElement(UserModel);
const getUserById = factory.getElementById(UserModel);

userRouter
    .route("/")
    .get(protectRoute, authorizeUser(["admin"]), getUsers)
    .post(protectRoute, authorizeUser(["admin"]), createUser)

userRouter
    .route("/:id")
    .get(protectRoute, authorizeUser(["admin", "manager"]), getUserById)
    .patch(updateUser)
    .delete(protectRoute, authorizeUser(["admin"]), deleteUser)

// findBYIdAndUpdate ->


//---------------------------------------------------------------------------------------------//
//USER'S METHODS
// original code 
// async function createUser(req, res) {
//     try {
//         let user = req.body;
//         if (user) {
//             user = await userModel.create(plan);
//             res.status(200).json({
//                 user: user
//             });
//         } else {
//             res.status(200).json({
//                 message: "kindly enter user's data"
//             });
//         }
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({
//             message: "Server error"
//         });
//     }
// }
// async function getUsers(req, res) {
//     try {
//         let users = await userModel.find({});
//         console.log("I was here gteusers");
//         res.status(200).json({
//             "message": "List of all the Users",
//             users: users,
//         })
//     }
//     catch (err) {
//         res.status(500).json({
//             error: err.message,
//             "message": "Can't get users",
//         })
//     }
// }
// async function getUserById(req, res) {
//     try {
//         let id = req.params.id;
//         let user = await userModel.findById(id);
//         res.status(200).json({
//             "message": "Got the user",
//             user: user,
//         })
//     }
//     catch (err) {
//         res.status(500).json({
//             message: err.message,
//         })
//     }
// }
// //findByIdAndDelete
// async function deleteUser(req, res) {
//     try {
//         let id = req.params.id;
//         console.log(id);
//         let user = await userModel.findByIdAndDelete(id);
//         console.log(user);
//         res.status(200).json({
//             "message": "User info deleted",
//             user: user
//         })
//     }
//     catch (err) {
//         res.status(500).json({
//             "message": err.message,
//         })
//     }


//     // user = {};
//     // res.status(200).json(user);
// }
// //findByIdAndUpdate
// async function updateUser(req, res) {
//     try {
//         let id = req.params.id;
//         console.log(id);
//         let user = await userModel.findByIdAndUpdate(id, { name: "Sham S" });
//         res.status(200).json({
//             "message": "Details updated",
//             user: user
//         })
//     }
//     catch (err) {
//         res.status(500).json({
//             "message": err.message
//         })
//     }
// }

function authorizeUser(rolesArr) {
    return async function (req, res, next) {
        let uid = req.uid;
        let { role } = await userModel.findById(uid);
        let isAuthorized = rolesArr.includes(role);
        if (isAuthorized) {
            next();
        } else {
            res.status(403).json({
                message: "user not authorized contact admin"
            })
        }

    }
}
//----------------------------------------------------------------------------------------------//

module.exports = userRouter;