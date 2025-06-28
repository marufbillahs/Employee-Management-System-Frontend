'use client';

import { useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';

export default function SettingsPage() {
  const [step, setStep] = useState<'email' | 'verify' | 'reset'>('email');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const validateEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const sendResetCode = async () => {
    if (!validateEmail(email)) {
      toast.error('Please enter a valid email');
      return;
    }

    try {
      const res = await fetch('http://localhost:4000/auth/requestreset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) throw new Error((await res.json()).message);

      toast.success('OTP sent to your email');
      setStep('verify');
    } catch (err: any) {
      toast.error(err.message || 'Failed to send code');
    }
  };

  const verifyOTP = async () => {
    if (code.trim().length !== 6) {
      toast.error('OTP must be 6 digits');
      return;
    }

    try {
      const res = await fetch('http://localhost:4000/auth/verifyresetcode', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code }),
      });

      if (!res.ok) throw new Error((await res.json()).message);

      toast.success('OTP verified');
      setStep('reset');
    } catch (err: any) {
      toast.error(err.message || 'Invalid or expired code');
    }
  };

  const resetPassword = async () => {
    if (newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    try {
      const res = await fetch('http://localhost:4000/auth/resetpassword', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, newPassword }),
      });

      if (!res.ok) throw new Error((await res.json()).message);

      toast.success('Password changed successfully');
      setStep('email');
      setEmail('');
      setCode('');
      setNewPassword('');
    } catch (err: any) {
      toast.error(err.message || 'Reset failed');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-100px)]">
      <Toaster />
      <div className="bg-white shadow-xl rounded-xl w-full max-w-md px-8 py-10 space-y-6">
        <h2 className="text-2xl font-bold text-center text-gray-800">🔐 Reset Password</h2>
        <p className="text-sm text-gray-500 text-center">Update your password securely in 3 steps.</p>

        {step === 'email' && (
          <>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-600">Email</label>
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <button
              onClick={sendResetCode}
              className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 rounded-md transition-all duration-200"
            >
              Send OTP
            </button>
          </>
        )}

        {step === 'verify' && (
          <>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-600">OTP</label>
              <input
                type="text"
                placeholder="6-digit OTP"
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                value={code}
                onChange={(e) => setCode(e.target.value)}
              />
            </div>
            <button
              onClick={verifyOTP}
              className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 rounded-md transition-all duration-200"
            >
              Verify Code
            </button>
            <p className="text-xs text-center text-gray-500 mt-1">
              <button onClick={() => setStep('email')} className="underline text-green-600 hover:text-green-700">
                Change Email
              </button>
            </p>
          </>
        )}

        {step === 'reset' && (
          <>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-600">New Password</label>
              <input
                type="password"
                placeholder="At least 6 characters"
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
            <button
              onClick={resetPassword}
              className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 rounded-md transition-all duration-200"
            >
              Confirm Reset
            </button>
          </>
        )}
      </div>
    </div>
  );
}
