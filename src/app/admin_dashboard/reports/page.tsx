'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

interface NoticeReport {
  id: number;
  adminName: string;
  type: string;
  message: string;
  createdAt: string;
}

export default function ReportsPage() {
  const router = useRouter();
  const [reports, setReports] = useState<NoticeReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    type: '',
    adminName: '',
    startDate: '',
    endDate: '',
  });
  const [pagination, setPagination] = useState({ page: 1, limit: 5, totalPages: 1 });

  const token = typeof window !== 'undefined'
    ? document.cookie.split('; ').find(c => c.startsWith('token='))?.split('=')[1]
    : '';

  const role = typeof window !== 'undefined' ? localStorage.getItem('role') : null;

  const fetchReports = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams({
        ...filters,
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
      });

      const res = await fetch(`http://localhost:4000/reports/notices?${queryParams.toString()}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setReports(data.data);
      setPagination((prev) => ({ ...prev, totalPages: data.totalPages }));
    } catch {
      toast.error('Error loading reports');
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async (format: 'csv' | 'pdf') => {
    const queryParams = new URLSearchParams({
      ...filters,
      exportFormat: format,
    });

    try {
      const res = await fetch(`http://localhost:4000/reports/notices?${queryParams.toString()}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error('Export failed');
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `notice_report.${format}`;
      link.click();
    } catch {
      toast.error('Export failed');
    }
  };

  useEffect(() => {
    if (!token || role !== 'admin') {
      router.push('/auth/login');
    } else {
      fetchReports();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination.page]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  const applyFilters = () => {
    setPagination((prev) => ({ ...prev, page: 1 }));
    fetchReports();
  };

  // Animation variants for table rows
  const rowVariants = {
    hidden: { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, scale: 0.97 },
  };

  return (
    <div className="relative min-h-[80vh] p-6 space-y-6 bg-gradient-to-br from-emerald-50 via-white to-green-50 flex flex-col items-center">
      <Toaster position="top-center" />
      {/* Decorative bubbles */}
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
        Reports
      </motion.h1>

      {/* Filters */}
      <motion.div
        className="bg-white p-6 rounded-xl shadow grid grid-cols-1 md:grid-cols-4 gap-4 w-full max-w-4xl z-10"
        initial={{ opacity: 0, scale: 0.97, y: 25 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.45, type: 'spring' }}
      >
        <select
          name="type"
          value={filters.type}
          onChange={handleFilterChange}
          className="border p-2 rounded"
        >
          <option value="">All Types</option>
          <option value="General">General</option>
          <option value="Urgent">Urgent</option>
          <option value="Leave">Leave</option>
        </select>

        <input
          type="text"
          name="adminName"
          placeholder="Admin Name"
          value={filters.adminName}
          onChange={handleFilterChange}
          className="border p-2 rounded"
        />

        <input
          type="date"
          name="startDate"
          value={filters.startDate}
          onChange={handleFilterChange}
          className="border p-2 rounded"
        />

        <input
          type="date"
          name="endDate"
          value={filters.endDate}
          onChange={handleFilterChange}
          className="border p-2 rounded"
        />

        <motion.button
          onClick={applyFilters}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 md:col-span-4 transition font-semibold"
        >
          Apply Filters
        </motion.button>
      </motion.div>

      {/* Export Buttons */}
      <motion.div
        className="flex gap-4 z-10"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.4 }}
      >
        <motion.button
          onClick={() => handleExport('csv')}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 font-semibold transition"
        >
          Export CSV
        </motion.button>
        <motion.button
          onClick={() => handleExport('pdf')}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 font-semibold transition"
        >
          Export PDF
        </motion.button>
      </motion.div>

      {/* Report Table */}
      <motion.div
        className="bg-white p-6 rounded-xl shadow w-full max-w-4xl z-10"
        initial={{ opacity: 0, scale: 0.97, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.45, type: 'spring' }}
      >
        {loading ? (
          <motion.p
            className="text-gray-600 text-center py-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            Loading...
          </motion.p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full table-auto text-left">
              <thead>
                <tr className="border-b">
                  <th className="py-2">#</th>
                  <th className="py-2">Admin</th>
                  <th className="py-2">Type</th>
                  <th className="py-2">Message</th>
                  <th className="py-2">Date</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {reports.map((item, i) => (
                    <motion.tr
                      key={item.id}
                      variants={rowVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      transition={{ duration: 0.28, delay: i * 0.045 }}
                      className="border-b"
                    >
                      <td className="py-2">{i + 1 + (pagination.page - 1) * pagination.limit}</td>
                      <td className="py-2">{item.adminName}</td>
                      <td className="py-2">{item.type}</td>
                      <td className="py-2">{item.message}</td>
                      <td className="py-2">{new Date(item.createdAt).toLocaleString()}</td>
                    </motion.tr>
                  ))}
                  {reports.length === 0 && (
                    <motion.tr
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      <td colSpan={5} className="text-center py-4 text-gray-500">
                        No reports found.
                      </td>
                    </motion.tr>
                  )}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        )}
      </motion.div>

      {/* Pagination */}
      <motion.div
        className="flex justify-center gap-4 z-10"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25, duration: 0.3 }}
      >
        <motion.button
          disabled={pagination.page === 1}
          onClick={() => setPagination(p => ({ ...p, page: p.page - 1 }))}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50 font-semibold"
          whileHover={{ scale: pagination.page === 1 ? 1 : 1.06 }}
          whileTap={{ scale: pagination.page === 1 ? 1 : 0.96 }}
        >
          Prev
        </motion.button>
        <span className="self-center">
          Page {pagination.page} of {pagination.totalPages}
        </span>
        <motion.button
          disabled={pagination.page >= pagination.totalPages}
          onClick={() => setPagination(p => ({ ...p, page: p.page + 1 }))}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50 font-semibold"
          whileHover={{ scale: pagination.page >= pagination.totalPages ? 1 : 1.06 }}
          whileTap={{ scale: pagination.page >= pagination.totalPages ? 1 : 0.96 }}
        >
          Next
        </motion.button>
      </motion.div>
    </div>
  );
}