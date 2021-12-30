const express = require("express");
const router = express.Router();

const {
    signup,
    login,
    logout,
    forgotPassword,
    resetPassword,
    getLoggedInUserDetails,
    changePassword,
    updateUserDetails,
    adminAllUsers,
    managerAllUsers,
    adminGetSingleUser,
    adminUpdateSingleUser,
    deleteAnyUser,
} = require("../controller/usercontroller");

const { isLoggedIn, customRole } = require("../middlewares/user");

router.route("/signup").post(signup);
router.route("/login").post(login);
router.route("/logout").get(logout);
router.route("/forgotPassword").post(forgotPassword);
router.route("/password/reset/:token").post(resetPassword);
router.route("/userdashboard").get(isLoggedIn, getLoggedInUserDetails);
router.route("/updatepassword").get(isLoggedIn, changePassword);
router.route("/updateUserDetails").get(updateUserDetails);
//$ needs to export the customrole method to the user controller
router
    .route("/adminuserupdate")
    .get(isLoggedIn, customRole("admin"), adminAllUsers);

//$ manager only route
router
    .route("/manageronly")
    .get(isLoggedIn, customRole("manager"), managerAllUsers);

router
    .route("/admingetdataonly")
    .get(isLoggedIn, customRole("admin "), adminGetSingleUser)
    .put(isLoggedIn, customRole("admin"), adminUpdateSingleUser); //$ this is done by the admin for edit the data of any user

router
    .route("/deleteanyuser")
    .get(isLoggedIn, customRole("manager"), deleteAnyUser);

//export the router
module.exports = router;