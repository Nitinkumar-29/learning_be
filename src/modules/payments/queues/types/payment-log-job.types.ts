import {
  CreateOrderRequestLogDto,
  CreateOrderResponseLogDto,
  CreateTransactionRequestLogDto,
  CreateTransactionResponseLogDto,
} from "../../infrastructure/persistence/document/types/payment.logs.types";
import { paymentLogJobNames } from "../constants/payment-log.queue.constants";

export type PaymentLogJobData =
  | {
      jobName: typeof paymentLogJobNames.CREATE_ORDER_REQUEST;
      payload: CreateOrderRequestLogDto;
    }
  | {
      jobName: typeof paymentLogJobNames.CREATE_ORDER_RESPONSE;
      payload: CreateOrderResponseLogDto;
    }
  | {
      jobName: typeof paymentLogJobNames.CREATE_TXN_REQUEST;
      payload: CreateTransactionRequestLogDto;
    }
  | {
      jobName: typeof paymentLogJobNames.CREATE_TXN_RESPONSE;
      payload: CreateTransactionResponseLogDto;
    };

