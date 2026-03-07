"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transactionType = exports.referenceType = exports.transactionStatus = void 0;
var transactionStatus;
(function (transactionStatus) {
    transactionStatus["PENDING"] = "pending";
    transactionStatus["COMPLETED"] = "completed";
    transactionStatus["FAILED"] = "failed";
})(transactionStatus || (exports.transactionStatus = transactionStatus = {}));
var referenceType;
(function (referenceType) {
    referenceType["ORDER"] = "order";
    referenceType["PAYMENT"] = "payment";
    referenceType["REFUND"] = "refund";
    referenceType["ADJUSTMENT"] = "adjustment";
    referenceType["WALLET_TOPUP"] = "wallet_topup";
})(referenceType || (exports.referenceType = referenceType = {}));
var transactionType;
(function (transactionType) {
    transactionType["CREDIT"] = "credit";
    transactionType["HOLD"] = "hold";
    transactionType["DEBIT"] = "debit";
    transactionType["RELEASE"] = "release";
    transactionType["REFUND"] = "refund";
    transactionType["ADJUSTMENT"] = "adjustment";
})(transactionType || (exports.transactionType = transactionType = {}));
