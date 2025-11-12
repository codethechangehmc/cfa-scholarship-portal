"use client"

import React, { useState, ChangeEvent, FormEvent } from 'react';
import { FileText, User, Briefcase, Home, Send, CheckCircle, AlertCircle } from 'lucide-react';

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  dob: string;
  hasDiploma: string;
  diplomaFrom: string;
  graduationDate: string;
  schoolName: string;
  accepted: string;
  yearInSchool: string;
  attendance: string;
  units: string;
  gpa: string;
  agencyName: string;
  socialWorkerName: string;
  socialWorkerStatus: string;
  socialWorkerEmail: string;
  resourceParentName: string;
  caregiverStatus: string;
  resourceParentAddress: string;
  resourceParentContact: string;
  timeInPlacement: string;
  currentLiving: string;
  continueLiving: string;
  futurePlans: string;
  employed: string;
  workplace: string;
  payRate: string;
  hoursPerWeek: string;
  positionTitle: string;
  responsibilities: string;
  employerContact: string;
  employerPhone: string;
  continueWorking: string;
  seekingEmployment: string;
  scholarshipReason: string;
  goals: string;
  futurePlansDetailed: string;
  otherResources: string;
  ifDenied: string;
  whyCandidate: string;
  documents: string[];
}

interface Section {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
}

