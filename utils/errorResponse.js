const errorResponse = (res, statusCode, message, error = null) => {
    return res.status(statusCode).json({
        success: false,
        message,
        // error,
    });
};

module.exports = errorResponse;
