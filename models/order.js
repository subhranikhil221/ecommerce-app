const mongoose = require("mongoose");

//# just a dummy model for the wrtting an model for any section here
const orderSchema = new mongoose.Schema({
    //$ shipping info for the user who want to get the order
    shippingInfo: {
        address: {
            type: String,
            required: true,
        },
        city: {
            type: String,
            required: true,
        },
        phoneNo: {
            type: String,
            required: true,
        },
        postalCode: {
            type: String,
            required: true,
        },
        state: {
            type: String,
            required: true,
        },
        country: {
            type: String,
            required: true,
        },
    },
    //$ user who wants the delivery or whoi want to order
    user: {
        type: mongoose.Schema.ObjectId, //mongoose.Schema.Types.ObjectId
        ref: "User",
        required: true,
    },
    orderItems: [{
        name: {
            type: String,
            required: true,
        },
        quantity: {
            type: Number,
            required: true,
        },
        image: {
            type: String,
            required: true,
        },
        price: {
            type: Number,
            required: true,
        },
        product: {
            type: mongoose.Schema.ObjectId, //mongoose.Schema.Types.ObjectId
            ref: "Product",
            required: true,
        },
    }, ],
    paymentInfo: {
        id: {
            type: String,
        },
    },
    taxAmount: {
        type: Number,
        required: true,
    },
    shippingAmount: {
        type: Number,
        required: true,
    },
    totalAmount: {
        type: Number,
        required: true,
    },
    orderStatus: {
        type: String,
        required: true,
        default: "processing",
    },
    deliveredAt: {
        type: Date,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model("Order", orderSchema);

//@ ref link for the why we use schema over their and new object
// https://stackoverflow.com/questions/28997636/should-i-use-schema-types-objectid-or-schema-objectid-when-defining-a-mongoose-s