'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { isTokenValid } from '@/lib/auth';
import toast, { Toaster } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

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
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Animation variants
  const rowVariants = {
    hidden: { opacity: 0, y: 14 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, scale: 0.97 },
  };

  useEffect(() => {
    const token = document.cookie.split('; ').find(c => c.startsWith('token='))?.split('=')[1];

    if (!isTokenValid(token as string | null)) {
      router.push('/auth/login');
      return;
    }

    setLoading(true);
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
      })
      .finally(() => setLoading(false));
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

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-start px-2 md:px-8 py-8 bg-gradient-to-br from-emerald-50 via-white to-green-50 relative">
      <Toaster position="top-center" />
      {/* Decorative animated background bubbles */}
      <motion.div
        initial={{ opacity: 0, scale: 0.7, x: -80, y: -40 }}
        animate={{ opacity: 0.14, scale: 1, x: 0, y: 0 }}
        transition={{ duration: 1.1, type: 'spring' }}
        className="absolute top-[-100px] left-[-100px] w-[200px] h-[200px] rounded-full bg-gradient-to-tr from-green-400 to-emerald-300 blur-2xl z-0"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.7, x: 80, y: 40 }}
        animate={{ opacity: 0.13, scale: 1, x: 0, y: 0 }}
        transition={{ duration: 1.1, type: 'spring', delay: 0.4 }}
        className="absolute bottom-[-110px] right-[-90px] w-[160px] h-[160px] rounded-full bg-gradient-to-tr from-emerald-300 to-green-400 blur-2xl z-0"
      />

      <motion.h1
        className="text-3xl font-extrabold text-emerald-700 mb-8 tracking-tight z-10"
        initial={{ opacity: 0, y: -25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        Leave Management
      </motion.h1>

      <motion.div
        className="bg-white rounded-xl shadow-2xl overflow-x-auto w-full max-w-5xl z-10"
        initial={{ opacity: 0, scale: 0.97, y: 35 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.7, type: 'spring' }}
      >
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
            <AnimatePresence>
              {leaves.map((leave, idx) => (
                <motion.tr
                  key={leave.id}
                  variants={rowVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  transition={{ duration: 0.36, delay: idx * 0.045 }}
                  className="border-t hover:bg-emerald-50/40"
                >
                  <td className="p-3">{leave.empId}</td>
                  <td className="p-3">{leave.name}</td>
                  <td className="p-3">{leave.leaveType}</td>
                  <td className="p-3">{leave.department}</td>
                  <td className="p-3">{leave.days}</td>
                  <td className="p-3">
                    <motion.span
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ type: 'spring', duration: 0.25, delay: idx * 0.04 }}
                      className={`px-2 py-1 rounded text-white text-xs shadow-sm font-semibold ${
                        leave.status === 'Pending'
                          ? 'bg-yellow-500'
                          : leave.status === 'Approved'
                          ? 'bg-green-500'
                          : 'bg-red-500'
                      }`}
                    >
                      {leave.status}
                    </motion.span>
                  </td>
                  <td className="p-3 space-x-2">
                    {leave.status === 'Pending' && (
                      <>
                        <motion.button
                          whileHover={{ scale: 1.09, color: '#059669' }}
                          whileTap={{ scale: 0.96 }}
                          onClick={() => updateStatus(leave.id, 'Approved')}
                          className="text-green-600 font-medium hover:underline"
                        >
                          Approve
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.09, color: '#dc2626' }}
                          whileTap={{ scale: 0.96 }}
                          onClick={() => updateStatus(leave.id, 'Rejected')}
                          className="text-red-600 font-medium hover:underline"
                        >
                          Reject
                        </motion.button>
                      </>
                    )}
                    <motion.button
                      whileHover={{ scale: 1.09, color: '#b91c1c' }}
                      whileTap={{ scale: 0.96 }}
                      onClick={() => deleteLeave(leave.id)}
                      className="text-gray-500 hover:text-red-600 font-medium"
                    >
                      Delete
                    </motion.button>
                  </td>
                </motion.tr>
              ))}
              {leaves.length === 0 && !loading && (
                <motion.tr
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <td colSpan={7} className="text-center text-gray-500 py-6">
                    No leave requests found.
                  </td>
                </motion.tr>
              )}
              {loading && (
                <motion.tr
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <td colSpan={7} className="text-center text-gray-400 py-6">
                    Loading...
                  </td>
                </motion.tr>
              )}
            </AnimatePresence>
          </tbody>
        </table>
      </motion.div>
    </div>
  );
}