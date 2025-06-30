'use client';

import { useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

export default function SettingsPage() {
  const [step, setStep] = useState<'email' | 'verify' | 'reset'>('email');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const validateEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const sendResetCode = async () => {
    if (!validateEmail(email)) {
      toast.error('Please enter a valid email');
      return;
    }
    setLoading(true);
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
    setLoading(false);
  };

  const verifyOTP = async () => {
    if (code.trim().length !== 6) {
      toast.error('OTP must be 6 digits');
      return;
    }
    setLoading(true);
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
    setLoading(false);
  };

  const resetPassword = async () => {
    if (newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    setLoading(true);
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
    setLoading(false);
  };

  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-100px)] bg-gradient-to-br from-emerald-50 via-white to-green-50 relative overflow-hidden">
      <Toaster position="top-center" />
      {/* Animated background shapes */}
      <motion.div
        initial={{ opacity: 0, scale: 0.7, x: -80, y: -40 }}
        animate={{ opacity: 0.13, scale: 1, x: 0, y: 0 }}
        transition={{ duration: 1.1, type: 'spring' }}
        className="absolute top-[-100px] left-[-100px] w-[200px] h-[200px] rounded-full bg-gradient-to-tr from-green-400 to-emerald-300 blur-2xl z-0"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.7, x: 80, y: 40 }}
        animate={{ opacity: 0.13, scale: 1, x: 0, y: 0 }}
        transition={{ duration: 1.1, type: 'spring', delay: 0.4 }}
        className="absolute bottom-[-110px] right-[-90px] w-[160px] h-[160px] rounded-full bg-gradient-to-tr from-emerald-300 to-green-400 blur-2xl z-0"
      />

      <motion.div
        className="bg-white shadow-xl rounded-xl w-full max-w-md px-8 py-10 space-y-6 z-10"
        initial={{ opacity: 0, scale: 0.96, y: 35 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.7, type: 'spring' }}
      >
        <motion.h2
          className="text-2xl font-bold text-center text-gray-800"
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
        >
          <span role="img" aria-label="lock">🔐</span> Reset Password
        </motion.h2>
        <motion.p
          className="text-sm text-gray-500 text-center"
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          Update your password securely in 3 steps.
        </motion.p>

        <AnimatePresence mode="wait">
          {step === 'email' && (
            <motion.div
              key="email-step"
              initial={{ opacity: 0, y: 18, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.5 }}
              className="space-y-3"
            >
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-600">Email</label>
                <motion.input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  whileFocus={{ scale: 1.03, borderColor: '#10b981' }}
                />
              </div>
              <motion.button
                onClick={sendResetCode}
                className={`w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 rounded-md transition-all duration-200 flex items-center justify-center gap-2 ${loading && 'opacity-60 cursor-not-allowed'}`}
                disabled={loading}
                whileHover={{ scale: !loading ? 1.04 : 1 }}
                whileTap={{ scale: !loading ? 0.97 : 1 }}
              >
                {loading &&
                  <motion.span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                {loading ? 'Sending...' : 'Send OTP'}
              </motion.button>
            </motion.div>
          )}

          {step === 'verify' && (
            <motion.div
              key="verify-step"
              initial={{ opacity: 0, y: 18, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.5 }}
              className="space-y-3"
            >
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-600">OTP</label>
                <motion.input
                  type="text"
                  placeholder="6-digit OTP"
                  inputMode="numeric"
                  maxLength={6}
                  className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 tracking-widest text-center"
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/[^0-9]/g, ''))}
                  disabled={loading}
                  whileFocus={{ scale: 1.03, borderColor: '#10b981' }}
                />
              </div>
              <motion.button
                onClick={verifyOTP}
                className={`w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 rounded-md transition-all duration-200 flex items-center justify-center gap-2 ${loading && 'opacity-60 cursor-not-allowed'}`}
                disabled={loading}
                whileHover={{ scale: !loading ? 1.04 : 1 }}
                whileTap={{ scale: !loading ? 0.97 : 1 }}
              >
                {loading &&
                  <motion.span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                {loading ? 'Verifying...' : 'Verify Code'}
              </motion.button>
              <p className="text-xs text-center text-gray-500 mt-1">
                <button onClick={() => setStep('email')} className="underline text-green-600 hover:text-green-700">
                  Change Email
                </button>
              </p>
            </motion.div>
          )}

          {step === 'reset' && (
            <motion.div
              key="reset-step"
              initial={{ opacity: 0, y: 18, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.5 }}
              className="space-y-3"
            >
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-600">New Password</label>
                <motion.input
                  type="password"
                  placeholder="At least 6 characters"
                  className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  disabled={loading}
                  whileFocus={{ scale: 1.03, borderColor: '#10b981' }}
                />
              </div>
              <motion.button
                onClick={resetPassword}
                className={`w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 rounded-md transition-all duration-200 flex items-center justify-center gap-2 ${loading && 'opacity-60 cursor-not-allowed'}`}
                disabled={loading}
                whileHover={{ scale: !loading ? 1.04 : 1 }}
                whileTap={{ scale: !loading ? 0.97 : 1 }}
              >
                {loading &&
                  <motion.span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                {loading ? 'Resetting...' : 'Confirm Reset'}
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}