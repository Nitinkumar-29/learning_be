import { PaymentOrderDocumentRepository } from "./infrastructure/persistence/document/repositories/payment-order.repository";
import { PaymentTransactionDocumentRepository } from "./infrastructure/persistence/document/repositories/payment-transaction.repositor";
import { PaymentWebhookLogsDocumentRepository } from "./infrastructure/persistence/document/repositories/payment-webhook-logs.repository";
import { PaymentGatewayController } from "./payment-provider.controller";
import { PaymentProviderService } from "./services/payment-provider.service";
import { PaymentWebhookLogService } from "./services/payment-webhook-log.service";

const paymentOrderRepository = new PaymentOrderDocumentRepository();
const paymentTransactionRepository = new PaymentTransactionDocumentRepository();
const paymentWebhookLogsRepository = new PaymentWebhookLogsDocumentRepository();
const paymentWebhookLogService = new PaymentWebhookLogService(
  paymentWebhookLogsRepository,
);
const paymentService = new PaymentProviderService(
  paymentOrderRepository,
  paymentTransactionRepository,
  paymentWebhookLogService,
);
const paymentController = new PaymentGatewayController(paymentService);

export const PaymentGatewayModule = {
  paymentService,
  paymentController,
};
