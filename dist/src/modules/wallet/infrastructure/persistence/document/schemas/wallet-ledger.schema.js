"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.WalletLedgerModel = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const wallet_ledger_enum_1 = require("../../../../../../common/enums/wallet-ledger.enum");
const WalletLedgerSchema = new mongoose_1.Schema({
    walletId: { type: mongoose_1.Schema.Types.ObjectId, required: true, ref: "Wallet" },
    // walletOperationType: {
    //   type: String,
    //   required: true,
    //   enum: Object.values(walletOperationType),
    // }, // e.g., "debit" or "credit"
    userId: { type: mongoose_1.Schema.Types.ObjectId, required: true, ref: "User" },
    transactionType: {
        type: String,
        required: true,
        enum: Object.values(wallet_ledger_enum_1.transactionType),
    }, // e.g., "debit" or "credit"
    amount: { type: Number, required: true, min: 0 },
    currency: { type: String, default: "INR" },
    balanceBeforeTransaction: { type: Number, required: true },
    balanceAfterTransaction: { type: Number, required: true },
    description: { type: String },
    holdBeforeTransaction: { type: Number, required: true },
    holdAfterTransaction: { type: Number, required: true },
    transactionStatus: {
        type: String,
        default: wallet_ledger_enum_1.transactionStatus.PENDING,
        enum: Object.values(wallet_ledger_enum_1.transactionStatus),
    }, // e.g., "pending", "completed", "failed"
    referenceId: { type: String }, // e.g., order ID, payment ID, etc.
    referenceType: {
        type: String,
        enum: Object.values(wallet_ledger_enum_1.referenceType),
        required: true,
    }, // e.g., "order", "payment", etc.
    provider: { type: String }, // e.g., "Razorpay", "Stripe", etc.
    providerReferenceId: { type: String }, // e.g., Razorpay payment ID, Stripe charge ID, etc.
    idempotencyKey: { type: String, unique: true, required: true }, // to ensure idempotency of transactions
    metadata: { type: mongoose_1.Schema.Types.Mixed }, // for any additional data related to the transaction
    createdBy: { type: mongoose_1.Schema.Types.ObjectId, required: true, ref: "User" },
}, { timestamps: true }).index({ walletId: 1, createdAt: -1 }); // index for efficient querying of transactions by walletId and sorting by creation date
exports.WalletLedgerModel = mongoose_1.default.model("WalletLedger", WalletLedgerSchema);
