'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';
import { motion } from 'framer-motion';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const validateEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const sendResetCode = async () => {
    if (!validateEmail(email)) {
      toast.error('Enter a valid email address');
      return;
    }
    setLoading(true);
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
      setTimeout(() => router.push('/auth/verify-reset'), 1200);
    } catch (err: any) {
      toast.error(err.message);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-100 via-white to-green-100 px-4 relative overflow-hidden">
      <Toaster position="top-center" />
      {/* Decorative animated shape */}
      <motion.div
        initial={{ opacity: 0, scale: 0.7, x: -70, y: -50 }}
        animate={{ opacity: 0.15, scale: 1, x: 0, y: 0 }}
        transition={{ duration: 1.2, type: 'spring' }}
        className="absolute top-[-100px] left-[-100px] w-[220px] h-[220px] rounded-full bg-gradient-to-tr from-green-400 to-emerald-300 blur-2xl z-0"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.7, x: 90, y: 30 }}
        animate={{ opacity: 0.15, scale: 1, x: 0, y: 0 }}
        transition={{ duration: 1.2, type: 'spring', delay: 0.5 }}
        className="absolute bottom-[-110px] right-[-90px] w-[180px] h-[180px] rounded-full bg-gradient-to-tr from-emerald-300 to-green-400 blur-2xl z-0"
      />

      <motion.div
        className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-sm space-y-6 flex flex-col items-center z-10"
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
              <path d="M12 17v.01" />
              <path d="M12 12a2 2 0 1 0-2-2" />
              <circle cx="12" cy="10" r="8" />
            </svg>
          </span>
          <h2 className="text-2xl font-bold text-emerald-700 text-center">Forgot Password</h2>
          <p className="text-gray-500 text-center text-sm mt-1">Enter your email to receive a reset OTP</p>
        </motion.div>

        <motion.input
          type="email"
          placeholder="Enter your email"
          className="w-full border border-emerald-200 px-4 py-2 rounded focus:ring-2 focus:ring-emerald-400 bg-white/90 transition placeholder:text-gray-400 text-gray-800 font-medium"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.3 }}
          disabled={loading}
        />

        <motion.button
          onClick={sendResetCode}
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
          {loading ? 'Sending...' : 'Send OTP'}
        </motion.button>
      </motion.div>
    </div>
  );
}