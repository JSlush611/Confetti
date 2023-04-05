const httpStatus = require("http-status-codes");

module.exports = {
respondNoResourceFound:(req, res) => {
    let errorCode = httpStatus.NOT_FOUND;
    res.status(errorCode);
    res.render("404")

},

respondInternalError:(error, req, res, next) => {
    let errorCode = httpStatus.INTERNAL_SERVER_ERROR;
    console.log(`ERROR Occured: ${error.stack}`);
    res.status(errorCode);
    res.render("500")
}};