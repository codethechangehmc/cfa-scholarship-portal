"use client";

import React from "react";
import { Check, Clock3, FileText, GraduationCap, X } from "lucide-react";

export type ApplicationStatus = "draft" | "submitted" | "under_review" | "approved" | "denied";
export type ApplicationType = "new" | "renewal";

export interface ApplicantApplicationSummary {
  _id: string;
  applicationType: ApplicationType;
  academicYear: string;
  status: ApplicationStatus;
  submittedAt?: string;
  reviewedAt?: string;
  createdAt: string;
  updatedAt: string;
  educationInfo?: {
    collegeName?: string;
  };
}

const statusBadgeClasses: Record<ApplicationStatus, string> = {
  draft: "bg-gray-100 text-gray-700",
  submitted: "bg-blue-100 text-blue-700",
  under_review: "bg-amber-100 text-amber-700",
  approved: "bg-green-100 text-green-700",
  denied: "bg-red-100 text-red-700",
};

const statusLabels: Record<ApplicationStatus, string> = {
  draft: "Draft",
  submitted: "Submitted",
  under_review: "Under Review",
  approved: "Approved",
  denied: "Denied",
};

const typeBadgeClasses: Record<ApplicationType, string> = {
  new: "bg-indigo-100 text-indigo-700",
  renewal: "bg-violet-100 text-violet-700",
};

const typeLabels: Record<ApplicationType, string> = {
  new: "New Application",
  renewal: "Renewal Application",
};

type StepState = "complete" | "current" | "upcoming" | "denied";

interface StepDefinition {
  label: string;
  state: StepState;
}

