"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NonRetryableJobError = void 0;
class NonRetryableJobError extends Error {
    constructor(message) {
        super(message);
        this.name = "NonRetryableJobError";
    }
}
exports.NonRetryableJobError = NonRetryableJobError;
