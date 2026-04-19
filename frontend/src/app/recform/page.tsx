"use client"

import React, { useState, ChangeEvent, FormEvent } from 'react';
import Link from 'next/link';
import { CheckCircle, AlertCircle, Send, Users } from 'lucide-react';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

interface FormData {
  fullName: string;
  recommenderEmails: string[];
}

export default function RecommenderForm(): React.ReactElement {
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    recommenderEmails: [''],
  });

  const [submitted, setSubmitted] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string>('');

  const handleNameChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setFormData({ ...formData, fullName: e.target.value });
  };

  const handleEmailChange = (index: number, value: string): void => {
    const updated = [...formData.recommenderEmails];
    updated[index] = value;
    setFormData({ ...formData, recommenderEmails: updated });
  };

  const addRecommender = (): void => {
    if (formData.recommenderEmails.length < 3) {
      setFormData({
        ...formData,
        recommenderEmails: [...formData.recommenderEmails, ''],
      });
    }
  };

  const removeRecommender = (index: number): void => {
    if (index === 0) return;
    const updated = formData.recommenderEmails.filter((_, i) => i !== index);
    setFormData({ ...formData, recommenderEmails: updated });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setSubmitError('');

    const filledEmails = formData.recommenderEmails.filter(email => email.trim() !== '');
    if (filledEmails.length === 0) {
      setSubmitError('Please enter at least one recommender email address.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const invalidEmails = filledEmails.filter(email => !emailRegex.test(email));
    if (invalidEmails.length > 0) {
      setSubmitError(`Invalid email address(es): ${invalidEmails.join(', ')}`);
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(`${API_BASE}/api/recommender-forms`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          fullName: formData.fullName,
          recommenderEmails: filledEmails,
        }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.success) {
        throw new Error(data.message || data.error || 'Failed to submit form');
      }

      setSubmitted(true);
    } catch (error) {
      console.error('Recommender form submission error:', error);
      setSubmitError(error instanceof Error ? error.message : 'Failed to submit form');
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="bg-white shadow-lg">
          <div className="max-w-5xl mx-auto px-6 py-8">
            <div className="flex items-center gap-6">
              <img
                src="/Logo.png"
                alt="Children's Foundation of America Logo"
                className="h-16 w-16 object-contain flex-shrink-0"
              />
              <div>
                <h1 className="text-3xl font-bold text-indigo-900 mb-2">
                  Children's Foundation of America
                </h1>
                <p className="text-gray-600">Scholarship Portal</p>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-3xl mx-auto p-4 sm:p-6 md:p-10">
          <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 text-center">
            <CheckCircle className="w-24 h-24 text-green-500 mx-auto mb-6" />
            <h1 className="text-4xl font-bold text-gray-800 mb-4">Submitted Successfully!</h1>
            <p className="text-lg text-gray-600 mb-6">
              Thank you! Your recommender(s) will receive an email from the Children's Foundation of America asking them to submit a recommendation on your behalf.
            </p>
            <p className="text-gray-600 mb-8">
              If you have any questions, please contact us at (909) 426-0773
            </p>
            <Link
              href="/"
              className="inline-flex items-center justify-center px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-lg">
        <div className="max-w-5xl mx-auto px-6 py-8">
          <div className="flex items-center gap-6">
            <img
              src="/Logo.png"
              alt="Children's Foundation of America Logo"
              className="h-16 w-16 object-contain flex-shrink-0"
            />
            <div>
              <h1 className="text-3xl font-bold text-indigo-900 mb-2">
                Children's Foundation of America
              </h1>
              <p className="text-gray-600">Scholarship Portal</p>
            </div>
          </div>
        </div>
      </div>

      {/* Form Content */}
      <div className="max-w-5xl mx-auto px-6 py-8 pb-12">
        <div className="bg-white rounded-lg shadow-xl p-8">

          {/* Info Banner */}
          <div className="bg-blue-50 border-l-4 border-blue-500 p-6 mb-8">
            <div className="flex items-start">
              <Users className="w-6 h-6 text-blue-600 mr-3 mt-1 flex-shrink-0" />
              <div>
                <h3 className="text-lg font-bold text-blue-900 mb-2">Recommender Emails</h3>
                <p className="text-sm text-gray-700">
                  Please provide the email address of at least one recommender. You may add up to 3 recommenders.
                  Each person will receive an email from the Children's Foundation of America asking them to submit
                  a recommendation on your behalf. Make sure all email addresses are accurate before submitting.
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Full Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Your Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleNameChange}
                placeholder="First and last name"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                required
              />
            </div>

            {/* Recommender Emails */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Recommender Email Address(es) <span className="text-red-500">*</span>
              </label>
              <p className="text-sm text-gray-500 mb-4">
                At least 1 required · Maximum 3 recommenders
              </p>

              <div className="space-y-3">
                {formData.recommenderEmails.map((email, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-7 h-7 rounded-full bg-indigo-100 text-indigo-700 text-xs font-semibold flex-shrink-0">
                      {index + 1}
                    </div>
                    <input
                      type="email"
                      value={email}
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        handleEmailChange(index, e.target.value)
                      }
                      placeholder={`Recommender ${index + 1} email address`}
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      required={index === 0}
                    />
                    {index > 0 && (
                      <button
                        type="button"
                        onClick={() => removeRecommender(index)}
                        className="flex items-center justify-center w-9 h-9 rounded-full border border-red-200 text-red-400 hover:bg-red-50 hover:text-red-600 hover:border-red-300 transition-colors flex-shrink-0"
                        aria-label="Remove recommender"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {formData.recommenderEmails.length < 3 && (
                <button
                  type="button"
                  onClick={addRecommender}
                  className="mt-4 inline-flex items-center gap-2 text-sm text-indigo-600 hover:text-indigo-800 font-medium transition-colors"
                >
                  <span className="text-lg leading-none">+</span>
                  Add another recommender
                  <span className="text-gray-400 font-normal">
                    ({3 - formData.recommenderEmails.length} remaining)
                  </span>
                </button>
              )}

              {formData.recommenderEmails.length === 3 && (
                <p className="mt-4 text-sm text-gray-400 italic">
                  Maximum of 3 recommenders reached.
                </p>
              )}
            </div>

            {/* Warning note */}
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
              <div className="flex items-start">
                <AlertCircle className="w-5 h-5 text-yellow-500 mr-3 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-gray-700">
                  Please double-check all email addresses before submitting. Recommenders will be
                  contacted directly at the addresses you provide.
                </p>
              </div>
            </div>

            {submitError && (
              <div className="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {submitError}
              </div>
            )}

            {/* Submit */}
            <div className="flex justify-end pt-6 border-t-2 border-gray-200">
              <button
                type="submit"
                disabled={submitting}
                className="px-8 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
              >
                <Send className="w-5 h-5 mr-2" />
                {submitting ? 'Submitting...' : 'Submit Form'}
              </button>
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