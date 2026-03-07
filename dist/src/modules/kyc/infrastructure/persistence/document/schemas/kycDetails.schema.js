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
exports.KycModel = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const kyc_enum_1 = require("../../../../../../common/enums/kyc.enum");
const kycSchema = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true,
    },
    entityName: {
        type: String,
        required: true,
    },
    entityType: {
        type: String,
        required: true,
        enum: Object.values(kyc_enum_1.entityTypes),
    },
    websiteUrl: { type: String, require: false },
    email: { type: String, required: true },
    mobileNumber: { type: Number, required: true },
    billingAddress: { type: String, required: true },
    zipCode: { type: Number, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    aadharNumber: { type: String, required: true, minlength: 12, maxlength: 12 },
    aadharCardFrontImageURL: { type: String, required: false, default: "" },
    aadharCardBackImageURL: { type: String, required: false, default: "" },
    panNumber: { type: String, required: true },
    panCardImageURL: { type: String, required: false, default: "" },
    isGst: {
        type: String,
        enum: Object.values(kyc_enum_1.isGstOptions),
        default: kyc_enum_1.isGstOptions.NO,
        required: false,
    },
    gstNumber: {
        type: String,
        required: function () {
            return this.isGst === kyc_enum_1.isGstOptions.YES;
        },
    },
    gstCertificateLink: {
        type: String,
        required: function () {
            return this.isGst === kyc_enum_1.isGstOptions.YES;
        },
    },
    verificationDone: {
        type: Boolean,
        default: false,
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
});
exports.KycModel = (0, mongoose_1.model)("kyc", kycSchema);
