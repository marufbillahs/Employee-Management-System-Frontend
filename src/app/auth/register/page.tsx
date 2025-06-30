'use client';

import { useState } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

const RegisterPage = () => {
  const [step, setStep] = useState(1);
  const [otp, setOtp] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const [data, setData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'employee',
  });

  const register = async () => {
    if (!data.name || !data.email || !data.password || !data.role) {
      toast.error('All fields are required');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      toast.error('Enter a valid email address');
      return;
    }
    if (data.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post('http://localhost:4000/auth/register', data);
      toast.success(res.data.message || 'OTP sent to email');
      setEmail(data.email);
      setStep(2);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Registration failed');
    }
    setLoading(false);
  };

  const verifyOtp = async () => {
    if (!otp) {
      toast.error('Enter the code');
      return;
    }
    if (!/^\d{6}$/.test(otp.trim())) {
      toast.error('OTP must be 6 digits');
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post('http://localhost:4000/auth/verify', {
        email,
        code: otp,
      });
      toast.success(res.data.message || 'Verification successful');
      setTimeout(() => router.push('/auth/login'), 1000);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Verification failed');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-100 via-white to-green-100 px-4 relative overflow-hidden">
      <Toaster position="top-center" />
      {/* Decorative animated backgrounds */}
      <motion.div
        initial={{ opacity: 0, scale: 0.7, x: -70, y: -50 }}
        animate={{ opacity: 0.13, scale: 1, x: 0, y: 0 }}
        transition={{ duration: 1.1, type: 'spring' }}
        className="absolute top-[-100px] left-[-100px] w-[200px] h-[200px] rounded-full bg-gradient-to-tr from-green-400 to-emerald-300 blur-2xl z-0"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.7, x: 90, y: 30 }}
        animate={{ opacity: 0.13, scale: 1, x: 0, y: 0 }}
        transition={{ duration: 1.1, type: 'spring', delay: 0.4 }}
        className="absolute bottom-[-110px] right-[-90px] w-[160px] h-[160px] rounded-full bg-gradient-to-tr from-emerald-300 to-green-400 blur-2xl z-0"
      />

      <motion.div
        className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-sm space-y-6 flex flex-col items-center z-10"
        initial={{ scale: 0.92, opacity: 0, y: 40 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ duration: 0.7, type: 'spring' }}
      >
        {step === 1 ? (
          <>
            <motion.div
              initial={{ y: -18, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="flex flex-col items-center"
            >
              <span className="inline-block rounded-full bg-emerald-100 p-2 mb-2 shadow-sm">
                <svg width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="#10b981" strokeWidth="2">
                  <circle cx="12" cy="8" r="4"/>
                  <path d="M4 20c0-3.3137 3.134-6 7-6s7 2.6863 7 6" />
                </svg>
              </span>
              <h2 className="text-2xl font-bold text-emerald-700 text-center">Register</h2>
              <p className="text-gray-500 text-center text-sm mt-1">Create your account</p>
            </motion.div>
            <motion.input
              type="text"
              placeholder="Name"
              className="w-full border border-emerald-200 px-4 py-2 rounded focus:ring-2 focus:ring-emerald-400 bg-white/90 transition placeholder:text-gray-400 text-gray-800 font-medium"
              value={data.name}
              onChange={e => setData({ ...data, name: e.target.value })}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.3 }}
              disabled={loading}
            />
            <motion.input
              type="email"
              placeholder="Email"
              className="w-full border border-emerald-200 px-4 py-2 rounded focus:ring-2 focus:ring-emerald-400 bg-white/90 transition placeholder:text-gray-400 text-gray-800 font-medium"
              value={data.email}
              onChange={e => setData({ ...data, email: e.target.value })}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.42, duration: 0.3 }}
              disabled={loading}
            />
            <motion.input
              type="password"
              placeholder="Password"
              className="w-full border border-emerald-200 px-4 py-2 rounded focus:ring-2 focus:ring-emerald-400 bg-white/90 transition placeholder:text-gray-400 text-gray-800 font-medium"
              value={data.password}
              onChange={e => setData({ ...data, password: e.target.value })}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.47, duration: 0.3 }}
              disabled={loading}
            />
            <motion.select
              className="w-full border border-emerald-200 px-4 py-2 rounded focus:ring-2 focus:ring-emerald-400 bg-white/90 text-gray-800 font-medium"
              value={data.role}
              onChange={e => setData({ ...data, role: e.target.value })}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.52, duration: 0.3 }}
              disabled={loading}
            >
              <option value="employee">Employee</option>
              <option value="admin">Admin</option>
              <option value="hr_manager">HR Manager</option>
              <option value="department_manager">Department Manager</option>
            </motion.select>
            <motion.button
              onClick={register}
              className={`w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white py-2 rounded-lg font-semibold shadow-md transition-all duration-150 flex items-center justify-center gap-2 text-base active:scale-98 ${loading ? 'opacity-60 cursor-not-allowed' : ''}`}
              disabled={loading}
              whileHover={{ scale: !loading ? 1.04 : 1 }}
              whileTap={{ scale: !loading ? 0.97 : 1 }}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.58, duration: 0.3 }}
            >
              {loading && (
                <motion.span
                  className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"
                  aria-label="Loading..."
                />
              )}
              {loading ? 'Registering...' : 'Register'}
            </motion.button>
          </>
        ) : (
          <>
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
              <h2 className="text-2xl font-bold text-emerald-700 text-center">Enter OTP</h2>
              <p className="text-gray-500 text-center text-sm mt-1">Sent to: {email}</p>
            </motion.div>
            <motion.input
              type="text"
              placeholder="6-digit OTP"
              className="w-full border border-emerald-200 px-4 py-2 rounded text-center tracking-widest text-lg focus:ring-2 focus:ring-emerald-400 bg-white/90 transition placeholder:text-gray-400 text-gray-800 font-medium"
              maxLength={6}
              value={otp}
              onChange={e => setOtp(e.target.value.replace(/[^0-9]/g, ''))}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.3 }}
              disabled={loading}
            />
            <motion.button
              onClick={verifyOtp}
              className={`w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white py-2 rounded-lg font-semibold shadow-md transition-all duration-150 flex items-center justify-center gap-2 text-base active:scale-98 ${loading ? 'opacity-60 cursor-not-allowed' : ''}`}
              disabled={loading}
              whileHover={{ scale: !loading ? 1.04 : 1 }}
              whileTap={{ scale: !loading ? 0.97 : 1 }}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.38, duration: 0.3 }}
            >
              {loading && (
                <motion.span
                  className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"
                  aria-label="Loading..."
                />
              )}
              {loading ? 'Verifying...' : 'Verify'}
            </motion.button>
          </>
        )}
      </motion.div>
    </div>
  );
};

export default RegisterPage;