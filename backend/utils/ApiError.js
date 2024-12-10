class ApiError extends Error {
    /**
     * Custom error for API responses.
     * @param {number} statusCode - HTTP status code.
     * @param {string} message - Error message.
     * @param {Array|Object} errors - Additional error details or validations.
     * @param {Object|null} data - Additional data related to the error.
     * @param {string} [stack] - Error stack trace.
     */
    constructor(statusCode = 500, message = "An unexpected error occurred", errors = [], data = null, stack = "") {
        super(message);
        this.statusCode = statusCode;
        this.message = message;
        this.success = false;
        this.errors = Array.isArray(errors) ? errors : [errors]; // Normalize errors to an array
        this.data = data; // Additional contextual data

        // Assign the stack trace
        if (stack) {
            this.stack = stack;
        } else {
            Error.captureStackTrace(this, this.constructor);
        }
    }

    /**
     * Static method for validation error creation.
     * @param {Array} validationErrors - List of validation errors.
     * @returns {ApiError}
     */
    static fromValidationErrors(validationErrors) {
        return new ApiError(400, "Validation failed", validationErrors);
    }

    /**
     * Static method for creating not-found errors.
     * @param {string} resource - The resource that was not found.
     * @returns {ApiError}
     */
    static notFound(resource = "Resource") {
        return new ApiError(404, `${resource} not found`);
    }

    /**
     * Static method for creating unauthorized errors.
     * @returns {ApiError}
     */
    static unauthorized() {
        return new ApiError(401, "Unauthorized access");
    }

    /**
     * Returns a plain object representation of the error.
     * @returns {Object}
     */
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
