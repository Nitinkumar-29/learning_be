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
exports.kycBankDetailsModel = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const kyc_enum_1 = require("../../../../../../common/enums/kyc.enum");
const kycBankDetailsSchema = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true,
    },
    accountHolderName: { type: String, required: true },
    accountType: {
        type: String,
        enum: Object.values(kyc_enum_1.accountTypes),
        required: true,
    },
    accountNumber: { type: String, required: true },
    ifscCode: { type: String, required: true },
    bankName: { type: String, required: true },
    bankBranch: { type: String, required: true },
    bankAddress: { type: String }, // optional, can be collected or fetched from IFSC
    cancelledChequeImageUrl: { type: String, required: true },
    isOldCancelledChequeAccepted: { type: Boolean, default: false },
    kycId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "kyc",
        unique: true,
        required: true,
    },
    verificationDone: {
        type: Boolean,
        default: false,
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true, versionKey: false });
exports.kycBankDetailsModel = (0, mongoose_1.model)("kycbankdetails", kycBankDetailsSchema);
