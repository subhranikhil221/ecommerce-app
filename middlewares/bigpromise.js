//@ why we use this for the try and catch , async ,await

module.exports = (func) => (req, res, next) =>
    Promise.resolve(func(req, res, next)).catch();

//so this bigpromises takes a function and try to execute in a promise

//$ if we dont want to use async and wait function then we can use the promise but this promiise needs to be rapped around the file
//$ or in tthe anothe rfile it self otherwise use the async and await function here