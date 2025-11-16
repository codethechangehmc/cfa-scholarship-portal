import mongoose, { Schema, Document } from "mongoose";

export interface IRenewalChecklist extends Document {
  userId: mongoose.Types.ObjectId;
  applicationId: mongoose.Types.ObjectId;
  academicYear: string;
  reportingPeriod: string;
  submittedAt?: Date;
  status: "pending" | "submitted" | "reviewed";

  academicUpdate: {
    currentGPA: number;
    unitsEnrolled: number;
    attendanceType: string;
    transcriptFileId?: mongoose.Types.ObjectId;
  };

  employmentUpdate: {
    isEmployed: boolean;
    employer?: string;
    hoursPerWeek?: number;
    verificationFileId?: mongoose.Types.ObjectId;
  };

  complianceChecklist: {
    maintainedGPAOver2: boolean;
    attendingFullTimeOrWorkingPartTime: boolean;
    cleanArrestRecord: boolean;
    noIllegalSubstances: boolean;
    compliedWithPolicies: boolean;
  };

  reviewedBy?: mongoose.Types.ObjectId;
  reviewedAt?: Date;
  adminNotes?: string;

  createdAt: Date;
  updatedAt: Date;
}

const RenewalChecklistSchema = new Schema<IRenewalChecklist>(
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
    academicYear: {
      type: String,
      required: true,
    },
    reportingPeriod: {
      type: String,
      required: true,
    },
    submittedAt: Date,
    status: {
      type: String,
      enum: ["pending", "submitted", "reviewed"],
      default: "pending",
      required: true,
    },

    academicUpdate: {
      currentGPA: { type: Number, required: true },
      unitsEnrolled: { type: Number, required: true },
      attendanceType: { type: String, required: true },
      transcriptFileId: Schema.Types.ObjectId,
    },

    employmentUpdate: {
      isEmployed: { type: Boolean, required: true },
      employer: String,
      hoursPerWeek: Number,
      verificationFileId: Schema.Types.ObjectId,
    },

    complianceChecklist: {
      maintainedGPAOver2: { type: Boolean, required: true },
      attendingFullTimeOrWorkingPartTime: { type: Boolean, required: true },
      cleanArrestRecord: { type: Boolean, required: true },
      noIllegalSubstances: { type: Boolean, required: true },
      compliedWithPolicies: { type: Boolean, required: true },
    },

    reviewedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    reviewedAt: Date,
    adminNotes: String,
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IRenewalChecklist>(
  "RenewalChecklist",
  RenewalChecklistSchema
);
