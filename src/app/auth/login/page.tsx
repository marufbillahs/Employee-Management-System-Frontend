'use client';

import { useState } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

const LoginPage = () => {
  const [data, setData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const login = async () => {
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:4000/auth/login', data);
      const { access_token, role } = res.data;

      document.cookie = `token=${access_token}; path=/; max-age=86400; SameSite=Lax`;
      localStorage.setItem('role', role);

      toast.success('Login successful');

      setTimeout(() => {
        switch (role) {
          case 'admin':
            router.push('/admin_dashboard');
            break;
          case 'employee':
            router.push('/employee');
            break;
          case 'hr_manager':
            router.push('/hr');
            break;
          case 'department_manager':
            router.push('/department');
            break;
          default:
            router.push('/auth/login');
        }
      }, 700);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Invalid credentials');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-100 via-white to-green-100 px-4 relative overflow-hidden">

      <Toaster position="top-center" />

      <motion.div
        className="flex max-w-4xl w-full bg-white shadow-2xl rounded-xl overflow-hidden border border-green-200"
        initial={{ scale: 0.94, opacity: 0, y: 40 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ duration: 0.7, type: 'spring' }}
      >
        {/* Image section */}
        <motion.div
          className="hidden md:flex md:w-1/2 items-center justify-center bg-white"
          initial={{ opacity: 0, x: -60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, type: 'spring', delay: 0.4 }}
        >
          <img
            src="/NestPhase.jpg"
            alt="Login Visual"
            className="w-full h-full object-cover"
            style={{
              minHeight: 380,
              borderTopLeftRadius: 16,
              borderBottomLeftRadius: 16,
              boxShadow: "0 0 60px 0 #a7f3d0"
            }}
          />
        </motion.div>

        {/* Form section */}
        <div className="w-full md:w-1/2 flex flex-col justify-center px-8 py-12 space-y-8 bg-gradient-to-b from-white to-emerald-50">
          <motion.div
            className="flex flex-col items-center"
            initial={{ y: -24, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
          >
            <span className="inline-block rounded-full bg-emerald-100 p-2 mb-2 shadow-sm">
              <svg width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="#10b981" strokeWidth="2">
                <circle cx="12" cy="8" r="4"/>
                <path d="M4 20c0-3.3137 3.134-6 7-6s7 2.6863 7 6" />
              </svg>
            </span>
            <h2 className="text-3xl font-bold text-emerald-700 mb-1 tracking-tight">Welcome Back</h2>
            <p className="text-center text-gray-500">Login to your account</p>
          </motion.div>

          <motion.div
            className="space-y-5"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: {
                transition: { staggerChildren: 0.09, delayChildren: 0.4 }
              }
            }}
          >
            <motion.input
              type="email"
              placeholder="Email"
              className="w-full border border-emerald-200 px-4 py-2 rounded focus:ring-2 focus:ring-emerald-400 bg-white/90 transition placeholder:text-gray-400 text-gray-800 font-medium"
              value={data.email}
              onChange={(e) => setData({ ...data, email: e.target.value })}
              variants={{
                hidden: { opacity: 0, y: 25 },
                visible: { opacity: 1, y: 0 }
              }}
            />
            <motion.input
              type="password"
              placeholder="Password"
              className="w-full border border-emerald-200 px-4 py-2 rounded focus:ring-2 focus:ring-emerald-400 bg-white/90 transition placeholder:text-gray-400 text-gray-800 font-medium"
              value={data.password}
              onChange={(e) => setData({ ...data, password: e.target.value })}
              variants={{
                hidden: { opacity: 0, y: 25 },
                visible: { opacity: 1, y: 0 }
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') login();
              }}
            />

            <motion.button
              onClick={login}
              className={`w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white py-2 rounded-lg font-semibold shadow-md transition-all duration-150 flex items-center justify-center gap-2 text-base active:scale-98 ${loading ? 'opacity-60 cursor-not-allowed' : ''}`}
              disabled={loading}
              whileHover={{ scale: !loading ? 1.03 : 1 }}
              whileTap={{ scale: !loading ? 0.97 : 1 }}
              variants={{
                hidden: { opacity: 0, y: 25 },
                visible: { opacity: 1, y: 0 }
              }}
            >
              {loading && (
                <motion.span
                  className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"
                  aria-label="Loading..."
                />
              )}
              Login
            </motion.button>
          </motion.div>

          <motion.div
            className="text-center space-y-2 mt-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.5 }}
          >
            <p
              className="text-sm text-blue-600 hover:underline cursor-pointer"
              onClick={() => router.push('/auth/forgot-password')}
            >
              Forgot password?
            </p>
            <p
              className="text-sm text-blue-600 hover:underline cursor-pointer"
              onClick={() => router.push('/auth/register')}
            >
              Don&apos;t have an account? Register
            </p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

// Simple spinner for loading state
export default LoginPage;