'use client';


import { useRouter } from 'next/navigation';
import {
  Home, Users, Calendar, Bell, FileText, LogOut, Search, MessageSquare,
  Settings
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import { isTokenValid } from '@/lib/auth';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [adminName, setAdminName] = useState('');
  const router = useRouter();

  useEffect(() => {
    const token = document.cookie.split('; ').find(c => c.startsWith('token='))?.split('=')[1];
    const role = localStorage.getItem('role');

    if (!isTokenValid(token ?? null) || role !== 'admin') {
      router.push('/auth/login');
      return;
    }

    try {
      const decoded: any = jwtDecode(token!);
      setAdminName(decoded?.name || 'Admin');
    } catch {
      setAdminName('Admin');
    }
  }, [router]);

  const logout = () => {
    document.cookie = 'token=; Max-Age=0; path=/;';
    localStorage.removeItem('role');
    router.push('/auth/login');
  };

  const navItems = [
    { name: 'Dashboard', icon: <Home />, href: '/admin_dashboard' },
    { name: 'Employee', icon: <Users />, href: '/admin_dashboard/employee' },
    { name: 'Leave', icon: <FileText />, href: '/admin_dashboard/leave' },
    { name: 'Attendance', icon: <Bell />, href: '/admin_dashboard/attendance' },
    { name: 'Notice', icon: <MessageSquare/>, href: '/admin_dashboard/notice' },
    { name: 'Reports', icon: <FileText />, href: '/admin_dashboard/reports' },
    { name: 'Settings', icon: <Settings />, href: '/admin_dashboard/settings' },
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
          <button onClick={logout} className="flex items-center text-gray-700 hover:text-red-500">
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
            </div>
            <div className="text-sm font-semibold text-gray-700">Hello, {adminName}</div>
            <img
              src="https://i.pravatar.cc/40"
              className="w-10 h-10 rounded-full object-cover"
              alt="profile"
            />
          </div>
        </header>

        <main className="p-6 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}