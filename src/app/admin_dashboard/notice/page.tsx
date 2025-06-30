'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

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
    // eslint-disable-next-line
  }, [router]);

  return (
    <div className="relative min-h-[80vh] p-6 space-y-6 bg-gradient-to-br from-emerald-50 via-white to-green-50 flex flex-col items-center">
      <Toaster position="top-center" />
      {/* Decorative animated background bubbles */}
      <motion.div
        initial={{ opacity: 0, scale: 0.7, x: -80, y: -40 }}
        animate={{ opacity: 0.13, scale: 1, x: 0, y: 0 }}
        transition={{ duration: 1.1, type: 'spring' }}
        className="absolute top-[-100px] left-[-100px] w-[200px] h-[200px] rounded-full bg-gradient-to-tr from-blue-400 to-emerald-300 blur-2xl z-0"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.7, x: 80, y: 40 }}
        animate={{ opacity: 0.13, scale: 1, x: 0, y: 0 }}
        transition={{ duration: 1.1, type: 'spring', delay: 0.4 }}
        className="absolute bottom-[-110px] right-[-90px] w-[160px] h-[160px] rounded-full bg-gradient-to-tr from-emerald-300 to-blue-400 blur-2xl z-0"
      />

      <motion.h1
        className="text-3xl font-extrabold text-blue-700 mb-2 tracking-tight z-10"
        initial={{ opacity: 0, y: -25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        Notice Board
      </motion.h1>

      {/* Create Form */}
      <motion.div
        className="bg-white rounded-xl shadow-xl p-6 space-y-4 max-w-lg w-full z-10"
        initial={{ opacity: 0, scale: 0.97, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.45, type: 'spring' }}
      >
        <h2 className="text-xl font-semibold text-gray-700 mb-2 flex items-center gap-2">
          <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="#2563eb" strokeWidth="2">
            <rect x="4" y="4" width="16" height="16" rx="2" />
            <path d="M8 8h8M8 12h8M8 16h4" />
          </svg>
          Create Notice
        </h2>
        <motion.input
          className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-200"
          placeholder="Type (e.g., General, Urgent)"
          value={type}
          onChange={(e) => setType(e.target.value)}
          whileFocus={{ scale: 1.03, borderColor: "#2563eb" }}
        />
        <motion.textarea
          className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-200"
          placeholder="Message"
          rows={4}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          whileFocus={{ scale: 1.03, borderColor: "#2563eb" }}
        />
        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
          onClick={createNotice}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition font-semibold"
        >
          Post Notice
        </motion.button>
      </motion.div>

      {/* Notices List */}
      <motion.div
        className="bg-white rounded-xl shadow-xl p-6 max-w-3xl w-full z-10"
        initial={{ opacity: 0, scale: 0.97, y: 35 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.55, type: 'spring', delay: 0.1 }}
      >
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="#10b981" strokeWidth="2">
            <rect x="4" y="4" width="16" height="16" rx="2" />
            <path d="M8 8h8M8 12h8M8 16h4" />
          </svg>
          All Notices
        </h2>
        {loading ? (
          <motion.p
            className="text-gray-600"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            Loading...
          </motion.p>
        ) : (
          <div className="space-y-4">
            <AnimatePresence>
              {notices.map((notice, idx) => (
                <motion.div
                  key={notice.id}
                  initial={{ opacity: 0, y: 20, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.99 }}
                  transition={{ duration: 0.35, delay: idx * 0.045 }}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-xl transition bg-blue-50/30"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-lg font-bold text-blue-600">{notice.type}</h3>
                      <p className="text-sm text-gray-500">By: {notice.adminName}</p>
                    </div>
                    <motion.button
                      onClick={() => handleDelete(notice.id)}
                      whileHover={{ scale: 1.1, color: '#dc2626' }}
                      whileTap={{ scale: 0.96 }}
                      className="text-red-500 hover:underline text-sm"
                    >
                      Delete
                    </motion.button>
                  </div>
                  <p className="mt-2 text-gray-700">{notice.message}</p>
                  <p className="mt-1 text-xs text-gray-400">
                    Posted: {new Date(notice.createdAt).toLocaleString()}
                  </p>
                </motion.div>
              ))}
            </AnimatePresence>
            {notices.length === 0 && (
              <motion.p
                className="text-center text-gray-500"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                No notices available.
              </motion.p>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
}