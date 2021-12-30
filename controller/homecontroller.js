const BigPromise = require("../middlewares/bigpromise");

exports.home = BigPromise(async(req, res) => {
    //const db = await.something()
    res.status(200).json({
        sucess: true,
        greeting: "hello from MY APi",
    }); //@ step-03 creating a home route and also send the response to this
});

/* exports.homeDummy = (req, res) => {
    try {
        res.status(200).json({
            sucess: true,
            greeting: "hello !! this is another dummy route",
        });
    } catch (error) {}
}; //$ using try and catch instead of proimises */

exports.home = (req, res) => {
    res.status(200).json({
        sucess: true,
        greeting: "hello from MY APi",
    }); //@ step-03 creating a home route and also send the response to this
}; //* HOME CONTROLLER

exports.homeDummy = (req, res) => {
    res.status(200).json({
        sucess: true,
        greeting: "hello !! this is another dummy route",
    }); //@ step-03 creating a home route and also send the response to this
}; //* HOME CONTROLLER (DUMMY)