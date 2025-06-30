'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { jwtDecode } from 'jwt-decode';
import { isTokenValid } from '@/lib/auth';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, Legend
} from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';

const PIE_COLORS = ['#4e60ff', '#70cc6c', '#ff6868'];
const BAR_COLORS = ['#4e60ff', '#70cc6c', '#ff6868'];

export default function AdminDashboardPage() {
  const [employeeCount, setEmployeeCount] = useState(0);
  const [leaveCount, setLeaveCount] = useState(0);
  const [departmentCount, setDepartmentCount] = useState(0);
  const [adminName, setAdminName] = useState('');
  const [employees, setEmployees] = useState<any[]>([]);
  const [leaves, setLeaves] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = document.cookie.split('; ').find(c => c.startsWith('token='))?.split('=')[1];
    const role = localStorage.getItem('role');

    if (!isTokenValid(token ?? null) || role !== 'admin') {
      router.push('/auth/login');
      return;
    }

    let adminId: number | null = null;
    try {
      const decoded: any = jwtDecode(token!);
      adminId = decoded.sub;
    } catch {
      toast.error('Invalid token');
      return;
    }

    const fetchData = async () => {
      setLoading(true);
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
          })
        ]);
        const empData = await empRes.json();
        const leavesData = await leaveRes.json();
        const departmentsData = await deptRes.json();

        setEmployees(empData || []);
        setLeaves(leavesData || []);
        setDepartments(departmentsData || []);

        setEmployeeCount(empData.length || 0);
        setLeaveCount(leavesData.length || 0);
        setDepartmentCount(departmentsData.length || 0);

        const admin = empData.find((e: any) => e.id === adminId);
        setAdminName(admin?.name || 'Admin');
      } catch {
        toast.error('Failed to load dashboard data');
      }
      setLoading(false);
    };

    fetchData();
  }, [router]);

  // Calculations for dashboard
  const overtimeCount = 677; // Example fixed, replace with API value if you have one.
  const applicationsNeedReview = leaves.filter(l => l.status === 'pending').length;
  const paidLeavePlansNeedApproval = leaves.filter(l => l.status === 'pending' && l.type === 'Paid').length;

  // Dummy employee status, replace with actual API if available
  const employeeStatus = employees.slice(0, 3).map((emp, idx) => ({
    ...emp,
    department: departments[idx % departments.length]?.name || 'N/A',
    age: 22 + idx * 2,
    discipline: idx === 0 ? '+100%' : idx === 1 ? '+99%' : '+98%',
    status: idx === 1 ? 'Contract' : 'Permanent',
    avatar: emp.profilePic || `https://randomuser.me/api/portraits/men/${idx + 30}.jpg`
  }));

  // Chart Data
  const barData = [
    { date: 'Apr 15', Sick: 9, Paid: 22, Unpaid: 7 },
    { date: 'Apr 16', Sick: 10, Paid: 18, Unpaid: 5 },
    { date: 'Apr 17', Sick: 15, Paid: 25, Unpaid: 10 },
    { date: 'Apr 18', Sick: 12, Paid: 21, Unpaid: 9 },
    { date: 'Apr 19', Sick: 7, Paid: 16, Unpaid: 8 },
    { date: 'Apr 20', Sick: 19, Paid: 28, Unpaid: 12 },
    { date: 'Apr 30', Sick: 17, Paid: 25, Unpaid: 11 },
  ];
  const performanceData = [
    { name: 'Excellent', value: 81 },
    { name: 'Good', value: 17 },
    { name: 'Need Improvement', value: 2 }
  ];
  const areaData = [
    { date: 'Aug 01', attendance: 91 },
    { date: 'Aug 03', attendance: 80 },
    { date: 'Aug 05', attendance: 89 },
    { date: 'Aug 07', attendance: 85 },
    { date: 'Aug 09', attendance: 92 },
    { date: 'Aug 11', attendance: 84 },
    { date: 'Aug 13', attendance: 88 },
    { date: 'Aug 15', attendance: 90 },
    { date: 'Aug 17', attendance: 91 },
    { date: 'Aug 19', attendance: 85 },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <motion.span
          className="text-xl text-gray-500"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          Loading dashboard...
        </motion.span>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen pb-10 px-2 md:px-6 bg-gradient-to-br from-blue-50 via-white to-green-50 overflow-x-hidden">
      {/* Decorative bubbles */}
      <motion.div
        initial={{ opacity: 0, scale: 0.7, x: -80, y: -40 }}
        animate={{ opacity: 0.10, scale: 1, x: 0, y: 0 }}
        transition={{ duration: 1.1, type: 'spring' }}
        className="absolute top-[-120px] left-[-120px] w-[280px] h-[280px] rounded-full bg-gradient-to-tr from-blue-400 via-indigo-300 to-emerald-300 blur-2xl z-0"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.7, x: 80, y: 40 }}
        animate={{ opacity: 0.10, scale: 1, x: 0, y: 0 }}
        transition={{ duration: 1.1, type: 'spring', delay: 0.4 }}
        className="absolute bottom-[-110px] right-[-90px] w-[200px] h-[200px] rounded-full bg-gradient-to-tr from-emerald-300 via-blue-200 to-blue-400 blur-2xl z-0"
      />

      {/* Welcome */}
      <motion.div
        className="pt-8 pb-2 px-2"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        <h1 className="text-4xl font-extrabold text-blue-700 drop-shadow mb-1 tracking-tight flex items-center gap-2">
          <span className="inline-block rounded-full bg-blue-100 p-2 mr-2">
            <svg width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="#4e60ff" strokeWidth="2">
              <path d="M4 20c0-3.3137 3.134-6 7-6s7 2.6863 7 6" />
              <circle cx="12" cy="8" r="4"/>
            </svg>
          </span>
          Dashboard
        </h1>
        <p className="text-md text-[#6b7280] font-medium">Hi, <span className="font-bold text-[#70cc6c]">{adminName}</span>. Welcome back to Admin!</p>
      </motion.div>

      {/* Stat Cards */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.15 }}
      >
        <StatCard
          title="Total employees"
          value={employeeCount}
          changeText={`${applicationsNeedReview} applications need review`}
          changeColor="text-[#ff6868]"
          valueColor="text-[#44475a]"
          borderColor="border-blue-500"
          icon={
            <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="#4e60ff" strokeWidth="2">
              <circle cx="12" cy="8" r="4"/>
              <path d="M4 20c0-3.3137 3.134-6 7-6s7 2.6863 7 6" />
            </svg>
          }
        />
        <StatCard
          title="Total overtime"
          value={overtimeCount}
          changeText="45 overtime schedules need approval"
          changeColor="text-[#22c55e]"
          valueColor="text-[#44475a]"
          borderColor="border-green-500"
          icon={
            <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="#22c55e" strokeWidth="2">
              <path d="M12 8v4l3 3" /><circle cx="12" cy="12" r="10" />
            </svg>
          }
        />
        <StatCard
          title="Total leave"
          value={leaveCount}
          changeText={`${paidLeavePlansNeedApproval} paid leave plans need approval`}
          changeColor="text-[#ff6868]"
          valueColor="text-[#44475a]"
          borderColor="border-red-500"
          icon={
            <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="#ff6868" strokeWidth="2">
              <path d="M8 21h8m-6-4v-4a4 4 0 1 1 8 0v4" /><rect x="2" y="7" width="20" height="14" rx="2" />
            </svg>
          }
        />
        <StatCard
          title="Total Departments"
          value={departmentCount}
          changeText={`shows the number of distinct departments currently active`}
          changeColor="text-[#b0b0b9]"
          valueColor="text-[#44475a]"
          borderColor="border-indigo-500"
          icon={
            <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="#6366f1" strokeWidth="2">
              <rect x="3" y="3" width="7" height="7" rx="2" />
              <rect x="14" y="3" width="7" height="7" rx="2" />
              <rect x="14" y="14" width="7" height="7" rx="2" />
              <rect x="3" y="14" width="7" height="7" rx="2" />
            </svg>
          }
        />
      </motion.div>

      {/* Main Area */}
      <motion.div
        className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8"
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.25 }}
      >
        {/* Employee Status Table */}
        <Card className="col-span-2 bg-gradient-to-br from-blue-50 via-white to-green-50 shadow-xl border border-blue-100/40">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-semibold text-lg text-[#44475a]">Employee Status</h3>
            <button className="px-3 py-1 rounded bg-[#f6f6f8] text-xs text-[#44475a] font-bold border border-[#e0e0e6] shadow hover:scale-105 transition">Filter & Short</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-[#b0b0b9] text-xs">
                  <th className="py-2">Employee Name</th>
                  <th>Department</th>
                  <th>Age</th>
                  <th>Discipline</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {employeeStatus.map((emp, idx) => (
                    <motion.tr
                      key={emp.id}
                      initial={{ opacity: 0, y: 18 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.97 }}
                      transition={{ duration: 0.33, delay: idx * 0.04 }}
                      className="border-t border-[#f3f3f7]"
                    >
                      <td className="flex items-center gap-3 py-2 font-medium">
                        <img src={emp.avatar} alt={emp.name} className="w-8 h-8 rounded-full border border-[#e0e0e6] object-cover" />
                        {emp.name}
                      </td>
                      <td>{emp.department}</td>
                      <td>{emp.age}</td>
                      <td className="text-blue-500">{emp.discipline}</td>
                      <td>
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${emp.status === 'Permanent' ? 'bg-[#eafaf1] text-[#22c55e]' : 'bg-[#f8f8fa] text-[#44475a]'}`}>
                          {emp.status}
                        </span>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </Card>

        {/* Time Off Statistics */}
        <Card>
          <h3 className="font-semibold text-lg text-[#44475a] mb-2">Time Off Statistics</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={barData} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" fontSize={12} />
              <YAxis fontSize={12} />
              <Tooltip />
              <Legend />
              <Bar dataKey="Sick" fill={BAR_COLORS[0]} radius={[8, 8, 0, 0]} />
              <Bar dataKey="Paid" fill={BAR_COLORS[1]} radius={[8, 8, 0, 0]} />
              <Bar dataKey="Unpaid" fill={BAR_COLORS[2]} radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </motion.div>

      {/* Lower Grid */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8"
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.35 }}
      >
        {/* Attendance Comparison Chart */}
        <Card>
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-semibold text-lg text-[#44475a]">Attendance Comparison Chart</h3>
            <div className="flex gap-2 text-xs">
              <button className="px-2 py-1 rounded bg-[#f9f9fa] border border-[#e0e0e6]">Daily</button>
              <button className="px-2 py-1 rounded bg-[#f9f9fa] border border-[#e0e0e6]">Weekly</button>
              <button className="px-2 py-1 rounded bg-[#f9f9fa] border border-[#e0e0e6]">Monthly</button>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={areaData}>
              <defs>
                <linearGradient id="colorAttendance" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4e60ff" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#4e60ff" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="date" fontSize={12} />
              <YAxis fontSize={12} />
              <Tooltip />
              <Area type="monotone" dataKey="attendance" stroke="#4e60ff" fillOpacity={1} fill="url(#colorAttendance)" />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        {/* Performance Evaluation */}
        <Card>
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-semibold text-lg text-[#44475a]">Performance Evaluation</h3>
            <div className="flex gap-2 text-xs">
              <span>Chart</span>
              <span className="px-2">|</span>
              <span>Show Value</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={170}>
            <PieChart>
              <Pie
                data={performanceData}
                cx="50%"
                cy="50%"
                innerRadius={38}
                outerRadius={66}
                fill="#8884d8"
                dataKey="value"
                label={({ name }) => name}
                labelLine={false}
              >
                {performanceData.map((entry, i) => (
                  <Cell key={i} fill={PIE_COLORS[i]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex justify-around mt-2 text-sm">
            <div className="flex flex-col items-center">
              <span className="h-2 w-2 rounded-full bg-[#4e60ff] mb-1"></span>
              <span>Excellent</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="h-2 w-2 rounded-full bg-[#70cc6c] mb-1"></span>
              <span>Good</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="h-2 w-2 rounded-full bg-[#ff6868] mb-1"></span>
              <span>Need Improvement</span>
            </div>
          </div>
        </Card>

        {/* Employee Ranks */}
        <Card>
          <h3 className="font-semibold text-lg text-[#44475a] mb-2">Employee Ranks</h3>
          <ul className="space-y-3 text-sm">
            {[
              { name: 'Bisal', title: 'Software Developer', status: 'Full time', percent: 100, avatar: '/user1.png' },
              { name: 'Richman', title: 'Graphics Designer', status: 'Full time - Remote', percent: 80, avatar: '/user2.png' },
              { name: 'Raffee', title: 'UI/UX Intern', status: 'Intern', percent: 75, avatar: '/user3.png' },
            ].map((emp, idx) => (
              <motion.li
                key={idx}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.37, delay: idx * 0.09 }}
                className="flex items-center gap-3"
              >
                <img src={emp.avatar} alt={emp.name} className="w-9 h-9 rounded-full border border-[#e0e0e6] object-cover" />
                <div className="flex-1">
                  <div className="font-semibold text-[#44475a]">
                    {emp.name}
                  </div>
                  <div className="text-xs text-[#b0b0b9]">{emp.title} <span className="ml-1">{emp.status}</span></div>
                </div>
                <div className="text-xs flex flex-col items-center">
                  <span className="font-bold text-blue-500">{emp.percent}%</span>
                  <span className="text-[#b0b0b9]">Task Completed</span>
                </div>
              </motion.li>
            ))}
          </ul>
        </Card>
      </motion.div>
    </div>
  );
}

// Stat Card
const StatCard = ({
  title,
  value,
  changeText,
  changeColor,
  valueColor,
  borderColor,
  icon
}: {
  title: string; value: number;
  changeText: string; changeColor?: string;
  valueColor?: string; borderColor?: string; icon?: React.ReactNode
}) => (
  <motion.div
    className={`relative bg-white p-5 rounded-2xl shadow-xl border-t-4 ${borderColor || 'border-gray-200'} overflow-hidden`}
    initial={{ opacity: 0, y: 15, scale: 0.98 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    transition={{ duration: 0.45 }}
  >
    <div className="absolute top-3 right-3 opacity-20">{icon}</div>
    <h2 className="text-[#b0b0b9] text-sm mb-1">{title}</h2>
    <p className={`text-3xl font-bold mb-2 ${valueColor}`}>{value}</p>
    <div className={`text-xs ${changeColor}`}>{changeText}</div>
  </motion.div>
);

// Card
const Card = ({ children, className = '' }: { children: React.ReactNode, className?: string }) => (
  <motion.div
    className={`bg-white rounded-2xl shadow p-4 ${className}`}
    initial={{ opacity: 0, scale: 0.97 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.45 }}
  >
    {children}
  </motion.div>
);