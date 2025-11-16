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
const mongoose_1 = __importStar(require("mongoose"));
const ReimbursementRequestSchema = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true,
    },
    applicationId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Application",
        required: true,
    },
    requestType: {
        type: String,
        enum: ["tuition_payment", "reimbursement"],
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    paymentInfo: {
        payableTo: { type: String, required: true },
        paymentMethod: { type: String, required: true },
        accountOrAddress: { type: String, required: true },
    },
    receipts: [
        {
            description: { type: String, required: true },
            amount: { type: Number, required: true },
            date: { type: Date, required: true },
            fileId: {
                type: mongoose_1.Schema.Types.ObjectId,
                ref: "File",
                required: true,
            },
            category: { type: String, required: true },
        },
    ],
    status: {
        type: String,
        enum: ["pending", "approved", "denied", "paid"],
        default: "pending",
        required: true,
    },
    submittedAt: Date,
    reviewedBy: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
    },
    reviewedAt: Date,
    paidAt: Date,
    adminNotes: String,
}, {
    timestamps: true,
});
exports.default = mongoose_1.default.model("ReimbursementRequest", ReimbursementRequestSchema);
