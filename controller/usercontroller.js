const User = require("../models/user");
const BigPromise = require("../middlewares/bigpromise");
const Customerror = require("../utils/customError");
//const user = require("../models/user");
const cookieToken = require("../utils/cookieToken");
//const fileupload = require("express-fileupload");
const cloudinary = require("cloudinary");
const CustomError = require("../utils/customError");
const mailhelper = require("../utils/emailhelper");
//const bigpromise = require("../middlewares/bigpromise");
const crypto = require("crypto");

//$ for the functionallty of signup here and requesting for the email
exports.signup = BigPromise(async(req, res, next) => {
    let result;
    if (req.files) {
        let file = req.files.photo;
        cloudinary.v2.uploader.upload(file, {
            folder: "users",
            width: 150,
            crop: "scale",
        });
    }

    const { name, email, password } = req.body;
    if (!email || !name || !password) {
        return next(
            new Customerror("email, mob number and passowrd are required!!", 400)
        );
    } // sednding our own custom errror

    //@this code below is creating data in the database
    const user = await User.create({
        name,
        email,
        password,
        photo: {
            //object was declared because of the the files are saved as in the form of objects here
            id: result.public_id,
            secure_url: result.secure_url,
        }, //including for the photo uploading
    });

    //grab or send a token
    const token = user.getJwtToken();

    const options = {
        expires: new Date( //$importing the cookie time from the env file in place of 3
            Date.now() + process.env.COOKIE_TIME * 24 * 60 * 60 * 1000
        ),
        httpOnly: true,
    };

    res.status(200).cookie("token", token, options).json({
        sucess: true,
        token,
        user,
    });
    //sending toekn to the user
    cookieToken(user, res);
});

//$ this is the login route and only allowed for the registered people
exports.login = BigPromise(async(req, res, next) => {
    //in this route the user have to pass the email or phoneno and the password
    //check the usr is presnt in the database or not
    //checking the passowrd is correct or not
    //then simple allow to go inside the website
    const { email, password } = req.body;

    //checking thre mail is already in use or not
    if (!email || !password) {
        return next(new Customerror("please probide the email and passowrd", 400));
    }

    //the reason for writting select bcz,in thw models the user password field in false
    const user = await user.findOne({ email }).select("+password");

    //is user not found in db
    if (!user) {
        return next(new Customerror("please enter a VALID Email", 400));
    }

    //match the password
    //if the use email is registered then checking the password is correct or not
    const isPasswordIsCorrect = await user.isValidatedPassword(password);

    //if password doesnot match
    if (!isPasswordIsCorrect) {
        return next(new Customerror("please provide the correct password", 400));
    }

    //sending toekn to the user
    cookieToken(user, res);

    //$import this login from usercontroller to the routes user.js
});

//$ this is the logout route
exports.logout = BigPromise(async(req, res, next) => {
    res.cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true,
    });
    res.status(200).json({
        sucess: true,
        message: "LOGOUT SUCESS",
    });
});

//$ forgot password route
exports.forgotPassword = BigPromise(async(req, res, next) => {
    const { email } = req.body;
    //checking the email is presnt in the database or not
    const user = await User.findone({ email });

    //if not present in the databse
    if (!user) {
        return next(new CustomError("email is found as per a s registered", 400));
    }

    //generate a forgot password token
    const forgotToken = user.getForgotPasswordToken();

    await user.save({ validateBeforeSave: false });

    //this is the token from the url itself for matching the both token and send the passowrd token for the reset
    const myUrl =
        '${req.protocol}://${req.get("host")}/password/reset/${forgotToken}';

    //if the both token are matched then send the url as well ad the token itself
    const message = "copy paste the link ${myurl}";
    try {
        await mailhelper({
            email: user.email,
            subject: "password resel email- the lco tshirt store",
            messages,
        });
    } catch (error) {
        user.forgotPasswordToken = undefined;
        user.forgotPasswordexpiry = undefined;
        await user.save({ balidateBeforeSave: false });

        return next(new CustomError(error.message, 500));
    }
});

