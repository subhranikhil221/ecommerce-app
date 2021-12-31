//@ step-01 --- before that we do usually creation of file like .env and in the package.json folder
//@ step-02 --- after applying the port on .env local file here express the app starrted at app.js
const express = require("express");
const app = express(); // creation of app using express, initailising the app.js
var morgan = require("morgan");
const cookieParser = require("cookie-parser");
const fileupload = require("express-fileupload");

//documentation using swagger yaml
const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");
const swaggerDocument = YAML.load("./swagger.yaml");
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

//regular middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//for cookies and file middlewares
app.use(cookieParser());
app.use(
    fileupload({
        useTempFiles: true,
        tempFileDir: "/tmp",
    })
);
//#temp check
//#this is also called as the midlleware but not the real middleware called the view engine middleware
app.set("view engine", "ejs"); //setting up the ejs

// a morgan middle ware
app.use(morgan("tiny"));

//@ step-5 -- import all the routes here
const home = require("./routes/homeroute");
//@ importing the user.js from routes folder
const user = require("./routes/user");

//@ importing product route from route.js
const product = require("./routes/productroute");

//@ importing the payment route here
const payment = require("./routes/payment");

//@ importing the order route here
const order = require("./routes/order");

//router middleware for rejoing the  functions we are broken down into
app.use("/api/v1", home);
app.use("/api/v1", user);
app.use("/api/v1", product);
app.use("/api/v1", payment);
app.use("/api/v1", order);

//$signup test
app.get("/signuptest", (req, res) => {
    res.render("signuptest");
});

//export app.js for injecting at index.js
module.exports = app;