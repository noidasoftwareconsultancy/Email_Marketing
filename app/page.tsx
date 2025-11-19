import Link from 'next/link';
import { 
  EnvelopeIcon, 
  ChartBarIcon, 
  UserGroupIcon,
  DocumentTextIcon,
  ClockIcon,
  ShieldCheckIcon,
  BoltIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-white to-blue-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-11 h-11 bg-gradient-to-br from-blue-600 via-cyan-500 to-teal-500 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-2xl">e</span>
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent leading-none">
                  eWynk
                </span>
                <span className="text-xs text-gray-500 font-medium tracking-wider">
                  MAIL PLATFORM
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link 
                href="/dashboard" 
                className="text-gray-700 hover:text-cyan-600 font-medium transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/dashboard"
                className="bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-500 text-white px-6 py-2.5 rounded-lg font-semibold hover:shadow-lg transition-all duration-200"
              >
                Get Started Free
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="pt-20 pb-16 text-center">
          <div className="inline-flex items-center space-x-2 bg-cyan-50 px-4 py-2 rounded-full mb-6 border border-cyan-100">
            <BoltIcon className="w-5 h-5 text-cyan-600" />
            <span className="text-sm font-semibold text-cyan-700">Professional Email Marketing Platform</span>
          </div>
          
          <h1 className="text-6xl md:text-7xl font-extrabold text-gray-900 mb-6 leading-tight">
            Smart Email Marketing
            <br />
            <span className="bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-500 bg-clip-text text-transparent">
              for Modern Business
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-600 mb-10 max-w-3xl mx-auto">
            Send bulk emails, manage contacts, and track campaigns with our powerful yet easy-to-use platform. Integrated with Gmail for seamless delivery.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <Link
              href="/dashboard"
              className="w-full sm:w-auto bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-500 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-2xl transition-all duration-200 transform hover:-translate-y-1"
            >
              Start Free Trial
            </Link>
            <Link
              href="/dashboard"
              className="w-full sm:w-auto bg-white text-gray-900 px-8 py-4 rounded-xl font-semibold text-lg border-2 border-gray-200 hover:border-cyan-600 transition-all duration-200"
            >
              View Demo
            </Link>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-600">
            <div className="flex items-center space-x-2">
              <CheckCircleIcon className="w-5 h-5 text-green-500" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircleIcon className="w-5 h-5 text-green-500" />
              <span>Free forever plan</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircleIcon className="w-5 h-5 text-green-500" />
              <span>Cancel anytime</span>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="py-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Everything You Need to Succeed
            </h2>
            <p className="text-xl text-gray-600">
              Powerful features designed for modern email marketing
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-shadow duration-200 border border-gray-100">
              <div className="w-12 h-12 bg-cyan-100 rounded-xl flex items-center justify-center mb-4">
                <UserGroupIcon className="w-6 h-6 text-cyan-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Contact Management</h3>
              <p className="text-gray-600 leading-relaxed">
                Import, organize, and segment your contacts with custom tags, lists, and advanced filtering options.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-shadow duration-200 border border-gray-100">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                <DocumentTextIcon className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Email Templates</h3>
              <p className="text-gray-600 leading-relaxed">
                Create beautiful, responsive email templates with our HTML editor and reusable template library.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-shadow duration-200 border border-gray-100">
              <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center mb-4">
                <EnvelopeIcon className="w-6 h-6 text-teal-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Bulk Sending</h3>
              <p className="text-gray-600 leading-relaxed">
                Send thousands of personalized emails through your Gmail account with automatic rate limiting.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-shadow duration-200 border border-gray-100">
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mb-4">
                <ChartBarIcon className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Analytics & Tracking</h3>
              <p className="text-gray-600 leading-relaxed">
                Track opens, clicks, bounces, and campaign performance with detailed analytics and reports.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-shadow duration-200 border border-gray-100">
              <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mb-4">
                <ClockIcon className="w-6 h-6 text-indigo-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Campaign Scheduling</h3>
              <p className="text-gray-600 leading-relaxed">
                Schedule campaigns for optimal delivery times and automate your email marketing workflow.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-shadow duration-200 border border-gray-100">
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mb-4">
                <ShieldCheckIcon className="w-6 h-6 text-emerald-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Gmail Integration</h3>
              <p className="text-gray-600 leading-relaxed">
                Seamlessly connect your Gmail or Google Workspace account for reliable email delivery.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="py-20">
          <div className="bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-500 rounded-3xl p-12 text-center text-white shadow-2xl">
            <h2 className="text-4xl font-bold mb-4">
              Ready to Transform Your Email Marketing?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Join thousands of businesses using eWynk Mail to grow their audience
            </p>
            <Link
              href="/dashboard"
              className="inline-block bg-white text-cyan-700 px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-2xl transition-all duration-200 transform hover:-translate-y-1"
            >
              Get Started Now - It&apos;s Free
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 via-cyan-500 to-teal-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">e</span>
              </div>
              <span className="text-white font-bold text-lg">eWynk Mail</span>
            </div>
            <p className="text-center">&copy; 2024 eWynk. All rights reserved. | <a href="https://ewynk.com" className="hover:text-cyan-400 transition-colors">ewynk.com</a></p>
          </div>
        </div>
      </footer>
    </div>
  );
}
