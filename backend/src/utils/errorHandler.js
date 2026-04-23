export function errorHandler(err, req, res, next) {
    console.error('Error:', err);

    if (err.type === 'VALIDATION_ERROR') {
        return res.status(400).json({
            success: false,
            message: err.message,
            data: null
        });
    }

    if (err.code === '23505') {
        return res.status(409).json({
            success: false,
            message: 'Duplicate entry',
            data: null
        });
    }

    if (err.code === '23503') {
        return res.status(400).json({
            success: false,
            message: 'Referenced record not found',
            data: null
        });
    }

    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal server error';

    res.status(statusCode).json({
        success: false,
        message,
        data: null
    });
}

export function asyncHandler(fn) {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
}

export class AppError extends Error {
    constructor(message, statusCode = 500) {
        super(message);
        this.statusCode = statusCode;
        this.type = 'APP_ERROR';
    }
}

export class ValidationError extends Error {
    constructor(message) {
        super(message);
        this.statusCode = 400;
        this.type = 'VALIDATION_ERROR';
    }
}