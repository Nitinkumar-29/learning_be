import { Job } from "bullmq";
import {
  warehouseJobTypeEnums,
  warehouseStatusType,
} from "../../../../common/enums/warehouse.enum";
import { handleJobError } from "../../../../common/errors/handle.job.errors";
import { RegisterParcelXWarehouseDto } from "../../infrastructure/persistence/document/types/parcelx-log.types";
import { parcelXModule } from "../../parcel.module";

// base job
interface BaseWarehouseJob {
  warehouseId: string;
  userId: string;
}

// register warehouse job
export interface RegisterWarehouseJobData extends BaseWarehouseJob {
  type: warehouseJobTypeEnums.REGISTER_WAREHOUSE;
  parcelXPayload: RegisterParcelXWarehouseDto;
}

// remove warehouse job
export interface RemoveWarehouseJobData extends BaseWarehouseJob {
  type: warehouseJobTypeEnums.REMOVE_WAREHOUSE;
  previousStatus: warehouseStatusType;
  opId: string;
}

// union type
export type ParcelXWarehouseJobData =
  | RegisterWarehouseJobData
  | RemoveWarehouseJobData;

//   jobs
export // process job
const processParcelXWarehouseJob = async (
  job: Job<ParcelXWarehouseJobData>,
) => {
  try {
    const { warehouseId } = job.data;
    const result =
      await parcelXModule.parcelXWarehouseService.processParcelXWarehouse(
        job.data,
      );
    return {
      warehouseId,
      success: true,
      message: result.message,
      parcelX: result,
    };
  } catch (error: any) {
    let parsedMessage: unknown = error?.message;
    if (typeof error?.message === "string") {
      try {
        parsedMessage = JSON.parse(error.message);
      } catch {
        parsedMessage = error.message;
      }
    }

    console.error(
      JSON.stringify({
        warehouseId: job.data.warehouseId,
        message: "Error processing ParcelX warehouse job",
        errorName: error?.name ?? null,
        statusCode: error?.statusCode ?? null,
        error: parsedMessage,
        stack: error?.stack ?? null,
      }),
    );
    handleJobError(error);
  }
};
