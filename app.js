const express = require("express");
const userModel = require("./models/userModel");
const planModel = require("./models/plansModel");
const cookieParser = require("cookie-parser");

// require("dotenv").config();
// let password = process.env.PASSWORD;


//server init
const app = express();

app.use(express.static("FrontEnd_Folder"));
app.use(express.json());
app.use(cookieParser());
//Mounting in express
const userRouter = require("./Routers/userRouter");
const authRouter = require("./Routers/authRouter");
const planRouter = require("./Routers/planRouter");
const reviewRouter = require("./Routers/reviewRouter");
const bookingRouter = require('./Routers/bookingRouter');
//  /api/user/:id
app.use('/api/user', userRouter);
app.use("/api/auth", authRouter);
app.use("/api/plan", planRouter);
app.use("/api/review", reviewRouter);
app.use("/api/booking", bookingRouter);

app.listen(process.env.PORT||8081, function () {
    console.log("server started");
})

// 404 page
app.use(function (req, res) {
    // console.log("fullPath", fullPath);
    res.status(404).json({
        message: "page Not found"
    })
})



//--------------EXTRA----------------------------------//

// app.get("/", function (req, res) {
//     console.log("hello from home page");
//     res.send("<h1>Hello form Backend</h1>");
// });


//create user in server
// app.post("/user", createUser);
// //get user from server
// app.get("/user", getUser);
// //update user in server
// app.patch("/user", updateUser);
// //template routes in server
// app.get("/user/:id", getUserById);
// //delete user in server
// app.delete("/user", deleteUser);
//-----------------------------------------------------//