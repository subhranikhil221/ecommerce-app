//$ using razorpay and the stripe
//$ and also using the bigpromise only

const BigPromise = require("../middlewares/bigPromise");
const stripe = require("stripe")(process.env.STRIPE_SECRET);
const Razorpay = require("razorpay");

//# sending the razorpay or strope secret key
exports.sendStripeKey = BigPromise(async(req, res, next) => {
    //# sends a json response
    res.status(200).json({
        stripekey: process.env.STRIPE_API_KEY,
    });
});

//# capture the payment
exports.captureStripePayment = BigPromise(async(req, res, next) => {
    const paymentIntent = await stripe.paymentIntents.create({
        amount: req.body.amount,
        currency: "inr",

        //optional
        metadata: { integration_check: "accept_a_payment" },
    });

    //# this is the paymentintent response sends after successfull  payment
    res.status(200).json({
        success: true,
        amount: req.body.amount,
        client_secret: paymentIntent.client_secret,
        //you can optionally send id as well
    });
});

//# sends the razorpaykey
exports.sendRazorpayKey = BigPromise(async(req, res, next) => {
    res.status(200).json({
        razorpaykey: process.env.RAZORPAY_API_KEY,
    });
});

//# capturing the razorpay payment after orderong something
exports.captureRazorpayPayment = BigPromise(async(req, res, next) => {
    var instance = new Razorpay({
        key_id: process.env.RAZORPAY_API_KEY,
        key_secret: process.env.RAZORPAY_SECRET,
    });

    var options = {
        amount: req.body.amount, // amount in the smallest currency unit
        currency: "INR",
        // receipt:  this may be printed after the instructions of successful payment here
    };
    const myOrder = await instance.orders.create(options);

    res.status(200).json({
        success: true,
        amount: req.body.amount,
        order: myOrder,
    });
});