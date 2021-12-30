//$ if someone is stuck or forgot the password then send an mail with the token if rthe token andthe otp is matched
//$ then simply match the data and  allow for the changing the password here

const nodemailer = require("nodemailer");

const mailhelper = async(option) => {
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_POST,
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.SMTP_USER, // generated ethereal user
            pass: process.env.SMTP_PASS, // generated ethereal password
        },
    });

    const message = {
        from: "nikhil2001@gmail.com", // sender address
        to: "bar@example.com, baz@example.com", // list of receivers
        subject: option.subject, // Subject line
        text: option.message, // plain text body
    };

    // send mail with defined transport object
    await transporter.sendMail(message);
};
module.exports = mailhelper;