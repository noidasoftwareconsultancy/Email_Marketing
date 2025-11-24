'use client';

import { useState } from 'react';

export default function TestEmailPage() {
  const [to, setTo] = useState('anshulsing155@gmail.com');
  const [subject, setSubject] = useState('Test Email from eWynk');
  const [message, setMessage] = useState('This is a test email sent through Brevo SMTP!');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');

  const sendTestEmail = async () => {
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #0ea5e9;">✅ Test Email Successful!</h2>
          <p style="font-size: 16px; line-height: 1.6; color: #333;">
            ${message}
          </p>
          <hr style="border: 1px solid #e5e7eb; margin: 20px 0;">
          <p style="font-size: 14px; color: #6b7280;">
            Sent from: <strong>${process.env.NEXT_PUBLIC_COMPANY_NAME || 'eWynk'}</strong>
          </p>
          <p style="font-size: 12px; color: #9ca3af;">
            Sent at: ${new Date().toLocaleString()}
          </p>
        </div>
      `;

      const response = await fetch('/api/test-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to,
          subject,
          html,
          text: message,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setResult(data);
      } else {
        setError(data.error || 'Failed to send email');
      }
    } catch (err: any) {
      setError(err.message || 'Network error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            📧 Test Email Sender
          </h1>
          <p className="text-gray-600 mb-8">
            Send a test email using your Brevo SMTP configuration
          </p>

          <div className="space-y-6">
            {/* To Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                To Email
              </label>
              <input
                type="email"
                value={to}
                onChange={(e) => setTo(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="recipient@example.com"
              />
            </div>

            {/* Subject */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subject
              </label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Email subject"
              />
            </div>

            {/* Message */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Message
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Email message"
              />
            </div>

            {/* Send Button */}
            <button
              onClick={sendTestEmail}
              disabled={loading || !to || !subject || !message}
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Sending...' : 'Send Test Email'}
            </button>

            {/* Result */}
            {result && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h3 className="font-semibold text-green-900 mb-2">
                  ✅ Email Sent Successfully!
                </h3>
                <div className="text-sm text-green-800 space-y-1">
                  <p>
                    <strong>Message ID:</strong> {result.messageId}
                  </p>
                  <p>
                    <strong>Response:</strong> {result.response}
                  </p>
                </div>
                <p className="text-xs text-green-700 mt-3">
                  Check your inbox (and spam folder) at {to}
                </p>
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h3 className="font-semibold text-red-900 mb-2">
                  ❌ Error
                </h3>
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}

            {/* Configuration Info */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 mb-2">
                📋 Current Configuration
              </h3>
              <div className="text-sm text-blue-800 space-y-1">
                <p>
                  <strong>SMTP Host:</strong> {process.env.NEXT_PUBLIC_SMTP_HOST || 'smtp-relay.brevo.com'}
                </p>
                <p>
                  <strong>SMTP Port:</strong> {process.env.NEXT_PUBLIC_SMTP_PORT || '587'}
                </p>
                <p>
                  <strong>From Email:</strong> noidasoftwareconsultancy@gmail.com (verified)
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
