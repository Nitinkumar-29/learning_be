"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parcelXOrderCancellationQueue = exports.parcelXOrderQueue = exports.parcelXOrderCancellation = exports.parcelXOrder = void 0;
const queue_factory_1 = require("../queue.factory");
exports.parcelXOrder = "parcelx-orders-queue";
exports.parcelXOrderCancellation = "parcelx-order-cancellation-queue";
exports.parcelXOrderQueue = (0, queue_factory_1.createParcelXQueue)(exports.parcelXOrder);
exports.parcelXOrderCancellationQueue = (0, queue_factory_1.createParcelXQueue)(exports.parcelXOrderCancellation);
