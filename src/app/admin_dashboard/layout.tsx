'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Home,
  Users,
  Bell,
  FileText,
  LogOut,
  Search,
  MessageSquare,
  Settings,
  User,
} from 'lucide-react';
import { isTokenValid } from '@/lib/auth';
import { jwtDecode } from 'jwt-decode';
import Link from 'next/link';
import Head from 'next/head';
import { motion } from 'framer-motion';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [adminName, setAdminName] = useState('');
  const [employees, setEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();

  useEffect(() => {
    const token = document.cookie.split('; ').find(c => c.startsWith('token='))?.split('=')[1];
    const role = localStorage.getItem('role');

    if (!isTokenValid(token ?? null) || role !== 'admin') {
      router.push('/auth/login');
      return;
    }

    const fetchAdminNameFromNotice = async () => {
      try {
        const decoded: any = jwtDecode(token!);
        const adminId = decoded?.id;

        const res = await fetch('http://localhost:4000/notice', {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();
        const noticeByAdmin = data.find((n: any) => n.adminId === adminId);

        if (noticeByAdmin?.adminName) {
          setAdminName(noticeByAdmin.adminName);
        } else {
          setAdminName('Admin');
        }
      } catch {
        setAdminName('Admin');
      }
    };

    const fetchEmployees = async () => {
      try {
        const res = await fetch('http://localhost:4000/employee/all', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setEmployees(data);
      } catch (err) {
        console.error('Failed to load employees');
      }
    };

    fetchAdminNameFromNotice();
    fetchEmployees();
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
    { name: 'Notice', icon: <MessageSquare />, href: '/admin_dashboard/notice' },
    { name: 'Reports', icon: <FileText />, href: '/admin_dashboard/reports' },
    { name: 'Settings', icon: <Settings />, href: '/admin_dashboard/settings' },
  ];

  const filteredEmployees = employees.filter((emp: any) =>
    emp.name.toLowerCase().includes(searchTerm.toLowerCase())
  );


  return (
    <>
      <Head>
        <title>NEXTPHASE Admin</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="flex h-screen bg-gradient-to-tr from-[#f6f6f8] via-[#f9f9fa] to-[#f3f3f7]">
        {/* Sidebar */}
        <motion.aside
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6, type: 'spring' }}
          className="w-72 bg-gradient-to-b from-[#efefef] via-[#f8f8fa] to-[#f3f3f7] shadow-xl flex flex-col justify-between"
        >
          <div>
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, type: 'spring' }}
              className="flex flex-col items-center justify-center px-6 py-7 border-b border-[#e0e0e6]"
            >
              <img
                src="/NestPhase.jpg"
                alt="NestPhase Logo"
                className="h-14 w-auto rounded-lg shadow-lg border-2 border-white mb-2 bg-white"
                style={{
                  objectFit: 'cover',
                  boxShadow: '0 2px 16px 0 #e0e0e6'
                }}
              />
              <span className="text-[#44475a] text-2xl font-extrabold tracking-widest drop-shadow-lg">
                NEXTPHASE
              </span>
            </motion.div>
            <nav className="mt-9 space-y-3">
              {navItems.map((item, idx) => (
                <motion.div
                  key={item.name}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.13 + idx * 0.07, duration: 0.3, type: 'spring' }}
                >
                  <Link
                    href={item.href}
                    className="flex items-center px-8 py-3 rounded-2xl text-[#44475a] font-medium hover:bg-gradient-to-r hover:from-[#ededed]/90 hover:to-[#f6f6f8]/90 hover:shadow-md transition-all duration-200 gap-4 group"
                  >
                    <span className="group-hover:scale-125 transition-transform">{item.icon}</span>
                    <span>{item.name}</span>
                  </Link>
                </motion.div>
              ))}
            </nav>
          </div>
          <div className="p-7 border-t border-[#e0e0e6]">
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 3px 14px #ededed" }}
              whileTap={{ scale: 0.97 }}
              onClick={logout}
              className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-gradient-to-r from-[#ededed] via-[#f9f9fa] to-[#f3f3f7] text-[#44475a] text-lg font-semibold shadow-lg hover:from-[#eaeaea] hover:to-[#f6f6f8] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#ededed]"
            >
              <LogOut size={22} /> Logout
            </motion.button>
          </div>
        </motion.aside>

        {/* Main content */}
        <div className="flex-1 flex flex-col min-h-0">
          {/* Header */}
          <motion.header
            initial={{ y: -32, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.7, type: 'spring' }}
            className="bg-gradient-to-r from-white via-[#f9f9fa] to-[#f6f6f8] backdrop-blur-lg p-7 shadow-xl flex items-center justify-between rounded-b-2xl border-b-4 border-[#ededed]"
            style={{
              position: "sticky",
              top: 0,
              zIndex: 20,
              minHeight: 80,
            }}
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="flex items-center bg-white/95 border border-[#ededed] rounded-2xl px-8 py-3 w-2/4 shadow-md focus-within:ring-2 focus-within:ring-[#ededed] transition"
            >
              <motion.div
                initial={{ rotate: 0 }}
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ repeat: Infinity, duration: 3, repeatType: 'reverse' }}
                className="mr-3"
              >
                <Search className="text-[#b0b0b9]" size={22} />
              </motion.div>
              <input
                type="text"
                placeholder="Search employees by name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-transparent outline-none w-full text-[#44475a] placeholder-[#b0b0b9] text-lg font-medium"
              />
              {searchTerm && (
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.1 }}
                  className="ml-2 text-[#b0b0b9] hover:text-[#44475a] transition"
                  onClick={() => setSearchTerm('')}
                >
                  ✕
                </motion.button>
              )}
            </motion.div>
            <div className="flex items-center gap-7">
              <div className="flex gap-5 text-[#b0b0b9]">
                <motion.span whileHover={{ scale: 1.11, rotate: 11 }}><MessageSquare /></motion.span>
                <motion.span whileHover={{ scale: 1.11, rotate: -8 }}><Bell /></motion.span>
              </div>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.25, duration: 0.5 }}
                className="flex items-center gap-4"
              >
                <motion.div
                  initial={{ scale: 0.97 }}
                  animate={{ scale: 1 }}
                  whileHover={{ scale: 1.08 }}
                  className="w-12 h-12 rounded-full bg-gradient-to-br from-[#ededed] to-[#f6f6f8] flex items-center justify-center shadow-md border-2 border-white"
                >
                  <User size={26} className="text-[#b0b0b9]" />
                </motion.div>
                <span className="text-lg font-bold text-[#44475a] tracking-wide">
                  Hello, {adminName}
                </span>
              </motion.div>
            </div>
          </motion.header>

          {/* Search results */}
          {searchTerm && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="bg-white/95 shadow-md mx-10 mt-8 p-8 rounded-2xl border border-[#ededed]"
            >
              <h3 className="text-[#44475a] font-bold mb-4 text-xl tracking-wide">Search Results:</h3>
              <ul className="space-y-3">
                {filteredEmployees.map((emp: any) => (
                  <motion.li
                    key={emp.id}
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.2 }}
                    className="text-lg text-[#44475a] font-medium flex items-center gap-2"
                  >
                    <span className="font-bold">{emp.name}</span>
                    <span className="mx-2 text-[#b0b0b9]">—</span>
                    <span className="italic">{emp.position}</span>
                  </motion.li>
                ))}
                {filteredEmployees.length === 0 && (
                  <li className="text-lg text-[#b0b0b9]">No employee found</li>
                )}
              </ul>
            </motion.div>
          )}

          {/* Main Content */}
          <motion.main
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="p-10 flex-1 min-h-0 overflow-y-auto"
            style={{
              background: "linear-gradient(110deg, #f9f9fa 60%, #ededed 100%)",
              minHeight: 0,
              paddingBottom: 0,
            }}
          >
            <motion.div
              initial={{ scale: 0.97, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.7 }}
            >
              {children}
            </motion.div>
          </motion.main>
        </div>
      </div>
    </>
  );
}