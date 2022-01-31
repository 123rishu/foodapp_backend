const jwt = require("jsonwebtoken");
const {JWT_KEY} = require("../secrets2");
console.log(JWT_KEY + "YO");
function protectRoute(req, res, next){
    console.log(req.cookies);
    try{
        //Pehle check karenge ki jwt nam ki cookie hai bhi ya nahi
        if(req.cookies.jwt){
            console.log(req.cookies.jwt);
            //Then, check karenge, token ka signature using jwt method
            console.log("I was here protect");
            let decrytptedToken = jwt.verify(req.cookies.jwt, JWT_KEY);
            if(decrytptedToken){
                req.uid = decrytptedToken.id;
                next();
            }
        }
        else{
            res.status(401).json({
                "message": "You are not allowed"
            })
        }
    }
    catch(err){
        res.status(500).json({
            "message": err.message
        })
    }
}

module.exports = protectRoute;