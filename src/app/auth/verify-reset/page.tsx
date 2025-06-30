'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';
import { motion } from 'framer-motion';

export default function VerifyResetPage() {
  const [code, setCode] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const savedEmail = localStorage.getItem('reset_email');
    if (!savedEmail) router.push('/auth/forgot-password');
    setEmail(savedEmail || '');
  }, [router]);

  const verifyCode = async () => {
    if (code.trim().length !== 6 || !/^\d{6}$/.test(code.trim())) {
      toast.error('Code must be 6 digits');
      return;
    }
    setLoading(true);
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
      setTimeout(() => router.push('/auth/reset-password'), 1000);
    } catch (err: any) {
      toast.error(err.message);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-100 via-white to-green-100 px-4 relative overflow-hidden">
      <Toaster position="top-center" />
      {/* Animated decorative shapes */}
      <motion.div
        initial={{ opacity: 0, scale: 0.7, x: -70, y: -50 }}
        animate={{ opacity: 0.15, scale: 1, x: 0, y: 0 }}
        transition={{ duration: 1.2, type: 'spring' }}
        className="absolute top-[-100px] left-[-100px] w-[180px] h-[180px] rounded-full bg-gradient-to-tr from-green-400 to-emerald-300 blur-2xl z-0"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.7, x: 90, y: 30 }}
        animate={{ opacity: 0.13, scale: 1, x: 0, y: 0 }}
        transition={{ duration: 1.2, type: 'spring', delay: 0.4 }}
        className="absolute bottom-[-100px] right-[-80px] w-[140px] h-[140px] rounded-full bg-gradient-to-tr from-emerald-300 to-green-400 blur-2xl z-0"
      />
      <motion.div
        className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-sm space-y-7 flex flex-col items-center z-10"
        initial={{ scale: 0.92, opacity: 0, y: 40 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ duration: 0.7, type: 'spring' }}
      >
        <motion.div
          initial={{ y: -18, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="flex flex-col items-center"
        >
          <span className="inline-block rounded-full bg-emerald-100 p-2 mb-2 shadow-sm">
            <svg width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="#10b981" strokeWidth="2">
              <path d="M12 12v2m0 4h.01M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9Zm-9-5a1 1 0 1 0 0 2 1 1 0 0 0 0-2Z"/>
            </svg>
          </span>
          <h2 className="text-2xl font-bold text-emerald-700 text-center">Verify OTP</h2>
          <p className="text-gray-500 text-center text-sm mt-1">Enter the 6-digit OTP sent to your email</p>
        </motion.div>

        <motion.input
          type="text"
          inputMode="numeric"
          maxLength={6}
          placeholder="Enter 6-digit OTP"
          className="w-full border border-emerald-200 px-4 py-2 rounded focus:ring-2 focus:ring-emerald-400 bg-white/90 transition placeholder:text-gray-400 text-gray-800 font-medium tracking-widest text-center text-lg"
          value={code}
          onChange={(e) => setCode(e.target.value.replace(/[^0-9]/g, ''))}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.3 }}
          disabled={loading}
        />

        <motion.button
          onClick={verifyCode}
          className={`w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white py-2 rounded-lg font-semibold shadow-md transition-all duration-150 flex items-center justify-center gap-2 text-base active:scale-98 ${loading ? 'opacity-60 cursor-not-allowed' : ''}`}
          disabled={loading}
          whileHover={{ scale: !loading ? 1.04 : 1 }}
          whileTap={{ scale: !loading ? 0.97 : 1 }}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.3 }}
        >
          {loading && (
            <motion.span
              className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"
              aria-label="Loading..."
            />
          )}
          {loading ? 'Verifying...' : 'Verify'}
        </motion.button>
      </motion.div>
    </div>
  );
}