import { UnrecoverableError } from "bullmq";
import { NonRetryableJobError } from "../../modules/parcelx/errors/job.errors";
import { HttpError } from "./http.error";

export const handleJobError = (error: unknown): never => {
  if (error instanceof NonRetryableJobError) {
    throw new UnrecoverableError(
      error.message || "Non-retryable error occurred while processing ParcelX job",
    );
  }

  if (error instanceof HttpError && error.statusCode === 401) {
    throw new UnrecoverableError("ParcelX auth failed (401)");
  }

  throw error;
};