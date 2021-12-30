const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const randomstring = require("randomstring");
const crypto = require("crypto");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        require: [true, "please provide an name"],
        maxlength: [40, "name should be under 40 character"],
    },
    email: {
        type: String,
        require: [true, "please provide an email"],
        //maxlength: [40, "mail should be under 40 character"],
        validate: [validator.isEmail, "please enter email in correct format"],
        unique: true,
    },
    password: {
        type: String,
        require: [true, "please provide an password"],
        //maxlength: [40, "mail should be under 40 character"],
        //validate: [validators.isEmail, 'please enter email in correct format'],
        //unique: true,
        minlength: [
            6,
            "password should be of a certain length having special characters",
        ],
        select: false,
    },
    role: {
        type: String,
        default: "user",
        require: [true, "please provide an password"],
        //maxlength: [40, "mail should be under 40 character"],
        //validate: [validators.isEmail, 'please enter email in correct format'],
        //unique: true,
        //minlength: [6, 'password should be of a certain length having special characters'],
        //select: false
    },
    photo: {
        id: {
            type: String,
            required: true,
        },
        secure_url: {
            type: String,
            required: true,
        },
        //type: String,
        //require: [true, "please provide an password"],
        //maxlength: [40, "mail should be under 40 character"],
        //validate: [validators.isEmail, 'please enter email in correct format'],
        //unique: true,
        //minlength: [6, 'password should be of a certain length having special characters'],
        //select: false
    },
    forgotPasswordToken: String,

    forgotPasswordExpiry: Date,
    createdAt: {
        type: String,
        default: Date.now,
    },
});

//$ encrypt password before save - HOOKS
userSchema.pre("save", async function(next) {
    if (!this.isModified("password")) {
        return next();
    }
    //update the password using bcrypt hash
    this.password = await bcrypt.hash(this.password, 10);
});
//as same for the forgotpassword schema
userSchema.pre("save", async function(next) {
    if (!this.isModified("forgotPasswordToken")) {
        return next();
    }
    //update the password using bcrypt hash
    this.forgotPasswordToken = await bcrypt.hash(this.forgotPasswordToken, 10);
});
//@ validate the passowrd with passed on user password
userSchema.methods.IsvalidatePassword = async function(usersendpassword) {
    return await bcrypt.compare(usersendpassword, this.password);
};

//$create and return jwt token
userSchema.methods.getJwtToken = function() {
    jwt.sign({ id: this._id, email: this._email }, process.env.JWT_TOKEN, {
        expiresIn: process.env.JWT_EXPIRY,
    }); //sign is used for creating the token
}; //this is here id id the field which is creating by us
//this._id is the id given by the mongoose or the database itself

//generate basic forgot password token (string)
userSchema.methods.getFogotPasswordToken = function() {
    //generate random a long long random string //@using NANOID package
    const forgotToken = crypto.randomBytes(20).toString("hex");

    //this is actually wea are generating a hash here as well as backend here
    this.forgotPasswordToken = crypto
        .createHash("sha256")
        .update(forgotToken)
        .digest("hex");

    //time of token
    this.forgotPasswordExpiry = Date.now() + 20 * 60 * 1000;

    //return the forgot token
    return forgotToken;
};
module.exports = mongoose.model("User", userSchema);