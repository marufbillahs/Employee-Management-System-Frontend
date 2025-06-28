'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';

export default function VerifyResetPage() {
  const [code, setCode] = useState('');
  const [email, setEmail] = useState('');
  const router = useRouter();

  useEffect(() => {
    const savedEmail = localStorage.getItem('reset_email');
    if (!savedEmail) router.push('/auth/forgot-password');
    setEmail(savedEmail || '');
  }, [router]);

  const verifyCode = async () => {
    if (code.trim().length !== 6) {
      toast.error('Code must be 6 digits');
      return;
    }

    try {
      const res = await fetch('http://localhost:4000/auth/verifyresetcode', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Invalid or expired code');
      }

      toast.success('Code verified');
      router.push('/auth/reset-password');
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <Toaster />
      <div className="bg-white p-6 rounded-lg shadow w-full max-w-sm space-y-4">
        <h2 className="text-xl font-semibold text-center">Verify OTP</h2>
        <input
          type="text"
          placeholder="Enter 6-digit OTP"
          className="w-full border px-3 py-2 rounded"
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />
        <button
          onClick={verifyCode}
          className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded"
        >
          Verify
        </button>
      </div>
    </div>
  );
}
