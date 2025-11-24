'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import toast from 'react-hot-toast';
import { EnvelopeIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

export function GmailConnect() {
  const [email, setEmail] = useState('access@ewynk.com');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [connected, setConnected] = useState(false);
  const [checking, setChecking] = useState(true);

  // Check connection status on mount
  useEffect(() => {
    checkConnection();
  }, []);

  const checkConnection = async () => {
    try {
      const response = await fetch('/api/user');
      if (response.ok) {
        const user = await response.json();
        const hasCredentials = user.googleTokens?.email && user.googleTokens?.password;
        setConnected(hasCredentials);
        if (hasCredentials) {
          setEmail(user.googleTokens.email);
        }
      }
    } catch (error) {
      console.error('Failed to check connection:', error);
    } finally {
      setChecking(false);
    }
  };

  const handleConnect = async () => {
    if (!email || !password) {
      toast.error('Please enter email and password');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch('/api/user/connect-smtp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Gmail connected successfully!');
        setConnected(true);
        setPassword(''); // Clear password from state
      } else {
        toast.error(data.error || 'Failed to connect');
        if (data.hint) {
          toast(data.hint, { 
            duration: 6000,
            icon: '💡',
          });
        }
      }
    } catch (error) {
      toast.error('Failed to connect Gmail');
    } finally {
      setLoading(false);
    }
  };

  const handleDisconnect = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/user/disconnect-gmail', {
        method: 'POST',
      });

      if (response.ok) {
        toast.success('Gmail disconnected');
        setConnected(false);
        setPassword('');
        setEmail('access@ewynk.com');
      } else {
        toast.error('Failed to disconnect');
      }
    } catch (error) {
      toast.error('Failed to disconnect Gmail');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Connect Gmail Account
          </h3>
          <p className="text-sm text-gray-600">
            Connect your Google Workspace account to send emails
          </p>
        </div>

        {/* Environment Variable Notice */}
        {process.env.NEXT_PUBLIC_SMTP_CONFIGURED === 'true' && (
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <CheckCircleIcon className="w-5 h-5 text-purple-600 mt-0.5" />
              <div>
                <p className="font-medium text-purple-900">SMTP Configured via Environment</p>
                <p className="text-sm text-purple-700 mt-1">
                  Your SMTP settings are configured through environment variables and will be used for all campaigns.
                  Database credentials below are optional and will be used as fallback.
                </p>
              </div>
            </div>
          </div>
        )}

        {checking ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
            <p className="text-sm text-gray-500 mt-2">Checking connection...</p>
          </div>
        ) : connected ? (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <CheckCircleIcon className="w-6 h-6 text-green-600" />
              <div className="flex-1">
                <p className="font-medium text-green-900">Gmail Connected</p>
                <p className="text-sm text-green-700">{email}</p>
                <p className="text-xs text-green-600 mt-1">Using Nodemailer SMTP</p>
              </div>
              <Button
                variant="secondary"
                size="sm"
                onClick={handleDisconnect}
                isLoading={loading}
              >
                Disconnect
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800 mb-2">
                <strong>📧 Using Nodemailer with Gmail SMTP</strong>
              </p>
              <p className="text-sm text-blue-700 mb-2">
                If you have 2-Step Verification enabled (recommended), you need to use an App Password:
              </p>
              <ol className="text-sm text-blue-700 space-y-1 ml-4 list-decimal">
                <li>Go to Google Account Security</li>
                <li>Enable 2-Step Verification</li>
                <li>Generate an App Password for "Mail"</li>
                <li>Use that 16-character password below</li>
              </ol>
              <a
                href="https://myaccount.google.com/apppasswords"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-600 hover:underline mt-2 inline-block font-medium"
              >
                Generate App Password →
              </a>
            </div>

            <Input
              label="Gmail Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="access@ewynk.com"
            />

            <Input
              label="Password / App Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your app password (16 characters)"
            />

            <Button
              onClick={handleConnect}
              isLoading={loading}
              className="w-full"
            >
              <EnvelopeIcon className="w-5 h-5 mr-2" />
              Connect Gmail with Nodemailer
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
}
