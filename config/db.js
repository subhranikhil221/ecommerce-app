const mongoose = require("mongoose");
//connecting to the database insie the config file and here we goes to the  server of mongoose
const connectionwithdb = () => {
    mongoose
        .connect(process.env.DB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        .then(console.log("db got connected"))
        .catch((error) => {
            console.log("db creates an issue");
            console.log(error);
            process.exit(1);
        });
};

module.exports = connectionwithdb;