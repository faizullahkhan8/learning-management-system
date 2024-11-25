class ErrorHandler extends Error {
    statusCode: number;

    // Constructor with specific types for message and statusCode
    constructor(message: string, statusCode: number) {
        super(message);
        this.statusCode = statusCode;

        this.name = this.constructor.name; // Set error name to the class name ("ErrorHandler")
        Error.captureStackTrace(this, this.constructor);
    }
}

export default ErrorHandler;
