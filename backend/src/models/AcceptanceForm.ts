import mongoose, { Schema, Document } from "mongoose";

export interface IAcceptanceForm extends Document {
  userId: mongoose.Types.ObjectId;
  applicationId: mongoose.Types.ObjectId;
  acceptedTerms: boolean;
  acceptedAt: Date;
  ipAddress: string;
  createdAt: Date;
}

const AcceptanceFormSchema = new Schema<IAcceptanceForm>(
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
    acceptedTerms: {
      type: Boolean,
      required: true,
    },
    acceptedAt: {
      type: Date,
      default: Date.now,
      required: true,
    },
    ipAddress: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IAcceptanceForm>(
  "AcceptanceForm",
  AcceptanceFormSchema
);
