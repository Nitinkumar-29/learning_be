"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderStatus = exports.addressType = exports.paymentMethods = exports.courierCode = exports.expressTypes = void 0;
var expressTypes;
(function (expressTypes) {
    expressTypes["SURFACE"] = "surface";
    expressTypes["AIR"] = "air";
    expressTypes["SEA"] = "sea";
})(expressTypes || (exports.expressTypes = expressTypes = {}));
var courierCode;
(function (courierCode) {
    courierCode[courierCode["ZERO"] = 0] = "ZERO";
    courierCode[courierCode["ONE"] = 1] = "ONE";
})(courierCode || (exports.courierCode = courierCode = {}));
var paymentMethods;
(function (paymentMethods) {
    paymentMethods["COD"] = "COD";
    paymentMethods["PREPAID"] = "PREPAID";
})(paymentMethods || (exports.paymentMethods = paymentMethods = {}));
var addressType;
(function (addressType) {
    addressType["HOME"] = "HOME";
    addressType["WORK"] = "WORK";
    addressType["OTHER"] = "OTHER";
})(addressType || (exports.addressType = addressType = {}));
var orderStatus;
(function (orderStatus) {
    orderStatus["PENDING"] = "pending";
    orderStatus["CANCELLED"] = "cancelled";
    orderStatus["COMPLETED"] = "completed";
    orderStatus["RETURNED"] = "returned";
})(orderStatus || (exports.orderStatus = orderStatus = {}));
