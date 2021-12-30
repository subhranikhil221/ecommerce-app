//@ step-o4 home route creation for handling the all route that come at homepage
//the module is of express.js itself
const express = require("express");
const router = express.Router();

const { home, homeDummy } = require("../controller/homecontroller");
//# bring the controller from the homecontroller and paste is here
router.route("/").get(home);
router.route("/dummyroute").get(homeDummy);

//% export this from here
module.exports = router;