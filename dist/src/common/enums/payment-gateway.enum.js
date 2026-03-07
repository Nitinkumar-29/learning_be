"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.paymentEventEnums = exports.paymentLogOperationEnums = exports.paymentEntityTypeEnums = exports.paymentLogStatusEnums = exports.paymentLogStageEnums = exports.paymentTransactionStatusEnums = exports.paymentOrderStatusEnums = exports.paymentModeEnums = exports.paymentProviderEnums = void 0;
var paymentProviderEnums;
(function (paymentProviderEnums) {
    paymentProviderEnums["RAZORPAY"] = "razorpay";
    paymentProviderEnums["PAYU"] = "payu";
    paymentProviderEnums["STRIPE"] = "stripe";
})(paymentProviderEnums || (exports.paymentProviderEnums = paymentProviderEnums = {}));
var paymentModeEnums;
(function (paymentModeEnums) {
    paymentModeEnums["UPI"] = "upi";
    paymentModeEnums["INTERNET_BANKING"] = "internet_banking";
    paymentModeEnums["OTHER"] = "other";
})(paymentModeEnums || (exports.paymentModeEnums = paymentModeEnums = {}));
var paymentOrderStatusEnums;
(function (paymentOrderStatusEnums) {
    paymentOrderStatusEnums["ORDER_INITIATED"] = "order_initiated";
    paymentOrderStatusEnums["ORDER_PROCESSING"] = "order_processing";
    paymentOrderStatusEnums["ORDER_CREATED"] = "order_created";
    paymentOrderStatusEnums["ORDER_FAILED"] = "order_failed";
    paymentOrderStatusEnums["ORDER_COMPLETED"] = "order_completed";
    paymentOrderStatusEnums["ORDER_EXPIRED"] = "order_expired";
})(paymentOrderStatusEnums || (exports.paymentOrderStatusEnums = paymentOrderStatusEnums = {}));
var paymentTransactionStatusEnums;
(function (paymentTransactionStatusEnums) {
    paymentTransactionStatusEnums["PAYMENT_PENDING"] = "payment_pending";
    paymentTransactionStatusEnums["PAYMENT_SUCCESS"] = "payment_success";
    paymentTransactionStatusEnums["PAYMENT_FAILED"] = "payment_failed";
})(paymentTransactionStatusEnums || (exports.paymentTransactionStatusEnums = paymentTransactionStatusEnums = {}));
var paymentLogStageEnums;
(function (paymentLogStageEnums) {
    paymentLogStageEnums["REQUEST"] = "request";
    paymentLogStageEnums["RESPONSE"] = "response";
})(paymentLogStageEnums || (exports.paymentLogStageEnums = paymentLogStageEnums = {}));
var paymentLogStatusEnums;
(function (paymentLogStatusEnums) {
    paymentLogStatusEnums["PENDING"] = "pending";
    paymentLogStatusEnums["SUCCESS"] = "success";
    paymentLogStatusEnums["FAILURE"] = "failure";
})(paymentLogStatusEnums || (exports.paymentLogStatusEnums = paymentLogStatusEnums = {}));
var paymentEntityTypeEnums;
(function (paymentEntityTypeEnums) {
    paymentEntityTypeEnums["ORDER"] = "order";
    paymentEntityTypeEnums["TRANSACTION"] = "transaction";
})(paymentEntityTypeEnums || (exports.paymentEntityTypeEnums = paymentEntityTypeEnums = {}));
var paymentLogOperationEnums;
(function (paymentLogOperationEnums) {
    paymentLogOperationEnums["CREATE_ORDER"] = "create_order";
    paymentLogOperationEnums["FETCH_PAYMENT_STATUS"] = "fetch_payment_status";
    paymentLogOperationEnums["VERIFY_WEBHOOK"] = "verify_webhook";
    paymentLogOperationEnums["CREATE_TRANSACTION"] = "create_transaction";
})(paymentLogOperationEnums || (exports.paymentLogOperationEnums = paymentLogOperationEnums = {}));
var paymentEventEnums;
(function (paymentEventEnums) {
    paymentEventEnums["ORDER_INITIATED"] = "order_initiated";
    paymentEventEnums["ORDER_CREATION_REQUESTED"] = "order_creation_requested";
    paymentEventEnums["ORDER_CREATED"] = "order_created";
    paymentEventEnums["ORDER_CREATION_FAILED"] = "order_creation_failed";
    paymentEventEnums["TRANSACTION_CREATED"] = "transaction_created";
    paymentEventEnums["PAYMENT_PENDING"] = "payment_pending";
    paymentEventEnums["PAYMENT_FAILED"] = "payment_failed";
    paymentEventEnums["PAYMENT_SUCCESS"] = "payment_success";
    paymentEventEnums["WEBHOOK_RECEIVED"] = "webhook_received";
})(paymentEventEnums || (exports.paymentEventEnums = paymentEventEnums = {}));