export default function ScholarshipPortal(): React.ReactElement {
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    dob: '',
    hasDiploma: '',
    diplomaFrom: '',
    graduationDate: '',
    schoolName: '',
    accepted: '',
    yearInSchool: '',
    attendance: '',
    units: '',
    gpa: '',
    agencyName: '',
    socialWorkerName: '',
    socialWorkerStatus: '',
    socialWorkerEmail: '',
    resourceParentName: '',
    caregiverStatus: '',
    resourceParentAddress: '',
    resourceParentContact: '',
    timeInPlacement: '',
    currentLiving: '',
    continueLiving: '',
    futurePlans: '',
    employed: '',
    workplace: '',
    payRate: '',
    hoursPerWeek: '',
    positionTitle: '',
    responsibilities: '',
    employerContact: '',
    employerPhone: '',
    continueWorking: '',
    seekingEmployment: '',
    scholarshipReason: '',
    goals: '',
    futurePlansDetailed: '',
    otherResources: '',
    ifDenied: '',
    whyCandidate: '',
    documents: []
  });

  const [currentSection, setCurrentSection] = useState<number>(0);
  const [agreed, setAgreed] = useState<boolean>(false);
  const [submitted, setSubmitted] = useState<boolean>(false);

  const sections: Section[] = [
    { title: 'Personal Information', icon: User },
    { title: 'Background Information', icon: Home },
    { title: 'Employment Information', icon: Briefcase },
    { title: 'Additional Information', icon: FileText },
    { title: 'Documents & Review', icon: CheckCircle }
  ];

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>): void => {
    const target = e.target as HTMLInputElement;
    const { name, value, type, checked } = target;
    
    if (type === 'checkbox') {
      const docs = formData.documents.includes(value)
        ? formData.documents.filter(d => d !== value)
        : [...formData.documents, value];
      setFormData({ ...formData, documents: docs });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    if (!agreed) {
      alert('Please agree to the scholarship terms to submit.');
      return;
    }
    console.log('Form submitted:', formData);
    setSubmitted(true);
  };

  const nextSection = (): void => {
    if (currentSection < sections.length - 1) {
      setCurrentSection(currentSection + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const prevSection = (): void => {
    if (currentSection > 0) {
      setCurrentSection(currentSection - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-12 max-w-2xl text-center">
          <CheckCircle className="w-24 h-24 text-green-500 mx-auto mb-6" />
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Application Submitted!</h1>
          <p className="text-lg text-gray-600 mb-6">
            Thank you for applying to the Children's Foundation of America Scholarship. We have received your application and will review it shortly.
          </p>
          <p className="text-gray-600">
            You will receive an email confirmation at <strong>{formData.email}</strong>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-lg">
        <div className="max-w-5xl mx-auto px-6 py-8">
          <h1 className="text-3xl font-bold text-indigo-900 mb-2">
            Children's Foundation of America Scholarship
          </h1>
          <p className="text-gray-600">2025-2026 School Year Application</p>
          <p className="text-sm text-red-600 font-semibold mt-2">Deadline: June 1st, 2025</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="max-w-5xl mx-auto px-6 py-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center">
            {sections.map((section, idx) => {
              const IconComponent = section.icon;
              return (
                <div key={idx} className="flex flex-col items-center flex-1">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    idx === currentSection ? 'bg-indigo-600 text-white' :
                    idx < currentSection ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'
                  }`}>
                    <IconComponent className="w-6 h-6" />
                  </div>
                  <span className={`text-xs mt-2 text-center ${
                    idx === currentSection ? 'text-indigo-600 font-semibold' : 'text-gray-500'
                  }`}>
                    {section.title}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Form Content */}
      <div className="max-w-5xl mx-auto px-6 pb-12">
        <div className="bg-white rounded-lg shadow-xl p-8">
          <form onSubmit={handleSubmit}>
            {/* Section 0: Personal Information */}
            {currentSection === 0 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 pb-3 border-b-2 border-indigo-200">
                  Personal Information
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      First Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Last Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Primary Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Phone <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Mailing Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Date of Birth <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="dob"
                    value={formData.dob}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Do you have a high school diploma or GED? <span className="text-red-500">*</span>
                  </label>
                  <div className="flex gap-6">
                    <label className="flex items-center text-gray-800">
                      <input
                        type="radio"
                        name="hasDiploma"
                        value="yes"
                        checked={formData.hasDiploma === 'yes'}
                        onChange={handleChange}
                        className="mr-2 w-4 h-4 text-indigo-600"
                        required
                      />
                      Yes
                    </label>
                    <label className="flex items-center text-gray-800">
                      <input
                        type="radio"
                        name="hasDiploma"
                        value="no"
                        checked={formData.hasDiploma === 'no'}
                        onChange={handleChange}
                        className="mr-2 w-4 h-4 text-indigo-600"
                      />
                      No
                    </label>
                  </div>
                </div>

                {formData.hasDiploma === 'yes' && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      If Yes, from where?
                    </label>
                    <input
                      type="text"
                      name="diplomaFrom"
                      value={formData.diplomaFrom}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>
                )}

                {formData.hasDiploma === 'no' && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      If No, provide estimated graduation date
                    </label>
                    <input
                      type="date"
                      name="graduationDate"
                      value={formData.graduationDate}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Name of college or trade school you will be attending (or plan on attending) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="schoolName"
                    value={formData.schoolName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Have you been accepted to this school? <span className="text-red-500">*</span>
                  </label>
                  <div className="flex gap-6">
                    <label className="flex items-center text-gray-800">
                      <input
                        type="radio"
                        name="accepted"
                        value="yes"
                        checked={formData.accepted === 'yes'}
                        onChange={handleChange}
                        className="mr-2 w-4 h-4 text-indigo-600"
                        required
                      />
                      Yes
                    </label>
                    <label className="flex items-center text-gray-800">
                      <input
                        type="radio"
                        name="accepted"
                        value="no"
                        checked={formData.accepted === 'no'}
                        onChange={handleChange}
                        className="mr-2 w-4 h-4 text-indigo-600"
                      />
                      No
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Year in School (Upcoming School Year) <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="yearInSchool"
                    value={formData.yearInSchool}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select...</option>
                    <option value="freshman">Freshman</option>
                    <option value="sophomore">Sophomore</option>
                    <option value="junior">Junior</option>
                    <option value="senior">Senior</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Are you attending school full time or part time? <span className="text-red-500">*</span>
                  </label>
                  <div className="flex gap-6">
                    <label className="flex items-center text-gray-800">
                      <input
                        type="radio"
                        name="attendance"
                        value="full"
                        checked={formData.attendance === 'full'}
                        onChange={handleChange}
                        className="mr-2 w-4 h-4 text-indigo-600"
                        required
                      />
                      Full Time
                    </label>
                    <label className="flex items-center text-gray-800">
                      <input
                        type="radio"
                        name="attendance"
                        value="part"
                        checked={formData.attendance === 'part'}
                        onChange={handleChange}
                        className="mr-2 w-4 h-4 text-indigo-600"
                      />
                      Part Time
                    </label>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Units Enrolled <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="units"
                      value={formData.units}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Current GPA <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      name="gpa"
                      value={formData.gpa}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Section 1: Background Information */}
            {currentSection === 1 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 pb-3 border-b-2 border-indigo-200">
                  Background Information
                </h2>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Name of Foster Care/Campus Agency <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="agencyName"
                    value={formData.agencyName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Social Worker's Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="socialWorkerName"
                    value={formData.socialWorkerName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Are they your current or past social worker? <span className="text-red-500">*</span>
                  </label>
                  <div className="flex gap-6">
                    <label className="flex items-center text-gray-800">
                      <input
                        type="radio"
                        name="socialWorkerStatus"
                        value="current"
                        checked={formData.socialWorkerStatus === 'current'}
                        onChange={handleChange}
                        className="mr-2 w-4 h-4 text-indigo-600"
                        required
                      />
                      Current
                    </label>
                    <label className="flex items-center text-gray-800">
                      <input
                        type="radio"
                        name="socialWorkerStatus"
                        value="past"
                        checked={formData.socialWorkerStatus === 'past'}
                        onChange={handleChange}
                        className="mr-2 w-4 h-4 text-indigo-600"
                      />
                      Past
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Social Worker's Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="socialWorkerEmail"
                    value={formData.socialWorkerEmail}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Resource Parent Name (or Campus Name) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="resourceParentName"
                    value={formData.resourceParentName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Are they your current or past caregiver? <span className="text-red-500">*</span>
                  </label>
                  <div className="flex gap-6">
                    <label className="flex items-center text-gray-800">
                      <input
                        type="radio"
                        name="caregiverStatus"
                        value="current"
                        checked={formData.caregiverStatus === 'current'}
                        onChange={handleChange}
                        className="mr-2 w-4 h-4 text-indigo-600"
                        required
                      />
                      Current
                    </label>
                    <label className="flex items-center text-gray-800">
                      <input
                        type="radio"
                        name="caregiverStatus"
                        value="past"
                        checked={formData.caregiverStatus === 'past'}
                        onChange={handleChange}
                        className="mr-2 w-4 h-4 text-indigo-600"
                      />
                      Past
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Resource Parent (or Campus) Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="resourceParentAddress"
                    value={formData.resourceParentAddress}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Resource Parent (or Campus) Phone/Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="resourceParentContact"
                    value={formData.resourceParentContact}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Length of time in placement? <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="timeInPlacement"
                    value={formData.timeInPlacement}
                    onChange={handleChange}
                    placeholder="e.g., 2 years, 6 months"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Briefly describe your current living situation <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="currentLiving"
                    value={formData.currentLiving}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Will you continue to live there if accepted into the scholarship fund? <span className="text-red-500">*</span>
                  </label>
                  <div className="flex gap-6">
                    <label className="flex items-center text-gray-800">
                      <input
                        type="radio"
                        name="continueLiving"
                        value="yes"
                        checked={formData.continueLiving === 'yes'}
                        onChange={handleChange}
                        className="mr-2 w-4 h-4 text-indigo-600"
                        required
                      />
                      Yes
                    </label>
                    <label className="flex items-center text-gray-800">
                      <input
                        type="radio"
                        name="continueLiving"
                        value="no"
                        checked={formData.continueLiving === 'no'}
                        onChange={handleChange}
                        className="mr-2 w-4 h-4 text-indigo-600"
                      />
                      No
                    </label>
                  </div>
                </div>

                {formData.continueLiving === 'no' && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      If No, what are your plans for the near future in regards to a living situation?
                    </label>
                    <textarea
                      name="futurePlans"
                      value={formData.futurePlans}
                      onChange={handleChange}
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Are you currently employed? <span className="text-red-500">*</span>
                  </label>
                  <div className="flex gap-6">
                    <label className="flex items-center text-gray-800">
                      <input
                        type="radio"
                        name="employed"
                        value="yes"
                        checked={formData.employed === 'yes'}
                        onChange={handleChange}
                        className="mr-2 w-4 h-4 text-indigo-600"
                        required
                      />
                      Yes
                    </label>
                    <label className="flex items-center text-gray-800">
                      <input
                        type="radio"
                        name="employed"
                        value="no"
                        checked={formData.employed === 'no'}
                        onChange={handleChange}
                        className="mr-2 w-4 h-4 text-indigo-600"
                      />
                      No
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* Section 2: Employment Information */}
            {currentSection === 2 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 pb-3 border-b-2 border-indigo-200">
                  Employment Information
                </h2>

                {formData.employed === 'yes' ? (
                  <>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Where do you work and how long have you been working there? <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        name="workplace"
                        value={formData.workplace}
                        onChange={handleChange}
                        rows={3}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          What is the rate of pay per hour? <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="payRate"
                          value={formData.payRate}
                          onChange={handleChange}
                          placeholder="e.g., $15.50"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Hours worked per week? <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="number"
                          name="hoursPerWeek"
                          value={formData.hoursPerWeek}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        What is your position title? <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="positionTitle"
                        value={formData.positionTitle}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        What are your responsibilities? <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        name="responsibilities"
                        value={formData.responsibilities}
                        onChange={handleChange}
                        rows={4}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Employer Contact Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="employerContact"
                        value={formData.employerContact}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Employer Phone/Email <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="employerPhone"
                        value={formData.employerPhone}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Do you plan to continue working while in school? <span className="text-red-500">*</span>
                      </label>
                      <div className="flex gap-6">
                        <label className="flex items-center text-gray-800">
                          <input
                            type="radio"
                            name="continueWorking"
                            value="yes"
                            checked={formData.continueWorking === 'yes'}
                            onChange={handleChange}
                            className="mr-2 w-4 h-4 text-indigo-600"
                            required
                          />
                          Yes
                        </label>
                        <label className="flex items-center text-gray-800">
                          <input
                            type="radio"
                            name="continueWorking"
                            value="no"
                            checked={formData.continueWorking === 'no'}
                            onChange={handleChange}
                            className="mr-2 w-4 h-4 text-indigo-600"
                          />
                          No
                        </label>
                      </div>
                    </div>
                  </>
                ) : (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      If you are not currently employed, are you seeking employment? <span className="text-red-500">*</span>
                    </label>
                    <div className="flex gap-6">
                      <label className="flex items-center text-gray-800">
                        <input
                          type="radio"
                          name="seekingEmployment"
                          value="yes"
                          checked={formData.seekingEmployment === 'yes'}
                          onChange={handleChange}
                          className="mr-2 w-4 h-4 text-indigo-600"
                          required
                        />
                        Yes
                      </label>
                      <label className="flex items-center text-gray-800">
                        <input
                          type="radio"
                          name="seekingEmployment"
                          value="no"
                          checked={formData.seekingEmployment === 'no'}
                          onChange={handleChange}
                          className="mr-2 w-4 h-4 text-indigo-600"
                        />
                        No
                      </label>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Section 3: Additional Information */}
            {currentSection === 3 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 pb-3 border-b-2 border-indigo-200">
                  Additional Information
                </h2>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Please state clearly the reason for your request of a scholarship <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="scholarshipReason"
                    value={formData.scholarshipReason}
                    onChange={handleChange}
                    rows={5}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    What are your goals in regards to education and career? <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="goals"
                    value={formData.goals}
                    onChange={handleChange}
                    rows={5}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    What are your plans after leaving foster care (education, work, and living arrangements)? <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="futurePlansDetailed"
                    value={formData.futurePlansDetailed}
                    onChange={handleChange}
                    rows={5}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Are there other resources available to meet these needs? Please explain. <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="otherResources"
                    value={formData.otherResources}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    What will be your next step if funding is denied? <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="ifDenied"
                    value={formData.ifDenied}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Why are you a good candidate for this scholarship fund? <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="whyCandidate"
                    value={formData.whyCandidate}
                    onChange={handleChange}
                    rows={5}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>
            )}

            {/* Section 4: Documents & Review */}
            {currentSection === 4 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 pb-3 border-b-2 border-indigo-200">
                  Documents & Review
                </h2>

                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
                  <div className="flex items-start">
                    <AlertCircle className="w-5 h-5 text-blue-500 mr-3 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-blue-800">
                        Before completing the application, please email the listed documents to Alexandra Ofstedahl at <strong>aofstedahl@trinityys.org</strong>
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Please check off the items you have submitted via email <span className="text-red-500">*</span>
                  </label>
                  <div className="space-y-3">
                    <label className="flex items-start p-3 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer">
                      <input
                        type="checkbox"
                        value="diploma"
                        checked={formData.documents.includes('diploma')}
                        onChange={handleChange}
                        className="mt-1 mr-3 w-5 h-5 text-indigo-600 flex-shrink-0"
                      />
                      <span className="text-sm">Copy High School Diploma or GED Certificate (if not yet available, please explain)</span>
                    </label>

                    <label className="flex items-start p-3 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer">
                      <input
                        type="checkbox"
                        value="transcripts"
                        checked={formData.documents.includes('transcripts')}
                        onChange={handleChange}
                        className="mt-1 mr-3 w-5 h-5 text-indigo-600 flex-shrink-0"
                      />
                      <span className="text-sm">Copy of Transcripts with Current GPA</span>
                    </label>

                    <label className="flex items-start p-3 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer">
                      <input
                        type="checkbox"
                        value="enrollment"
                        checked={formData.documents.includes('enrollment')}
                        onChange={handleChange}
                        className="mt-1 mr-3 w-5 h-5 text-indigo-600 flex-shrink-0"
                      />
                      <span className="text-sm">Enrollment/Acceptance Verification and Class Schedule (if not yet available, please explain)</span>
                    </label>

                    <label className="flex items-start p-3 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer">
                      <input
                        type="checkbox"
                        value="employment"
                        checked={formData.documents.includes('employment')}
                        onChange={handleChange}
                        className="mt-1 mr-3 w-5 h-5 text-indigo-600 flex-shrink-0"
                      />
                      <span className="text-sm">Employment Verification (copy of paystub or letter from employer on letterhead): this item is required if not attending school full time</span>
                    </label>

                    <label className="flex items-start p-3 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer">
                      <input
                        type="checkbox"
                        value="recommendations"
                        checked={formData.documents.includes('recommendations')}
                        onChange={handleChange}
                        className="mt-1 mr-3 w-5 h-5 text-indigo-600 flex-shrink-0"
                      />
                      <span className="text-sm">Recommendation Forms (from 3 different sources; link on first page of application)</span>
                    </label>
                  </div>
                </div>

                <div className="bg-gray-50 border border-gray-300 rounded-lg p-6 mt-8">
                  <h3 className="text-lg font-bold text-gray-800 mb-4">Scholarship Terms</h3>
                  <div className="text-sm text-gray-700 space-y-3 max-h-96 overflow-y-auto pr-2">
                    <p>In submitting this application I certify that:</p>
                    
                    <p><strong>a)</strong> The information provided in this application is complete and true to the best of my knowledge and belief. I am including a legitimate transcript for all colleges, universities or high schools attended.</p>
                    
                    <p><strong>b)</strong> I accept and acknowledge all rules and regulations of the scholarship fund.</p>
                    
                    <p><strong>c)</strong> I am applying for this scholarship for the purpose of beginning or continuing my college studies or to successfully emancipate from foster care.</p>
                    
                    <p><strong>d)</strong> Should I be awarded the scholarship, I will fulfill my agreement of submitting reporting including education status, GPA, residence report, employment status and updated contact information on a quarterly or semi-annually as requested by the Children's Foundation of America. If I do not comply with the reporting regulations, rules and policies of the Children's Foundation of America Scholarship Fund, I realize that the scholarship given to me may be terminated and will no longer apply to me. I will use the proceeds of any scholarship received from or through the Children's Foundation of America for the payment of tuition, additional education fees, rent or utilities.</p>
                    
                    <p><strong>e)</strong> I will be an ambassador for other foster youth and encourage them to seek higher education and successfully emancipate.</p>
                    
                    <p><strong>f)</strong> I understand that any refund by the college or university of tuition and fees or any other agency paid with scholarship funds must be returned to the Children's Foundation of America.</p>
                  </div>

                  <label className="flex items-center mt-6 p-4 bg-white border-2 border-indigo-300 rounded-lg cursor-pointer hover:bg-indigo-50">
                    <input
                      type="checkbox"
                      checked={agreed}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => setAgreed(e.target.checked)}
                      className="mr-3 w-5 h-5 text-indigo-600 flex-shrink-0"
                      required
                    />
                    <span className="text-sm font-semibold text-gray-800">
                      I have read and agree to the scholarship terms <span className="text-red-500">*</span>
                    </span>
                  </label>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between items-center mt-8 pt-6 border-t-2 border-gray-200">
              <button
                type="button"
                onClick={prevSection}
                disabled={currentSection === 0}
                className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                  currentSection === 0
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-gray-500 text-white hover:bg-gray-600'
                }`}
              >
                Previous
              </button>

              <div className="text-sm text-gray-600">
                Section {currentSection + 1} of {sections.length}
              </div>

              {currentSection < sections.length - 1 ? (
                <button
                  type="button"
                  onClick={nextSection}
                  className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
                >
                  Next
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={!agreed}
                  className={`px-8 py-3 rounded-lg font-semibold flex items-center transition-colors ${
                    agreed
                      ? 'bg-green-600 text-white hover:bg-green-700'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  <Send className="w-5 h-5 mr-2" />
                  Submit Application
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-600">
          <p>Questions? Contact Children's Foundation of America at (909) 426-0773</p>
          <p className="mt-2">Email documents to: aofstedahl@trinityys.org</p>
        </div>
      </div>
    </div>
  );
}