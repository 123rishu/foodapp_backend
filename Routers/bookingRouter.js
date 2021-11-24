const express = require("express");

// router
const bookingRouter = express.Router();
const bookingModel = require("../model/bookingModel");
const UserModel = require("../model/userModel");
const { protectRoute } = require("./utilFns")
const {
    getElement, getElements,
    updateElement,
} = require("../helpers/factory");
const updatebooking = updateElement(bookingModel);
const getbooking = getElement(bookingModel);
const getbookings = getElements(bookingModel);
// createbooking
const initiateBooking = async function (req, res) {
    try {
        //getting the booking object
        let booking = await bookingModel.create(req.body);
        //getting booking id
        let bookingId = booking["_id"];
        //getting user id
        let userId = req.body.user;
        //finding user with this id inside userModel
        let user = await userModel.findById(userId);
        //adding this booking id inside this user's booking array
        user.bookings.push(bookingId);
        //save these changes
        await user.save();
        //send responses
        res.status(200).json({
            message: "booking created",
            booking: booking
        })
    } catch (err) {
        res.status(500).json({
            message: err.message
        })
    }
}
const deletebooking = async function (req, res) {
    try {
        let booking = await bookingModel.findByIdAndDelete(req.body.id);
        console.log("booking", booking);
        let userId = booking.user;
        let user = await userModel.findById(userId);
        let idxOfbooking = user.bookings.indexOf(booking["_id"]);
        user.booking.splice(idxOfbooking, 1);
        await user.save();
        res.status(200).json({
            message: "booking deleted",
            booking: booking
        })
    } catch (err) {
        res.status(500).json({
            message: err.message
        })
    }
};
// deletebooking
bookingRouter
    .route("/:id")
    .get(getbooking)
    .patch(protectRoute, updatebooking)
    .delete(protectRoute, deletebooking)
// ****************************************************
bookingRouter
    .route("/")
    .get(getbookings)
    // create -> payment done 
    .post(protectRoute, initiateBooking);

module.exports = bookingRouter;