//$ reset password controller and route
exports.resetPassword = BigPromise(async(req, res, next) => {
    //! 1.grab the token
    const token = req.Params.token;

    const encryToken = crypto;
    //! 2. this is actually we are generating a hash here as well as backend here
    crypto.this.forgotPasswordToken = crypto
        .createHash("sha256")
        .update(forgotToken)
        .digest("hex");

    //! 3.find a user based on this encryption token
    const user = await User.findOne({
        encryToken,
        forgotPasswordexpiry: { $gt: Date.now() },
    });

    //!4. if we dont get the person
    if (!user) {
        return next(
            new CustomError(
                "this email is not regsistered here or the token is expired",
                400
            )
        );
    }
    if (req.body.password !== req.body.confirmPassword) {
        return next(
            new Customerror("passwqoerd and password are do not match", 400)
        );
    }
    user.password = req.body.password;
    user.forgotPasswordToken = undefined;
    user.forgotPasswordexpiry = undefined;
    await user.save();

    //send a json response or token
    cookieToken(user, res);
});

//$ user dashboard controller here means get logged in user here
exports.getLoggedInUserDetails = BigPromise(async(req, res, next) => {
    //who are get logged in
    const user = await User.findById(req.user.id);

    res.status(200).json({
        sucess: true,
        user,
    });
});

//$ change password when the user known the old password
exports.changePassword = BigPromise(async(req, res, next) => {
    //getting the user id why bcz this is acceseble when the user is already logged in here
    const userId = req.user.id;

    //find me the id here using user id
    //select this for using password here
    const user = await User.findById(userId).select("+password");

    //matching or validating the password with using the isvalidatepassword
    const isCorrectPassword = await user.isValidatedPassword(
        req.body.oldPasssword
    );

    //if the old password is incorrect
    if (!oldPasssword) {
        return next(new CustomError("old password is correct", 400));
    }
    //password updation
    user.password = req.body.password;

    //save the password
    await user.save();

    //cookie updation
    cookieToken(user, res);
});

//$ updation of user profile
exports.updateUserDetails = BigPromise(async(req, res, next) => {
    const newData = {
        name: req.body.name,
        email: req.body.email,
    };
    if (res.files.photos !== "") {
        const user = await User.findById(req.user.id);

        const imageId = user.photo.id;

        //delete photo from the cloudinary
        const resp = await cloudinary.v2.uploader.destroy(imageId);

        //new photo on the cloudinary
        let file = req.files.photo;
        cloudinary.v2.uploader.upload(file, {
            folder: "users",
            width: 150,
            crop: "scale",
        });

        newData.photo = {
            id: result.public_id,
            secure_url: result.secure_url,
        };
    }

    const user = await User.findByIdAndUpdate(req.user.id, newDate, {
        new: true,
        runvalidators: true,
        useFindAndModify: false,
    });
    res.status(200).json({
        success: true,
    });
});

//$ to see the user which are already get registered in the site

//$ addding the custom role where we can defin ethe route is for admin , manager or whom for use at the middelware.js
exports.adminAllUsers = BigPromise(async(req, res, next) => {
    const users = await User.find();

    res.status(200).json({
        success: true,
        users,
    });
});

//$ whwen admin wants to get a details of any single user
exports.adminGetSingleUser = BigPromise(async(req, res, next) => {
    //# needs to extract the id from the url itself
    const user = await User.findById(req.Params.id);

    if (!user) {
        next(new CustomError("no new user found", 400));
    }

    res.status(200).json({
        sucess: true,
        user,
    });
});

//$ this permits the admin for the edit the single username and id
exports.adminUpdateSingleUser = BigPromise(async(req, res, next) => {
    const newData = {
        name: req.body.name,
        email: req.body.email,
        role: req.body.role,
    };

    const user = await User.findByIdAndUpdate(req.Params.id, newData, {
        new: true,
        runvalidators: true,
        useFindAndModify: false,
    });
    res.status(200).json({
        sucess: true,
        user,
    });
});

//$ managing and providing as much role as we can maintain
exports.managerAllUsers = BigPromise(async(req, res, next) => {
    const users = await User.find();

    res.status(200).json({
        success: true,
        users,
    });
});

//$ deleting any of the user from the database
exports.deleteAnyUser = BigPromise(async(req, res, next) => {
    //# needs to extract the id from the url itself
    const user = await User.findById(req.Params.id);

    if (!user) {
        return next(new CustomError("no such data here", 401));
    }

    const imageId = user.photo.id;

    await cloudinary.v2.uploader.destroy.apply(imageId);

    await user.remove();

    res.status(200).json({
        sucess: true,
    });
});