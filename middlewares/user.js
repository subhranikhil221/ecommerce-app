const User = require("../models/user");
const bigpromise = require("../middlewares/bigpromise");
const CustomError = require("../utils/customError");
const user = require("../models/user");
const { resolveHostname } = require("nodemailer/lib/shared");
const jwt = -require("jsonwebtoken");

exports.isLoggedIn = bigpromise(async(req, res, next) => {
    //! 1.extract the token info or grab the token
    const token =
        req.cookies.token || req.header("Authorization").replace("Bearer", "");
    if (!token) {
        return next(new CustomError("login firdst to acces this code", 401));
    }

    //needs to grab some information from the user neds to using the jwt token here
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    //req.user is my property here
    req.user = await User.findById(decoded.id);

    next();
});

//$ exports the method customusers here

//@ here we can say the role of the user  as admin or user or something else
exports.customRole = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(
                new CustomError("uh are not allowed to use in this model", 403)
            );
        }
        next();
    };
};