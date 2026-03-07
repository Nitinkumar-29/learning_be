"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentWebhookLogService = void 0;
class PaymentWebhookLogService {
    constructor(paymentWebhookLogsRepository) {
        this.paymentWebhookLogsRepository = paymentWebhookLogsRepository;
    }
    async isDuplicateEvent(provider, eventId) {
        if (!eventId) {
            return false;
        }
        const existing = await this.paymentWebhookLogsRepository.findProcessedByProviderEventId(provider, eventId);
        return Boolean(existing);
    }
    async upsertWebhookLog(payload) {
        return this.paymentWebhookLogsRepository.upsertWebhookLog(payload);
    }
    async markWebhookFailed({ provider, eventId, errorMessage, rawPayload, event, }) {
        return this.paymentWebhookLogsRepository.markWebhookFailed(provider, eventId, {
            errorMessage,
            rawPayload,
            event,
        });
    }
}
exports.PaymentWebhookLogService = PaymentWebhookLogService;
