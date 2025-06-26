'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Home, Users, Calendar, Bell, FileText, Settings, LogOut,
  Search, MessageSquare
} from 'lucide-react';
import { isTokenValid } from '@/lib/auth';

export default function AdminDashboard() {
  const [employeeCount, setEmployeeCount] = useState(0);
  const [leaveCount, setLeaveCount] = useState(0);
  const [departmentCount, setDepartmentCount] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const token = getCookie('token');
    const role = localStorage.getItem('role'); // Still used for client-side UI

    if (!isTokenValid(token) || role !== 'admin') {
      router.push('/auth/login');
      return;
    }

    const fetchCounts = async () => {
      try {
        const [empRes, leaveRes, deptRes] = await Promise.all([
          fetch('http://localhost:4000/employee/all', {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch('http://localhost:4000/leave/all', {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch('http://localhost:4000/employee/departments', {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        const employees = await empRes.json();
        const leaves = await leaveRes.json();
        const departments = await deptRes.json();

        setEmployeeCount(employees.length || 0);
        setLeaveCount(leaves.length || 0);
        setDepartmentCount(departments.length || 0);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      }
    };

    fetchCounts();
  }, [router]);

  const getCookie = (name: string): string | null => {
    const match = document.cookie
      .split('; ')
      .find(row => row.startsWith(name + '='));
    return match ? decodeURIComponent(match.split('=')[1]) : null;
  };

  const logout = () => {
    document.cookie = 'token=; Max-Age=0; path=/;';
    localStorage.removeItem('role');
    router.push('/auth/login');
  };

  const navItems = [
    { name: 'Dashboard', icon: <Home />, href: '/admin' },
    { name: 'Employee', icon: <Users />, href: '/employee' },
    { name: 'Leave', icon: <Calendar />, href: '/leave' },
    { name: 'Post Notice', icon: <Bell />, href: '#' },
    { name: 'Reports', icon: <FileText />, href: '#' },
    { name: 'Settings', icon: <Settings />, href: '#' },
  ];

  return (
    <div className="flex h-screen">
      <aside className="w-64 bg-white shadow-md flex flex-col justify-between">
        <div>
          <div className="text-xl font-bold px-6 py-4 border-b">
            Dashboard <span className="text-xs">v1</span>
          </div>
          <nav className="mt-4 space-y-2">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="flex items-center px-6 py-3 text-gray-700 hover:bg-gray-100"
              >
                <span className="mr-3">{item.icon}</span> {item.name}
              </a>
            ))}
          </nav>
        </div>
        <div className="p-4 border-t">
          <button
            onClick={logout}
            className="flex items-center text-gray-700 hover:text-red-500"
          >
            <LogOut className="mr-2" size={18} /> Logout
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col bg-gray-100">
        <header className="bg-white p-4 shadow flex items-center justify-between">
          <input
            type="text"
            placeholder="Search here"
            className="border rounded px-4 py-2 w-1/3"
          />
          <div className="flex items-center gap-4">
            <div className="flex gap-3 text-gray-500">
              <Search />
              <MessageSquare />
              <Bell />
              <Settings />
            </div>
            <div className="text-sm font-semibold text-gray-700">Hello, Maruf</div>
            <img
              src="https://i.pravatar.cc/40"
              className="w-10 h-10 rounded-full object-cover"
              alt="profile"
            />
          </div>
        </header>

        <main className="p-6 overflow-y-auto">
          <h1 className="text-2xl font-semibold">Dashboard</h1>
          <p className="text-sm text-gray-500 mb-6">Hi, Maruf! Welcome back to Admin!</p>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <Card title="Total Employees" value={employeeCount} subtitle="29 applications need review" />
            <Card title="Total Leave" value={leaveCount} subtitle="22 leave plans need approval" />
            <Card title="Total Departments" value={departmentCount} subtitle="Current active departments" />
            <Card title="Overtime" value={677} subtitle="45 schedules need approval" />
          </div>
        </main>
      </div>
    </div>
  );
}

const Card = ({ title, value, subtitle }: { title: string; value: number; subtitle: string }) => (
  <div className="bg-white rounded-xl shadow p-4">
    <h2 className="text-sm text-gray-500">{title}</h2>
    <p className="text-2xl font-bold">{value}</p>
    <span className="text-xs text-gray-600">{subtitle}</span>
  </div>
);
