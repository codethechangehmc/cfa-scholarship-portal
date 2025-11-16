import mongoose, { Schema, Document } from "mongoose";

export interface IFile extends Document {
  userId: mongoose.Types.ObjectId;
  relatedEntityType: "application" | "midYearReport" | "paymentRequest";
  relatedEntityId: mongoose.Types.ObjectId;

  fileMetadata: {
    originalName: string;
    mimeType: string;
    size: number;
    storageUrl: string;
    documentType: string;
  };

  uploadedAt: Date;
  isDeleted: boolean;
  deletedAt?: Date;
}

const FileSchema = new Schema<IFile>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    relatedEntityType: {
      type: String,
      enum: ["application", "midYearReport", "paymentRequest"],
      required: true,
    },
    relatedEntityId: {
      type: Schema.Types.ObjectId,
      required: true,
    },

    fileMetadata: {
      originalName: { type: String, required: true },
      mimeType: { type: String, required: true },
      size: { type: Number, required: true },
      storageUrl: { type: String, required: true },
      documentType: { type: String, required: true },
    },

    uploadedAt: {
      type: Date,
      default: Date.now,
      required: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: Date,
  },
  {
    timestamps: false,
  }
);

export default mongoose.model<IFile>("File", FileSchema);
