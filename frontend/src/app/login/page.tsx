"use client";

import { User, Shield, ArrowRight } from "lucide-react";

export default function HomePage() {
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
              <h1 className="text-3xl font-bold text-indigo-900">
                Children&apos;s Foundation of America
              </h1>
              <p className="text-gray-600">Scholarship Portal</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-6 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            Welcome to the CFA Scholarship Portal
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Supporting present and former foster youth in pursuing their academic and
            vocational education goals.
          </p>
        </div>

        {/* Login Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Student Login Card */}
          <div className="bg-white rounded-lg shadow-xl p-8">
            <div className="w-12 h-12 rounded-full bg-violet-100 flex items-center justify-center mb-6">
              <User className="w-6 h-6 text-violet-600" />
            </div>

            <h3 className="text-xl font-bold text-gray-800 mb-3">
              Student Login
            </h3>

            <p className="text-gray-600 mb-6">
              Access your scholarship applications and manage your awards
            </p>

            <button className="inline-flex items-center gap-2 text-violet-600 font-semibold hover:gap-3 transition-all duration-200">
              Continue as Student
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Admin Login Card */}
          <div className="bg-white rounded-lg shadow-xl p-8">
            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-6">
              <Shield className="w-6 h-6 text-green-600" />
            </div>

            <h3 className="text-xl font-bold text-gray-800 mb-3">
              Admin Login
            </h3>

            <p className="text-gray-600 mb-6">
              Manage applications, review submissions, and oversee the scholarship program
            </p>

            <button className="inline-flex items-center gap-2 text-green-600 font-semibold hover:gap-3 transition-all duration-200">
              Continue as Admin
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
