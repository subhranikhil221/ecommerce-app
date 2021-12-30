const app = require("./app");
const connectionwithdb = require("./config/db");
require("dotenv").config(); //! with out this the server under this is not running here

//#connecting to the cloudnary image uploading is done here
const cloudinary = require("cloudinary");

// $ connect with the database
connectionwithdb();

//$ cloudionary config begains here
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secretkey: process.env.CLOUDINARY_API_SECRET,
});

//# listening the port or to confiurm the app is running or not
app.listen(process.env.PORT, () => {
    console.log(`server is running here !!!! localhost ${process.env.PORT}`);
});