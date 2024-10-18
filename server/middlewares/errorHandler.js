// errorHandler.js
const errorHandler = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const response = {
        success: false,
        statusCode,
        message: err.message || 'Internal Server Error',
        errors: err.errors || null,
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined, // Include stack trace in development only
    };

    res.status(statusCode).json(response);
};

export default errorHandler;
