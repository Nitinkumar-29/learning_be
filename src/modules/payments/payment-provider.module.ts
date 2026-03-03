import { PaymentOrderDocumentRepository } from "./infrastructure/persistence/document/repositories/payment-order.repository";
import { PaymentGatewayController } from "./payment-provider.controller";
import { PaymentProviderService } from "./services/payment-provider.service";

const paymentOrderRepository = new PaymentOrderDocumentRepository();
const paymentService = new PaymentProviderService(paymentOrderRepository);
const paymentController = new PaymentGatewayController(paymentService);

export const PaymentGatewayModule = {
  paymentService,
  paymentController,
};
