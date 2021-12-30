/* exports.testProduct = (req, res) => {
    console.log(req.query);
    res.status(200).json({
        sucess: true,
        greeting: "hello !! this is a test product",
    });
}; */

const BigPromise = require("../middlewares/bigpromise");
const CustomError = require("../utils/customError");
const cloudinary = require("cloudinary");
const product = require("../models/product");
const WhereClause = require("../utils/whereclause");
const oneProduct = require("../controller/productcontoller");

//$ addding a product to the website just like the signup of an user here
exports.addProduct = BigPromise(async(req, res, next) => {
    //images handling with an array
    let imageArray = [];

    if (!req.files) {
        return next(new CustomError("images are required", 401));
    }
    if (!req.files) {
        for (let index = 0; index < req.length; index++) {
            //const element = req.files.photos[index];
            let result = await cloudinary.v2.uploader(
                req.files.photos[index].tempFilePath, {
                    folder: "products",
                }
            );

            imageArray.push({
                id: result.public_id,
                secure_url: result.secure_url,
            });
        }
    }

    req.body.photos = imageArray;
    req.body.user = req.user.id;

    const product = await product.create(req.body);
    res.status(200).json({
        success: true,
        product,
    });
});

//$ getting all products from the side of the bar which is opne to every one here to see the product name and all
exports.getAllProduct = BigPromise(async(req, res, next) => {
    const resultPerPage = 4;

    //@ const countProduct = await product.countDocument()
    const products = new WhereClause(product.find().req.query).search().filter();

    const totalCountProduct = await product.countDocuments();
    const filteredProductNumber = products.length;

    products.limit().skip();

    products.pager(resultPerPage);
    const product = product.find({});
    products = await products.base;

    res.status(200).json({
        success: true,
        products,
        filteredProductNumber,
        totalCountProduct,
    });
});

//# this all are admin contoller  routers here
//$ contoller for the admin to get all infromation about the product this is for the admin only
exports.adminGetAllProduct = BigPromise(async(req, res, next) => {
    const product = await product.find();

    //#if we dnt find any product here so using if else
    if (!product) {}

    res.status(200).json({
        sucess: true,
        products,
    });
});

//$ getting the single product description here
exports.getSingleProductDescription = BigPromise(async(req, res, next) => {
    const product = product.findById(req.params.id);

    //# checkout
    if (!product) {
        return next(new CustomError("no product id found", 401));
    }

    res.status(200).json({
        success: true,
        product,
    });
});

//$ update all the photos of the products
exports.adminUpadateOneProduct = BigPromise(async(res, req, next) => {
    const oneProduct = await product.find(req.params.id);

    if (!oneProduct) {
        return next(new CustomError("no product found in  this id", 401));
    }
    let imageArray = [];

    if (req.files) {
        //if exist then destroy the exsiting image
        for (let index = 0; index < product.photos.length; index++) {
            //accessing the existing photo here
            const res = await cloudinary.v2.uploader.destroy(
                product.photos[index].id
            );
        }

        //and uploading the new image here
        if (!req.files) {
            return next(new CustomError("images are required", 401));
        }

        for (let index = 0; index < req.length; index++) {
            //const element = req.files.photos[index];
            let result = await cloudinary.v2.uploader(
                req.files.photos[index].tempFilePath, {
                    folder: "products",
                }
            );

            imageArray.push({
                id: result.public_id,
                secure_url: result.secure_url,
            });
        }

        req.body.photos = imageArray;

        const product = await product.findByIdAndUpdate(req.body.params, req.body, {
            new: true,
            runValidators: true,
            useFindAndModify: false,
        });

        res.status(200).json({
            success: true,
            product,
        });
    }
});

//$ delete any product by the admin
exports.adminDeleteOneProduct = BigPromise(async(res, req, next) => {
    const deleteProduct = await product.find(req.params.id);

    if (!deleteProduct) {
        return next(new CustomError("no product found in  this id", 401));
    }
    if (req.files) {
        //if exist then destroy the exsiting image
        for (let index = 0; index < product.photos.length; index++) {
            //accessing the existing photo here
            const res = await cloudinary.v2.uploader.destroy(
                product.photos[index].id
            );
        }
    }

    await product.remove();

    const product = await product.findByIdAndUpdate(req.body.params, req.body, {
        new: true,
        runValidators: true,
        useFindAndModify: false,
    });

    res.status(200).json({
        success: true,
        message: "photo is deleted",
    });
});

//$ adding the reviews
exports.addProductReviews = BigPromise(async(res, req, next) => {
    const { rating, comment, productId } = req.body;

    //$ need this parameter to be passed here
    const review = {
        user: req.user._id,
        name: req.user.name,
        rating: Number(rating),
        comment,
    };

    //$ product to be reviewd
    const productToBeReviwed = await product.findById(productId);

    //$ checking if the user is already reviewd or not
    const AlreadyReviewed = product.reviews.find(
        (rev) => rev.user === req.user._id.toString()
    );

    if (AlreadyReviewed) {
        product.reviews.forEach((review) => {
            if (review.user.toString() === req.user._id.toString()) {
                review.comment = comment;
                review.rating = rating;
            }
        });
    } else {
        product.review.push(review);
        product.numberOfReviews = product.reviews.length;
    }

    //$ adjust the rating here
    product.rating =
        product.reviews.reduce((acc, item) => item.rating + acc, 0) /
        product.reviews.length;

    //$ save the ratings
    await product.Save({ validateBeforeSave: false });

    res.status(200).json({
        success: true,
        message: "reviwes are added sucessfully !!",
    });
});

//$ deleting and updating the reviews
exports.deleteProductReviews = BigPromise(async(req, res, next) => {
    const { productId } = req.body;

    //$ product to be reviewd
    const productToBeReviwed = await product.findById(productId);
    const reviews = product.reviews.filter(
        (rev) => rev.user === req.user._id.toString()
    );

    const numberOfReviews = reviews.length;

    //$ adjust the rating here
    product.rating =
        product.reviews.reduce((acc, item) => item.rating + acc, 0) /
        product.reviews.length;

    //$ update the ratings after ratings
    await product.findById(
        productId, {
            reviews,
            ratings,
            numberOfReviews,
        }, {
            new: true,
            runValidators: true,
            useFindAndModify: true,
        }
    );

    res.status(200).json({
        success: true,
        message: "reviwes are deleted sucessfully !!",
    });
});