'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { jwtDecode } from 'jwt-decode';
import { isTokenValid } from '@/lib/auth';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';

export default function AdminDashboardPage() {
  const [employeeCount, setEmployeeCount] = useState(0);
  const [leaveCount, setLeaveCount] = useState(0);
  const [departmentCount, setDepartmentCount] = useState(0);
  const [adminName, setAdminName] = useState('');
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
        const leaves = await leaveRes.json();
        const departments = await deptRes.json();

        setEmployeeCount(empData.length || 0);
        setLeaveCount(leaves.length || 0);
        setDepartmentCount(departments.length || 0);

        const admin = empData.find((e: any) => e.id === adminId);
        setAdminName(admin?.name || 'Admin');
      } catch {
        toast.error('Failed to load dashboard data');
      }
    };

    fetchData();
  }, [router]);

  const COLORS = ['#22c55e', '#3b82f6', '#f43f5e'];
  const chartData = [
    { date: 'Apr 1', attendance: 80 },
    { date: 'Apr 2', attendance: 85 },
    { date: 'Apr 3', attendance: 72 },
    { date: 'Apr 4', attendance: 90 },
    { date: 'Apr 5', attendance: 70 },
  ];

  return (
    <div className="space-y-8">
      <div className="mb-4">
        <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-sm text-gray-500">Welcome back, {adminName}!</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Employees" value={employeeCount} color="blue" />
        <StatCard title="Leaves" value={leaveCount} color="red" />
        <StatCard title="Departments" value={departmentCount} color="green" />
        <StatCard title="Overtime" value={677} color="purple" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <ChartCard title="Time Off Stats">
          <PieChart width={300} height={200}>
            <Pie
              data={[
                { name: 'Sick', value: 15 },
                { name: 'Paid', value: 25 },
                { name: 'Unpaid', value: 10 }
              ]}
              cx="50%"
              cy="50%"
              outerRadius={60}
              fill="#8884d8"
              dataKey="value"
              label
            >
              {[15, 25, 10].map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ChartCard>

        <ChartCard title="Performance Evaluation">
          <PieChart width={300} height={200}>
            <Pie
              data={[
                { name: 'Excellent', value: 60 },
                { name: 'Good', value: 30 },
                { name: 'Needs Improvement', value: 10 }
              ]}
              cx="50%"
              cy="50%"
              innerRadius={40}
              outerRadius={60}
              fill="#82ca9d"
              paddingAngle={5}
              dataKey="value"
              label
            >
              {[60, 30, 10].map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ChartCard>

        <ChartCard title="Attendance">
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorAttendance" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="date" />
              <YAxis />
              <CartesianGrid strokeDasharray="3 3" />
              <Tooltip />
              <Area type="monotone" dataKey="attendance" stroke="#3b82f6" fillOpacity={1} fill="url(#colorAttendance)" />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  );
}

const StatCard = ({ title, value, color }: { title: string; value: number; color: string }) => (
  <div className={`bg-white p-5 rounded-2xl shadow border-t-4 border-${color}-500`}>
    <h2 className="text-gray-500 text-sm mb-1">{title}</h2>
    <p className="text-3xl font-bold text-gray-800">{value}</p>
  </div>
);

const ChartCard = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="bg-white rounded-2xl shadow p-4">
    <h3 className="text-lg font-semibold mb-3">{title}</h3>
    {children}
  </div>
);
