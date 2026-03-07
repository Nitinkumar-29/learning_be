"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentWebhookLogsDocumentRepository = void 0;
const webhook_logs_schema_1 = require("../schemas/webhook-logs.schema");
class PaymentWebhookLogsDocumentRepository {
    async findProcessedByProviderEventId(provider, eventId) {
        return webhook_logs_schema_1.WebhookLogsModel.findOne({ provider, eventId, processed: true });
    }
    async upsertWebhookLog(payload) {
        const key = payload.eventId != null
            ? { provider: payload.provider, eventId: payload.eventId }
            : null;
        if (!key) {
            return webhook_logs_schema_1.WebhookLogsModel.create({
                ...payload,
                processed: payload.eventState === "processed" || payload.eventState === "ignored",
                processedAt: payload.eventState === "processed" || payload.eventState === "ignored"
                    ? new Date()
                    : null,
            });
        }
        return webhook_logs_schema_1.WebhookLogsModel.findOneAndUpdate(key, {
            $set: {
                event: payload.event,
                eventState: payload.eventState,
                refId: payload.refId,
                providerOrderId: payload.providerOrderId,
                paymentId: payload.paymentId,
                status: payload.status,
                amountInPaise: payload.amountInPaise,
                currency: payload.currency,
                rawPayload: payload.rawPayload,
                processed: payload.eventState === "processed" || payload.eventState === "ignored",
                processedAt: payload.eventState === "processed" || payload.eventState === "ignored"
                    ? new Date()
                    : null,
            },
            $setOnInsert: {
                provider: payload.provider,
                eventId: payload.eventId,
            },
        }, { upsert: true, returnDocument: "after" });
    }
    async markWebhookFailed(provider, eventId, payload) {
        if (!eventId) {
            return webhook_logs_schema_1.WebhookLogsModel.create({
                provider,
                event: payload.event || "unknown",
                eventId: null,
                eventState: "failed",
                processed: false,
                errorMessage: payload.errorMessage,
                rawPayload: payload.rawPayload ?? null,
            });
        }
        return webhook_logs_schema_1.WebhookLogsModel.findOneAndUpdate({ provider, eventId }, {
            $set: {
                event: payload.event || "unknown",
                eventState: "failed",
                processed: false,
                errorMessage: payload.errorMessage,
                rawPayload: payload.rawPayload ?? null,
            },
            $setOnInsert: { provider, eventId },
        }, { upsert: true, returnDocument: "after" });
    }
}
exports.PaymentWebhookLogsDocumentRepository = PaymentWebhookLogsDocumentRepository;
