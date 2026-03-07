"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleJobError = void 0;
const bullmq_1 = require("bullmq");
const job_errors_1 = require("../../modules/parcelx/errors/job.errors");
const http_error_1 = require("./http.error");
const handleJobError = (error) => {
    if (error instanceof job_errors_1.NonRetryableJobError) {
        throw new bullmq_1.UnrecoverableError(error.message || "Non-retryable error occurred while processing ParcelX job");
    }
    if (error instanceof http_error_1.HttpError && error.statusCode === 401) {
        throw new bullmq_1.UnrecoverableError("ParcelX auth failed (401)");
    }
    throw error;
};
exports.handleJobError = handleJobError;
