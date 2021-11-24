const plansModel = require("../models/plansModel");
const mongoose = require("mongoose");
const express = require("express");
const plansRouter = express.Router();
const factory = require("../helpers/factory");
const protectRoute = require("./authHelper");

plansRouter.use(protectRoute);

const createPlan = factory.createElement(plansModel);
const getPlans = factory.getElements(plansModel);
const deletePlan = factory.deleteElement(plansModel);
const updatePlan = factory.updateElement(plansModel);
const getPlanById = factory.getElementById(plansModel);
plansRouter.route("/top3plans")
    .get(getTop3Plans)

plansRouter.route("/sortByRating", getbestPlans);

plansRouter
    .route("/:id")
    .get(getPlanById)
    .patch(updatePlan)
    .delete(deletePlan)
// ****************************************************
plansRouter
    .route("/")
    .get(getPlans)
    .post(createPlan)

async function getbestPlans(req, res) {
    console.log("hello")
    try {
        let plans = await plansModel.find()
            .sort("-averageRating").populate({
                path: 'reviews',
                select: "review"
            })
        console.log(plans);
        res.status(200).json({
            plans
        })
    } catch (err) {
        console.log(err);
        res.status(200).json({
            message: err.message
        })
    }
}

async function getTop3Plans(req, res) {
    try {
        console.log("hello")
        let plans = await plansModel.find()
            .sort("-averageRating")
            .limit(3)
            .populate({
                path: 'reviews',
                select: "review"
            })

        console.log(plans);
        res.status(200).json({
            plans
        })
    } catch (err) {
        console.log(err);
        res.status(200).json({
            message: err.message
        })
    }
}

//----------------------------------------------------------------------------------------------//
//Plans Methods
// query params sql injection
// localhost:8080/api/plan?select=name%price&page=1&sort=price&myquery={"price":{"$gt":200}}
// async function getPlans(req, res) {
//     try {
//         // console.log(req.query);
//         // sort,
//         // sort
//         // sort
//         // paginate
//         let ans = JSON.parse(req.query.myquery);
//         console.log("ans", ans);
//         let plansQuery = PlanModel.find(ans);
//         let sortField = req.query.sort;
//         let sortQuery = plansQuery.sort(`-${sortField}`);
//         let params = req.query.select.split("%").join(" ");
//         let fileteredQuery = sortQuery
//             .select(`${params} -_id`);
//         // pagination
//         // skip
//         // limit
//         let page = Number(req.query.page) || 1;
//         let limit = Number(req.query.limit) || 3;
//         let toSkip = (page - 1) * limit;
//         let paginatedResultPromise = fileteredQuery
//             .skip(toSkip)
//             .limit(limit);
//         let result = await paginatedResultPromise;
//         // PlanModel.sort().select()
//         // 
//         res.status(200).json({
//             "message": "list of all the Plans",
//             Plans: result
//         })
//     } catch (err) {
//         res.status(500).json({
//             error: err.message,
//             "message": "can't get Plans"
//         })
//     }

//     // for sending key value pair
// }
// async function createPlan(req, res) {
//     try {
//         let planObject = req.body;
//         let length = Object.keys(planObject).length;

//         if (length == 0) {
//             return res.status(400).json({
//                 "message": "Entered plan details are empty",
//             })
//         }

//         let plan = await plansModel.create(planObject);
//         console.log("plan", plan);

//         res.status(200).json({
//             message: "Plan created",
//             plan: plan
//         })
//     }
//     catch (err) {
//         res.status(500).json({
//             "message": err.message,
//         })
//     }
// }
// async function getPlanById(req, res) {
//     try {
//         let id = req.params.id;
//         let plan = await plansModel.findById(id);
//         res.status(200).json({
//             "message": "Got the plan",
//             plan: plan
//         })
//     }
//     catch (err) {
//         res.status(500).json({
//             message: err.message,
//         })
//     }
// }
// async function updatePlan(req, res) {
//     try {
//         let id = req.params.id;
//         let plan = await plansModel.findByIdAndUpdate(id, { name: "Mix Veg" });
//         res.status(200).json({
//             "message": "Details Updated",
//             plan: plan
//         })
//     }
//     catch (err) {
//         res.status(500).json({
//             "message": err.message
//         })
//     }
// }
// async function deletePlan(req, res) {
//     try {
//         let id = req.params.id;
//         let plan = await plansModel.findByIdAndDelete(id);
//         res.status(200).json({
//             "message": "Plan info deleted",
//             plan: plan
//         })
//     }
//     catch (err) {
//         message: err.message
//     }
// }
// function getTop3Plans() {

// }
//----------------------------------------------------------------------------------------------//


module.exports = plansRouter;