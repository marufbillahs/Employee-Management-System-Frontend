'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';

interface Notice {
  id: number;
  adminId: number;
  adminName: string;
  type: string;
  message: string;
  createdAt: string;
}

export default function NoticePage() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [type, setType] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const token = typeof window !== 'undefined'
    ? document.cookie.split('; ').find(c => c.startsWith('token='))?.split('=')[1]
    : '';

  const role = typeof window !== 'undefined' ? localStorage.getItem('role') : null;

  const fetchNotices = async () => {
    try {
      const res = await fetch('http://localhost:4000/notice', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setNotices(data);
    } catch (err) {
      toast.error('Failed to load notices');
    } finally {
      setLoading(false);
    }
  };

  const createNotice = async () => {
    if (!type || !message) {
      toast.error('Type and message are required');
      return;
    }

    try {
      const res = await fetch('http://localhost:4000/notice', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ type, message }),
      });

      if (!res.ok) throw new Error('Failed to create notice');

      setType('');
      setMessage('');
      toast.success('Notice created');
      fetchNotices();
    } catch (err) {
      toast.error('Error creating notice');
    }
  };

  const confirmDelete = async (id: number) => {
    try {
      const res = await fetch(`http://localhost:4000/notice/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error('Delete failed');
      toast.success('Notice deleted');
      fetchNotices();
    } catch {
      toast.error('Could not delete');
    }
  };

  const handleDelete = (id: number) => {
    toast((t) => (
      <div className="text-sm">
        Are you sure you want to delete?
        <div className="mt-2 flex gap-2">
          <button
            onClick={async () => {
              toast.dismiss(t.id);
              await confirmDelete(id);
            }}
            className="bg-red-600 text-white px-3 py-1 rounded text-xs hover:bg-red-700"
          >
            Yes
          </button>
          <button
            onClick={() => toast.dismiss(t.id)}
            className="bg-gray-200 px-3 py-1 rounded text-xs"
          >
            No
          </button>
        </div>
      </div>
    ), { duration: 5000 });
  };

  useEffect(() => {
    if (!token || role !== 'admin') {
      router.push('/auth/login');
    } else {
      fetchNotices();
    }
  }, [router]);

  return (
    <div className="p-6 space-y-6">
      <Toaster />

      <h1 className="text-3xl font-bold text-gray-800 mb-2">Notice Board</h1>

      {/* Create Form */}
      <div className="bg-white rounded-xl shadow p-6 space-y-4">
        <h2 className="text-xl font-semibold text-gray-700">Create Notice</h2>
        <input
          className="w-full p-2 border border-gray-300 rounded"
          placeholder="Type (e.g., General, Urgent)"
          value={type}
          onChange={(e) => setType(e.target.value)}
        />
        <textarea
          className="w-full p-2 border border-gray-300 rounded"
          placeholder="Message"
          rows={4}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button
          onClick={createNotice}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Post Notice
        </button>
      </div>

      {/* Notices List */}
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-xl font-semibold mb-4">All Notices</h2>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="space-y-4">
            {notices.map((notice) => (
              <div
                key={notice.id}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-bold text-blue-600">{notice.type}</h3>
                    <p className="text-sm text-gray-500">By: {notice.adminName}</p>
                  </div>
                  <button
                    onClick={() => handleDelete(notice.id)}
                    className="text-red-500 hover:underline text-sm"
                  >
                    Delete
                  </button>
                </div>
                <p className="mt-2 text-gray-700">{notice.message}</p>
                <p className="mt-1 text-sm text-gray-400">
                  Posted: {new Date(notice.createdAt).toLocaleString()}
                </p>
              </div>
            ))}
            {notices.length === 0 && (
              <p className="text-center text-gray-500">No notices available.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
