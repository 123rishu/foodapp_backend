module.exports.createElement = function (ElementModel) {
    return async function (req, res) {
        try {
            let element = req.body;
            if (element) {
                element = await ElementModel.create(element);
                res.status(200).json({
                    element
                });
            } else {
                res.status(200).json({
                    message: "kindly enter  data"
                });
            }
        } catch (err) {
            console.error(err);
            res.status(500).json({
                message: "Server error"
            });
        }
    }
}
module.exports.getElements = function (ElementModel) {
    return async function (req, res) {
        try {
            let requestPromise;
            // query
            if (req.query.myQuery) {
                requestPromise = elementModel.find(req.query.myQuery);
            } else {
                requestPromise = elementModel.find();
            }
            // sort

            if (req.query.sort) {
                requestPromise = requestPromise.sort(req.query.sort)
            }
            // select
            if (req.query.select) {
                let params = req.query.select.split("%").join(" ");
                requestPromise = requestPromise.select(params);
            }
            // paginate 
            let page = Number(req.query.page) || 1;
            let limit = Number(req.query.limit) || 4;
            let toSkip = (page - 1) * limit;
            requestPromise = requestPromise
                .skip(toSkip)
                .limit(limit);
            let elements = await requestPromise;
            res.status(200).json({
                "message": elements
            })
        } catch (err) {
            res.status(502).json({
                message: err.message
            })
        }
    }
}
module.exports.updateElement = function (ElementModel) {
    return async function updateElement(req, res) {
        let { id } = req.params;
        try {
            // user model -> check 
            // plan -> if -> fail
            if (req.body.password || req.body.confirmPassword) {
                return res.json({
                    message: "use forget password instead"
                })
            }
            let element = await ElementModel.findById(id);
            console.log("60", element)
            if (element) {
                for (let key in req.body) {
                    element[key] = req.body[key];
                }
                // save -> confirm ,password
                await element.save({
                    validateBeforeSave: false
                });
                res.status(200).json({
                    element: element
                });
            } else {
                res.status(404).json({
                    message: "element not found"
                })
            }
        } catch (err) {
            console.error(err);
            res.status(500).json({
                message: "Server error"
            });
        }
    }
}
module.exports.deleteElement = function (ElementModel) {
    return async function deletePlan(req, res) {
        let { id } = req.body;
        try {
            let element = await ElementModel.finByIdAndDelete(id, req.body);
            // let element = await ElementModel.findOne({ _id: id });
            if (!element) {
                res.status(404).json({
                    message: "resource not found"
                })
            } else {
                res.status(200).json(element);
            }
        } catch (err) {
            console.log(err);
            res.status(500).json({
                message: "Server error"
            });

        }
    }

}
module.exports.getElementById = function (ElementModel) {
    return async function getElementById(req, res) {
        try {
            let id = req.params.id;
            let element = await ElementModel.getElementById(id);

            res.status(200).json({
                element: element
            });
        } catch (err) {
            console.log(err);
            res.status(500).json({
                message: "Server error"
            });
        }

    }
}