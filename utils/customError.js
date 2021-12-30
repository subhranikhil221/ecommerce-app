//@ customize the error using our own using this and super keyword

class CustomError extends Error {
    constructor(message, code) {
        super(message);
        this.code = code;
    }
}

module.exports = CustomError;