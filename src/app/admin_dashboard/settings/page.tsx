'use client';

import { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import toast from 'react-hot-toast';

export default function SettingsPage() {
  const [adminId, setAdminId] = useState<number | null>(null);
  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    const token = document.cookie.split('; ').find(c => c.startsWith('token='))?.split('=')[1];
    if (token) {
      try {
        const decoded: any = jwtDecode(token);
        setAdminId(decoded.sub);
      } catch (err) {
        toast.error('Failed to decode token');
      }
    }
  }, []);

  const handleRequestCode = async () => {
    try {
      const res = await fetch(`http://localhost:4000/auth/admin/${adminId}/request-reset`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) throw new Error();
      toast.success('Verification code sent to your email');
    } catch {
      toast.error('Failed to send reset code');
    }
  };

  const handleResetPassword = async () => {
    try {
      const verifyRes = await fetch(`http://localhost:4000/auth/admin/${adminId}/verify-reset-code`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: resetCode }),
      });

      if (!verifyRes.ok) throw new Error('Invalid or expired code');

      const resetRes = await fetch(`http://localhost:4000/auth/admin/${adminId}/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newPassword }),
      });

      if (!resetRes.ok) throw new Error('Failed to reset password');

      toast.success('Password reset successful!');
    } catch (err) {
      toast.error((err as any).message || 'Reset failed');
    }
  };

  return (
    <div className="max-w-lg mx-auto bg-white shadow p-6 rounded space-y-4">
      <h1 className="text-xl font-semibold">Reset Password</h1>

      <input
        type="email"
        placeholder="Your registered email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full border px-3 py-2 rounded"
      />

      <button
        onClick={handleRequestCode}
        className="bg-blue-500 text-white px-4 py-2 rounded w-full"
      >
        Send Verification Code
      </button>

      <input
        type="text"
        placeholder="Enter verification code"
        value={resetCode}
        onChange={(e) => setResetCode(e.target.value)}
        className="w-full border px-3 py-2 rounded"
      />

      <input
        type="password"
        placeholder="New Password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        className="w-full border px-3 py-2 rounded"
      />

      <button
        onClick={handleResetPassword}
        className="bg-green-500 text-white px-4 py-2 rounded w-full"
      >
        Confirm Reset
      </button>
    </div>
  );
}
