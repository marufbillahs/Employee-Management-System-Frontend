'use client';
import { useState } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { useRouter } from 'next/navigation';

const RegisterPage = () => {
  const [step, setStep] = useState(1);
  const [otp, setOtp] = useState('');
  const [email, setEmail] = useState('');
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

    try {
      const res = await axios.post('http://localhost:4000/auth/register', data);
      toast.success(res.data.message || 'OTP sent to email');
      setEmail(data.email);
      setStep(2);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Registration failed');
    }
  };

  const verifyOtp = async () => {
    if (!otp) {
      toast.error('Enter the code');
      return;
    }

    try {
      const res = await axios.post('http://localhost:4000/auth/verify', {
        email,
        code: otp,
      });
      toast.success(res.data.message || 'Verification successful');
      router.push('/auth/login');
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Verification failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <Toaster />
      <div className="bg-white p-6 rounded-lg shadow w-full max-w-sm space-y-4">
        {step === 1 ? (
          <>
            <h2 className="text-xl font-semibold text-center">Register</h2>
            <input
              type="text"
              placeholder="Name"
              className="w-full border px-3 py-2 rounded"
              value={data.name}
              onChange={e => setData({ ...data, name: e.target.value })}
            />
            <input
              type="email"
              placeholder="Email"
              className="w-full border px-3 py-2 rounded"
              value={data.email}
              onChange={e => setData({ ...data, email: e.target.value })}
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full border px-3 py-2 rounded"
              value={data.password}
              onChange={e => setData({ ...data, password: e.target.value })}
            />
            <select
              className="w-full border px-3 py-2 rounded"
              value={data.role}
              onChange={e => setData({ ...data, role: e.target.value })}
            >
              <option value="employee">Employee</option>
              <option value="admin">Admin</option>
              <option value="hr_manager">HR Manager</option>
              <option value="department_manager">Department Manager</option>
            </select>
            <button
              onClick={register}
              className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded"
            >
              Register
            </button>
          </>
        ) : (
          <>
            <h2 className="text-xl font-semibold text-center">Enter OTP</h2>
            <p className="text-sm text-gray-500 text-center">Sent to: {email}</p>
            <input
              type="text"
              placeholder="6-digit code"
              className="w-full border px-3 py-2 rounded text-center"
              maxLength={6}
              value={otp}
              onChange={e => setOtp(e.target.value)}
            />
            <button
              onClick={verifyOtp}
              className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded"
            >
              Verify
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default RegisterPage;
