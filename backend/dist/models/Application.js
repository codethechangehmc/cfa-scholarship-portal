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
const ApplicationSchema = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
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
        type: mongoose_1.Schema.Types.ObjectId,
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
            fileId: mongoose_1.Schema.Types.ObjectId,
            uploadedAt: Date,
            verifiedBy: mongoose_1.Schema.Types.ObjectId,
            verifiedAt: Date,
        },
        transcripts: {
            required: { type: Boolean, default: true },
            uploaded: { type: Boolean, default: false },
            fileId: mongoose_1.Schema.Types.ObjectId,
            uploadedAt: Date,
            verifiedBy: mongoose_1.Schema.Types.ObjectId,
            verifiedAt: Date,
        },
        enrollmentVerification: {
            required: { type: Boolean, default: true },
            uploaded: { type: Boolean, default: false },
            fileId: mongoose_1.Schema.Types.ObjectId,
            uploadedAt: Date,
            verifiedBy: mongoose_1.Schema.Types.ObjectId,
            verifiedAt: Date,
        },
        employmentVerification: {
            required: { type: Boolean, default: false },
            uploaded: { type: Boolean, default: false },
            fileId: mongoose_1.Schema.Types.ObjectId,
            uploadedAt: Date,
            verifiedBy: mongoose_1.Schema.Types.ObjectId,
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
                type: mongoose_1.Schema.Types.ObjectId,
                ref: "User",
                required: true,
            },
            createdAt: { type: Date, default: Date.now },
        },
    ],
}, {
    timestamps: true,
});
exports.default = mongoose_1.default.model("Application", ApplicationSchema);
