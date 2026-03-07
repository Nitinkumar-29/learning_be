"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.razorpayWebhookEvents = void 0;
const payment_captured_event_1 = require("./events/payment.captured.event");
const payment_authorized_event_1 = require("./events/payment.authorized.event");
exports.razorpayWebhookEvents = {
    "payment.authorized": payment_authorized_event_1.paymentAuthorizedHandlerEvent,
    "payment.captured": payment_captured_event_1.paymentCapturedHandlerEvent,
    "order.paid": payment_captured_event_1.paymentCapturedHandlerEvent,
};