function formatDate(date?: string) {
  if (!date) return "Not submitted yet";

  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function getSteps(status: ApplicationStatus): StepDefinition[] {
  switch (status) {
    case "draft":
      return [
        { label: "Started", state: "current" },
        { label: "Submitted", state: "upcoming" },
        { label: "Decision", state: "upcoming" },
      ];
    case "submitted":
      return [
        { label: "Submitted", state: "current" },
        { label: "Under Review", state: "upcoming" },
        { label: "Decision", state: "upcoming" },
      ];
    case "under_review":
      return [
        { label: "Submitted", state: "complete" },
        { label: "Under Review", state: "current" },
        { label: "Decision", state: "upcoming" },
      ];
    case "approved":
      return [
        { label: "Submitted", state: "complete" },
        { label: "Under Review", state: "complete" },
        { label: "Approved", state: "complete" },
      ];
    case "denied":
      return [
        { label: "Submitted", state: "complete" },
        { label: "Under Review", state: "complete" },
        { label: "Denied", state: "denied" },
      ];
    default:
      return [
        { label: "Submitted", state: "upcoming" },
        { label: "Under Review", state: "upcoming" },
        { label: "Decision", state: "upcoming" },
      ];
  }
}

function getConnectorState(steps: StepDefinition[], index: number) {
  const current = steps[index];
  const next = steps[index + 1];

  if (!next) return "upcoming";
  if (current.state === "complete" && next.state === "current") return "complete";
  if (current.state === "complete" && next.state === "complete") return "complete";
  if (current.state === "complete" && next.state === "denied") return "denied";
  return "upcoming";
}

function StepIcon({ state, label }: { state: StepState; label: string }) {
  const iconClassName = "h-4 w-4";

  if (state === "complete") return <Check className={iconClassName} />;
  if (state === "denied") return <X className={iconClassName} />;
  if (state === "current") {
    return label === "Submitted" || label === "Started" ? (
      <FileText className={iconClassName} />
    ) : (
      <Clock3 className={iconClassName} />
    );
  }
  return <Clock3 className={iconClassName} />;
}

function StepCircle({ step }: { step: StepDefinition }) {
  const toneClasses: Record<StepState, string> = {
    complete: "border-green-600 bg-green-600 text-white",
    current: "border-indigo-600 bg-indigo-600 text-white",
    upcoming: "border-gray-300 bg-white text-gray-400",
    denied: "border-red-600 bg-red-600 text-white",
  };

  return (
    <div
      className={`flex h-10 w-10 items-center justify-center rounded-full border-2 ${toneClasses[step.state]}`}
      aria-hidden="true"
    >
      <StepIcon state={step.state} label={step.label} />
    </div>
  );
}

function StatusProgressBar({ status }: { status: ApplicationStatus }) {
  const steps = getSteps(status);

  return (
    <div className="mt-6">
      <div className="flex items-start">
        {steps.map((step, index) => {
          const connectorState = getConnectorState(steps, index);
          const connectorClass =
            connectorState === "complete"
              ? "bg-green-600"
              : connectorState === "denied"
                ? "bg-red-600"
                : "bg-gray-200";
          const labelClass =
            step.state === "complete"
              ? "text-green-700"
              : step.state === "current"
                ? "text-indigo-700"
                : step.state === "denied"
                  ? "text-red-700"
                  : "text-gray-500";

          return (
            <React.Fragment key={`${step.label}-${index}`}>
              <div className="flex min-w-0 flex-1 flex-col items-center text-center">
                <StepCircle step={step} />
                <span className={`mt-2 text-xs font-semibold ${labelClass}`}>{step.label}</span>
              </div>
              {index < steps.length - 1 && (
                <div className="mt-5 flex-1 px-2">
                  <div className={`h-1 w-full rounded-full ${connectorClass}`} />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}

export default function ApplicationStatusOverview({
  applications,
  loading,
  error,
}: {
  applications: ApplicantApplicationSummary[];
  loading: boolean;
  error: string;
}) {
  return (
    <section className="mb-12 rounded-lg bg-white p-8 shadow-lg">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h3 className="text-2xl font-bold text-gray-800">Your Application Status</h3>
          <p className="mt-1 text-sm text-gray-600">
            Track each submitted scholarship application as it moves through review.
          </p>
        </div>
        <div className="inline-flex items-center gap-2 self-start rounded-full bg-indigo-50 px-3 py-1 text-sm font-medium text-indigo-700">
          <GraduationCap className="h-4 w-4" />
          {applications.length} {applications.length === 1 ? "application" : "applications"}
        </div>
      </div>

      {loading && (
        <div className="mt-6 rounded-lg border border-indigo-100 bg-indigo-50 px-4 py-3 text-sm text-indigo-700">
          Loading your applications...
        </div>
      )}

      {!loading && error && (
        <div className="mt-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {!loading && !error && applications.length === 0 && (
        <div className="mt-6 rounded-lg border border-gray-200 bg-gray-50 px-4 py-5 text-sm text-gray-600">
          You have not submitted an application yet.
        </div>
      )}

      {!loading && !error && applications.length > 0 && (
        <div className="mt-6 space-y-5">
          {applications.map((application) => (
            <article key={application._id} className="rounded-lg border border-gray-200 p-5">
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${typeBadgeClasses[application.applicationType]}`}
                    >
                      {typeLabels[application.applicationType]}
                    </span>
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusBadgeClasses[application.status]}`}
                    >
                      {statusLabels[application.status]}
                    </span>
                  </div>
                  <p className="mt-3 text-lg font-semibold text-gray-800">{application.academicYear}</p>
                  <p className="mt-1 text-sm text-gray-600">
                    {application.educationInfo?.collegeName || "School not listed"}
                  </p>
                </div>

                <dl className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm text-gray-600">
                  <div>
                    <dt className="font-medium text-gray-500">Submitted</dt>
                    <dd>{formatDate(application.submittedAt || application.createdAt)}</dd>
                  </div>
                  <div>
                    <dt className="font-medium text-gray-500">Last Updated</dt>
                    <dd>{formatDate(application.reviewedAt || application.updatedAt)}</dd>
                  </div>
                </dl>
              </div>

              <StatusProgressBar status={application.status} />
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
