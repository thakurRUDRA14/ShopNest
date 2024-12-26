class ApiError extends Error {

    constructor(statusCode = 500, message = "An unexpected error occurred", errors = [], data = null, stack = "") {
        super(message);
        this.statusCode = statusCode;
        this.message = message;
        this.success = false;
        this.errors = Array.isArray(errors) ? errors : [errors];
        this.data = data;

        // Assign the stack trace
        if (stack) {
            this.stack = stack;
        } else {
            Error.captureStackTrace(this, this.constructor);
        }
    }

    static fromValidationErrors(validationErrors) {
        return new ApiError(400, "Validation failed", validationErrors);
    }

    static notFound(resource = "Resource") {
        return new ApiError(404, `${resource} not found`);
    }

    static unauthorized() {
        return new ApiError(401, "Unauthorized access");
    }

    toJSON() {
        return {
            statusCode: this.statusCode,
            message: this.message,
            success: this.success,
            errors: this.errors,
            data: this.data,
        };
    }
}

export { ApiError };
