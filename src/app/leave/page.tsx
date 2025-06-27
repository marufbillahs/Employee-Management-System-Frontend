'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { isTokenValid } from '@/lib/auth';
import toast, { Toaster } from 'react-hot-toast';
import {
  Home, Users, Calendar, Bell, FileText, Settings, LogOut,
  Search, MessageSquare
} from 'lucide-react';

interface Leave {
  id: number;
  empId: string;
  name: string;
  leaveType: string;
  department: string;
  days: number;
  status: 'Pending' | 'Approved' | 'Rejected';
}

export default function LeavePage() {
  const [leaves, setLeaves] = useState<Leave[]>([]);
  const router = useRouter();

  const navItems = [
    { name: 'Dashboard', icon: <Home />, href: '/admin_dashboard' },
    { name: 'Employee', icon: <Users />, href: '/employee' },
    { name: 'Leave', icon: <Calendar />, href: '/leave' },
    { name: 'Post Notice', icon: <Bell />, href: '#' },
    { name: 'Reports', icon: <FileText />, href: '#' },
    { name: 'Settings', icon: <Settings />, href: '#' },
  ];

  useEffect(() => {
    const token = document.cookie.split('; ').find(c => c.startsWith('token='))?.split('=')[1];

    if (!isTokenValid(token as string | null)) {
      router.push('/auth/login');
      return;
    }

    fetch('http://localhost:4000/leave/all', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => {
        if (!res.ok) throw new Error('Unauthorized');
        return res.json();
      })
      .then(data => setLeaves(data))
      .catch(() => {
        toast.error('Unauthorized');
        router.push('/auth/login');
      });
  }, [router]);

  const updateStatus = async (id: number, status: 'Approved' | 'Rejected') => {
    const token = document.cookie.split('; ').find(c => c.startsWith('token='))?.split('=')[1];

    try {
      const res = await fetch(`http://localhost:4000/leave/status/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });

      if (!res.ok) throw new Error();
      toast.success('Status updated');
      setLeaves(prev => prev.map(l => (l.id === id ? { ...l, status } : l)));
    } catch {
      toast.error('Failed to update');
    }
  };

  const deleteLeave = async (id: number) => {
    const token = document.cookie.split('; ').find(c => c.startsWith('token='))?.split('=')[1];

    try {
      const res = await fetch(`http://localhost:4000/leave/delete/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error();
      toast.success('Deleted successfully');
      setLeaves(prev => prev.filter(l => l.id !== id));
    } catch {
      toast.error('Failed to delete');
    }
  };

  const logout = () => {
    document.cookie = 'token=; path=/; max-age=0';
    localStorage.removeItem('role');
    router.push('/auth/login');
  };

  return (
    <div className="flex h-screen">
      <Toaster />
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md flex flex-col justify-between">
        <div>
          <div className="text-xl font-bold px-6 py-4 border-b">
            Dashboard <span className="text-xs">v1</span>
          </div>
          <nav className="mt-4 space-y-2">
            {navItems.map(item => (
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

      {/* Main Content */}
      <div className="flex-1 flex flex-col bg-gray-100">
        {/* Topbar */}
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

        {/* Leave Table */}
        <main className="p-6 overflow-y-auto">
          <h1 className="text-2xl font-semibold mb-4">Leave Management</h1>
          <div className="bg-white rounded-xl shadow overflow-x-auto">
            <table className="min-w-full text-sm text-left">
              <thead className="bg-gray-50 text-gray-700">
                <tr>
                  <th className="p-3 border-b">Emp ID</th>
                  <th className="p-3 border-b">Name</th>
                  <th className="p-3 border-b">Leave Type</th>
                  <th className="p-3 border-b">Department</th>
                  <th className="p-3 border-b">Days</th>
                  <th className="p-3 border-b">Status</th>
                  <th className="p-3 border-b">Action</th>
                </tr>
              </thead>
              <tbody>
                {leaves.map(leave => (
                  <tr key={leave.id} className="border-t hover:bg-gray-50">
                    <td className="p-3">{leave.empId}</td>
                    <td className="p-3">{leave.name}</td>
                    <td className="p-3">{leave.leaveType}</td>
                    <td className="p-3">{leave.department}</td>
                    <td className="p-3">{leave.days}</td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded text-white text-xs ${leave.status === 'Pending'
                        ? 'bg-yellow-500'
                        : leave.status === 'Approved'
                        ? 'bg-green-500'
                        : 'bg-red-500'}`}>
                        {leave.status}
                      </span>
                    </td>
                    <td className="p-3 space-x-2">
                      {leave.status === 'Pending' && (
                        <>
                          <button
                            onClick={() => updateStatus(leave.id, 'Approved')}
                            className="text-green-600 hover:underline"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => updateStatus(leave.id, 'Rejected')}
                            className="text-red-600 hover:underline"
                          >
                            Reject
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => deleteLeave(leave.id)}
                        className="text-gray-500 hover:text-red-600"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
                {leaves.length === 0 && (
                  <tr>
                    <td colSpan={7} className="text-center text-gray-500 py-6">
                      No leave requests found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  );
}
