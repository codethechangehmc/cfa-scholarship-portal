import mongoose, { Schema, Document } from "mongoose";

export interface IApplication extends Document {
  userId: mongoose.Types.ObjectId;
  applicationType: "new" | "renewal";
  academicYear: string;
  status: "draft" | "submitted" | "under_review" | "approved" | "denied";
  submittedAt?: Date;
  reviewedAt?: Date;
  reviewedBy?: mongoose.Types.ObjectId;

  personalInfo: {
    fullName: string;
    email: string;
    phone: string;
    mailingAddress: {
      street: string;
      city: string;
      state: string;
      zipCode: string;
    };
    dateOfBirth: Date;
    currentAge?: number;
  };

  educationInfo: {
    hasHighSchoolDiploma: boolean;
    diplomaSource?: string;
    estimatedGraduationDate?: Date;
    collegeName: string;
    isAccepted: boolean;
    yearInSchool: string;
    attendanceType: string;
    unitsEnrolled: number;
    currentGPA: number;
    majorOrCourseOfStudy?: string;
  };

  fosterCareInfo?: {
    agencyName: string;
    socialWorker: {
      name: string;
      email: string;
      relationship: string;
    };
    resourceParent: {
      name: string;
      address: string;
      phoneOrEmail: string;
      relationship: string;
    };
    lengthInPlacement: string;
  };

  livingSituation: {
    currentDescription: string;
    willContinue: boolean;
    futurePlans?: string;
  };

  employmentInfo: {
    isEmployed: boolean;
    employer?: string;
    position?: string;
    responsibilities?: string;
    hourlyRate?: number;
    hoursPerWeek?: number;
    employmentDuration?: string;
    employerContact?: {
      name: string;
      phoneOrEmail: string;
    };
    plansToContinueWhileInSchool?: boolean;
    isSeekingEmployment?: boolean;
  };

  essays: {
    reasonForRequest: string;
    educationAndCareerGoals: string;
    plansAfterFosterCare?: string;
    otherResources?: string;
    nextStepIfDenied?: string;
    whyGoodCandidate: string;
    howScholarshipHelped?: string;
  };

  requiredDocuments: {
    highSchoolDiplomaOrGED: {
      required: boolean;
      uploaded: boolean;
      fileId?: mongoose.Types.ObjectId;
      uploadedAt?: Date;
      verifiedBy?: mongoose.Types.ObjectId;
      verifiedAt?: Date;
    };
    transcripts: {
      required: boolean;
      uploaded: boolean;
      fileId?: mongoose.Types.ObjectId;
      uploadedAt?: Date;
      verifiedBy?: mongoose.Types.ObjectId;
      verifiedAt?: Date;
    };
    enrollmentVerification: {
      required: boolean;
      uploaded: boolean;
      fileId?: mongoose.Types.ObjectId;
      uploadedAt?: Date;
      verifiedBy?: mongoose.Types.ObjectId;
      verifiedAt?: Date;
    };
    employmentVerification: {
      required: boolean;
      uploaded: boolean;
      fileId?: mongoose.Types.ObjectId;
      uploadedAt?: Date;
      verifiedBy?: mongoose.Types.ObjectId;
      verifiedAt?: Date;
    };
    recommendationLetter: {
      submitted: boolean;
    };
  };

  adminNotes: Array<{
    note: string;
    createdBy: mongoose.Types.ObjectId;
    createdAt: Date;
  }>;

  createdAt: Date;
  updatedAt: Date;
}

const ApplicationSchema = new Schema<IApplication>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    applicationType: {
      type: String,
      enum: ["new", "renewal"],
      required: true,
    },
    academicYear: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["draft", "submitted", "under_review", "approved", "denied"],
      default: "draft",
      required: true,
    },
    submittedAt: Date,
    reviewedAt: Date,
    reviewedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },

    personalInfo: {
      fullName: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, required: true },
      mailingAddress: {
        street: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        zipCode: { type: String, required: true },
      },
      dateOfBirth: { type: Date, required: true },
      currentAge: Number,
    },

    educationInfo: {
      hasHighSchoolDiploma: { type: Boolean, required: true },
      diplomaSource: String,
      estimatedGraduationDate: Date,
      collegeName: { type: String, required: true },
      isAccepted: { type: Boolean, required: true },
      yearInSchool: { type: String, required: true },
      attendanceType: { type: String, required: true },
      unitsEnrolled: { type: Number, required: true },
      currentGPA: { type: Number, required: true },
      majorOrCourseOfStudy: String,
    },

    fosterCareInfo: {
      agencyName: String,
      socialWorker: {
        name: String,
        email: String,
        relationship: String,
      },
      resourceParent: {
        name: String,
        address: String,
        phoneOrEmail: String,
        relationship: String,
      },
      lengthInPlacement: String,
    },

    livingSituation: {
      currentDescription: { type: String, required: true },
      willContinue: { type: Boolean, required: true },
      futurePlans: String,
    },

    employmentInfo: {
      isEmployed: { type: Boolean, required: true },
      employer: String,
      position: String,
      responsibilities: String,
      hourlyRate: Number,
      hoursPerWeek: Number,
      employmentDuration: String,
      employerContact: {
        name: String,
        phoneOrEmail: String,
      },
      plansToContinueWhileInSchool: Boolean,
      isSeekingEmployment: Boolean,
    },

    essays: {
      reasonForRequest: { type: String, required: true },
      educationAndCareerGoals: { type: String, required: true },
      plansAfterFosterCare: String,
      otherResources: String,
      nextStepIfDenied: String,
      whyGoodCandidate: { type: String, required: true },
      howScholarshipHelped: String,
    },

    requiredDocuments: {
      highSchoolDiplomaOrGED: {
        required: { type: Boolean, default: true },
        uploaded: { type: Boolean, default: false },
        fileId: Schema.Types.ObjectId,
        uploadedAt: Date,
        verifiedBy: Schema.Types.ObjectId,
        verifiedAt: Date,
      },
      transcripts: {
        required: { type: Boolean, default: true },
        uploaded: { type: Boolean, default: false },
        fileId: Schema.Types.ObjectId,
        uploadedAt: Date,
        verifiedBy: Schema.Types.ObjectId,
        verifiedAt: Date,
      },
      enrollmentVerification: {
        required: { type: Boolean, default: true },
        uploaded: { type: Boolean, default: false },
        fileId: Schema.Types.ObjectId,
        uploadedAt: Date,
        verifiedBy: Schema.Types.ObjectId,
        verifiedAt: Date,
      },
      employmentVerification: {
        required: { type: Boolean, default: false },
        uploaded: { type: Boolean, default: false },
        fileId: Schema.Types.ObjectId,
        uploadedAt: Date,
        verifiedBy: Schema.Types.ObjectId,
        verifiedAt: Date,
      },
      recommendationLetter: {
        submitted: { type: Boolean, default: false },
      },
    },

    adminNotes: [
      {
        note: { type: String, required: true },
        createdBy: {
          type: Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IApplication>("Application", ApplicationSchema);
