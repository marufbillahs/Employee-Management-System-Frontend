'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const router = useRouter();

  const validateEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const sendResetCode = async () => {
    if (!validateEmail(email)) {
      toast.error('Enter a valid email address');
      return;
    }

    try {
      const res = await fetch('http://localhost:4000/auth/requestreset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Failed to send code');
      }

      localStorage.setItem('reset_email', email);
      toast.success('OTP sent to your email');
      router.push('/auth/verify-reset');
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <Toaster />
      <div className="bg-white p-6 rounded-lg shadow w-full max-w-sm space-y-4">
        <h2 className="text-xl font-semibold text-center">Forgot Password</h2>
        <input
          type="email"
          placeholder="Enter your email"
          className="w-full border px-3 py-2 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button
          onClick={sendResetCode}
          className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded"
        >
          Send OTP
        </button>
      </div>
    </div>
  );
}
