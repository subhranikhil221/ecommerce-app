const Order = require("../models/order");
const Product = require("../models/product");

const BigPromise = require("../middlewares/bigPromise");
const CustomError = require("../utils/customError");

//# creating a order using the models things which are already mentioned
//$ like shiping info and other etc etc  ....
exports.createOrder = BigPromise(async(req, res, next) => {
    const {
        shippingInfo,
        orderItems,
        paymentInfo,
        taxAmount,
        shippingAmount,
        totalAmount,
    } = req.body;

    //# user's order in the cart
    const order = await Order.create({
        shippingInfo,
        orderItems,
        paymentInfo,
        taxAmount,
        shippingAmount,
        totalAmount,
        user: req.user._id,
    });

    res.status(200).json({
        success: true,
        order,
    });
});

//$ checking the single object is present or not
exports.getOneOrder = BigPromise(async(req, res, next) => {
    const order = await Order.findById(req.params.id).populate(
        "user",
        "name email"
    );

    if (!order) {
        return next(new CustomError("please check order id", 401));
    }

    res.status(200).json({
        success: true,
        order,
    });
});

//$ get the orders of the logged in users here
exports.getLoggedInOrders = BigPromise(async(req, res, next) => {
    const order = await Order.find({ user: req.user._id });

    if (!order) {
        return next(new CustomError("please check order id", 401));
    }

    res.status(200).json({
        success: true,
        order,
    });
});

//$ admin get controllers
//# admin get all orders here
exports.admingetAllOrders = BigPromise(async(req, res, next) => {
    const orders = await Order.find();

    res.status(200).json({
        success: true,
        orders,
    });
});

//$ admin can update the order shipping or many other query asked by the user
exports.adminUpdateOrder = BigPromise(async(req, res, next) => {
    const order = await Order.findById(req.params.id);

    if (order.orderStatus === "Delivered") {
        return next(new CustomError("Order is already marked for delivered", 401));
    }

    order.orderStatus = req.body.orderStatus;

    order.orderItems.forEach(async(prod) => {
        await updateProductStock(prod.product, prod.quantity);
    });

    await order.save();

    res.status(200).json({
        success: true,
        order,
    });
});

exports.adminDeleteOrder = BigPromise(async(req, res, next) => {
    const order = await Order.findById(req.params.id);

    await order.remove();

    res.status(200).json({
        success: true,
    });
});

//$ update the quantity in the stock or cart
async function updateProductStock(productId, quantity) {
    const product = await Product.findById(productId);

    product.stock = product.stock - quantity;

    await product.save({ validateBeforeSave: false });
}