'use client';

import { useState } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { useRouter } from 'next/navigation';

const LoginPage = () => {
  const [data, setData] = useState({ email: '', password: '' });
  const router = useRouter();

  const login = async () => {
    try {
      const res = await axios.post('http://localhost:4000/auth/login', data);
      const { access_token, role } = res.data;

      // Set token in cookie (middleware uses this)
      document.cookie = `token=${access_token}; path=/; max-age=86400; SameSite=Lax`;

      // Store role in localStorage (client-side access)
      localStorage.setItem('role', role);

      toast.success('Login successful');

      // Redirect based on role
      switch (role) {
        case 'admin':
          router.push('/admin');
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
          break;
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Invalid credentials');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <Toaster />
      <div className="bg-white p-6 rounded-lg shadow w-full max-w-sm space-y-4">
        <h2 className="text-xl font-semibold text-center">Login</h2>
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
        <button
          onClick={login}
          className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded"
        >
          Login
        </button>
        <p
          className="text-center text-sm text-blue-600 hover:underline cursor-pointer"
          onClick={() => router.push('/auth/register')}
        >
          Don&apos;t have an account? Register
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
