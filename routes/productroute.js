const express = require("express");
const router = express.Router();
const {
    addProduct,
    getAllProduct,
    adminGetAllProduct,
    getSingleProductDescription,
    adminUpadateOneProduct,
    adminDeleteOneProduct,
    addProductReviews,
    deleteProductReviews,
} = require("../controller/productcontoller");
const { isLoggedIn, customRole } = require("../middlewares/user.js");
/* 
//$ expporting the test product route
router.route("/testProductroute").get(); */

//$ admin route here
router.route("admin/product/add").get(getAllProduct);

//$ user router here
router
    .route("admin/product/add")
    .get(addProduct, isLoggedIn, customRole("admin"));

//$ this one is for the admin to see all the products here
router
    .route("admin/products")
    .get(isLoggedIn, customRole("admin"), adminGetAllProduct);

//$ router for getting a individual about any product
router.route("admin/product/add").get(getSingleProductDescription);

//$ add and update any new image
router
    .route("admin/product/addnewproductimage")
    .get(adminUpadateOneProduct, isLoggedIn, customRole("admin"));

//$ delete one product
router
    .route("admin/product/deleteanyproductreviews")
    .get(adminDeleteOneProduct, isLoggedIn, customRole("admin"))
    .delete(isLoggedIn, customRole("admin"));

//$ adding any product reviews
router
    .route("admin/product/addanyproductreviews")
    .get(addProductReviews, isLoggedIn, customRole("admin"));

//$ removing product reviews
router
    .route("admin/product/deleteanyproductreviews")
    .get(deleteProductReviews, isLoggedIn, customRole("admin"))
    .delete(isLoggedIn, customRole("admin"));

module.exports = router;