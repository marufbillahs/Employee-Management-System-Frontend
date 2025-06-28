'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { isTokenValid } from '@/lib/auth';
import toast, { Toaster } from 'react-hot-toast';

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

  return (
    <>
      <Toaster />
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
    </>
  );
}
