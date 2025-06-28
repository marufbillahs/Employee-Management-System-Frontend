'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';

export default function ResetPasswordPage() {
  const [newPassword, setNewPassword] = useState('');
  const [email, setEmail] = useState('');
  const router = useRouter();

  useEffect(() => {
    const savedEmail = localStorage.getItem('reset_email');
    if (!savedEmail) router.push('/auth/forgot-password');
    setEmail(savedEmail || '');
  }, [router]);

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

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Reset failed');
      }

      toast.success('Password has been reset');
      localStorage.removeItem('reset_email');
      router.push('/auth/login');
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <Toaster />
      <div className="bg-white p-6 rounded-lg shadow w-full max-w-sm space-y-4">
        <h2 className="text-xl font-semibold text-center">Set New Password</h2>
        <input
          type="password"
          placeholder="New Password"
          className="w-full border px-3 py-2 rounded"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <button
          onClick={resetPassword}
          className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded"
        >
          Reset Password
        </button>
      </div>
    </div>
  );
}
