import mongoose, { Schema, Document } from "mongoose";

export interface IReimbursementRequest extends Document {
  userId: mongoose.Types.ObjectId;
  applicationId: mongoose.Types.ObjectId;
  requestType: "tuition_payment" | "reimbursement";
  amount: number;
  description: string;

  paymentInfo: {
    payableTo: string;
    paymentMethod: string;
    accountOrAddress: string;
  };

  receipts: Array<{
    description: string;
    amount: number;
    date: Date;
    fileId: mongoose.Types.ObjectId;
    category: string;
  }>;

  status: "pending" | "approved" | "denied" | "paid";
  submittedAt?: Date;
  reviewedBy?: mongoose.Types.ObjectId;
  reviewedAt?: Date;
  paidAt?: Date;

  adminNotes?: string;

  createdAt: Date;
  updatedAt: Date;
}

const ReimbursementRequestSchema = new Schema<IReimbursementRequest>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    applicationId: {
      type: Schema.Types.ObjectId,
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
          type: Schema.Types.ObjectId,
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
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    reviewedAt: Date,
    paidAt: Date,

    adminNotes: String,
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IReimbursementRequest>(
  "ReimbursementRequest",
  ReimbursementRequestSchema
);
