"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentGatewayModule = void 0;
const payment_order_repository_1 = require("./infrastructure/persistence/document/repositories/payment-order.repository");
const payment_transaction_repositor_1 = require("./infrastructure/persistence/document/repositories/payment-transaction.repositor");
const payment_webhook_logs_repository_1 = require("./infrastructure/persistence/document/repositories/payment-webhook-logs.repository");
const payment_provider_controller_1 = require("./payment-provider.controller");
const payment_provider_service_1 = require("./services/payment-provider.service");
const payment_webhook_log_service_1 = require("./services/payment-webhook-log.service");
const paymentOrderRepository = new payment_order_repository_1.PaymentOrderDocumentRepository();
const paymentTransactionRepository = new payment_transaction_repositor_1.PaymentTransactionDocumentRepository();
const paymentWebhookLogsRepository = new payment_webhook_logs_repository_1.PaymentWebhookLogsDocumentRepository();
const paymentWebhookLogService = new payment_webhook_log_service_1.PaymentWebhookLogService(paymentWebhookLogsRepository);
const paymentService = new payment_provider_service_1.PaymentProviderService(paymentOrderRepository, paymentTransactionRepository, paymentWebhookLogService);
const paymentController = new payment_provider_controller_1.PaymentGatewayController(paymentService);
exports.PaymentGatewayModule = {
    paymentService,
    paymentController,
};
