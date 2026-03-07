"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.processParcelXWarehouseJob = void 0;
const handle_job_errors_1 = require("../../../../common/errors/handle.job.errors");
const parcel_module_1 = require("../../parcel.module");
//   jobs
const processParcelXWarehouseJob = async (job) => {
    try {
        const { warehouseId } = job.data;
        const result = await parcel_module_1.parcelXModule.parcelXWarehouseService.processParcelXWarehouse(job.data);
        return {
            warehouseId,
            success: true,
            message: result.message,
            parcelX: result,
        };
    }
    catch (error) {
        let parsedMessage = error?.message;
        if (typeof error?.message === "string") {
            try {
                parsedMessage = JSON.parse(error.message);
            }
            catch {
                parsedMessage = error.message;
            }
        }
        console.error(JSON.stringify({
            warehouseId: job.data.warehouseId,
            message: "Error processing ParcelX warehouse job",
            errorName: error?.name ?? null,
            statusCode: error?.statusCode ?? null,
            error: parsedMessage,
            stack: error?.stack ?? null,
        }));
        (0, handle_job_errors_1.handleJobError)(error);
    }
};
exports.processParcelXWarehouseJob = processParcelXWarehouseJob;
