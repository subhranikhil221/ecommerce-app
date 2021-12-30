const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "please provide the product name"],
        trim: true,
        maxlength: [120, "product name should not be of 120 character "],
    },
    price: {
        type: Number,
        required: [true, "please provide the product price"],
        maxlength: [5, "product price should not be of more than 5 digit "],
    },
    description: {
        type: String,
        required: [true, "please provide the product description"],
        trim: true,
    },
    photos: [{
        id: {
            type: String,
            required: true,
        },
        secure_url: {
            type: String,
            required: true,
        },
    }, ],

    catagory: {
        type: String,
        required: [
            true,
            "please select the catagory from- short-sleeves, long-sleevs, hoodies",
        ],
        enum: {
            values: ["shortsleeves", "longsleeves", "sweatshirt", "hoodies"],
            message: "please select caagory from the product list provide above",
        },
    },
    brand: {
        type: String,
        required: [true, "please provide the product brand"],
        trim: true,
    },
    ratings: {
        type: Number,
        default: 0,
        required: [true, "please provide the product rating"],
    },
    numberOfReviews: {
        type: Number,
        default: 0,
    },
    reviews: [{
        user: {
            type: mongoose.Schema.ObjectId,
            ref: "User",
            required: true,
        },
        name: {
            type: String,
            required: true,
        },
        rating: {
            type: Number,
            required: true,
        },
        comment: {
            type: String,
            required: true,
        },
    }, ],
    user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    },
});

module.exports = mongoose.model("product", productSchema);