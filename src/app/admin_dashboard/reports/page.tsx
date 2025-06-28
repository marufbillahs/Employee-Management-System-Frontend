'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';

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

  return (
    <div className="p-6 space-y-6">
      <Toaster />
      <h1 className="text-3xl font-bold text-gray-800">Reports</h1>

      {/* Filters */}
      <div className="bg-white p-6 rounded-xl shadow grid grid-cols-1 md:grid-cols-4 gap-4">
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

        <button
          onClick={applyFilters}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 md:col-span-4"
        >
          Apply Filters
        </button>
      </div>

      {/* Export Buttons */}
      <div className="flex gap-4">
        <button
          onClick={() => handleExport('csv')}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Export CSV
        </button>
        <button
          onClick={() => handleExport('pdf')}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Export PDF
        </button>
      </div>

      {/* Report Table */}
      <div className="bg-white p-6 rounded-xl shadow">
        {loading ? (
          <p>Loading...</p>
        ) : (
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
              {reports.map((item, i) => (
                <tr key={item.id} className="border-b">
                  <td className="py-2">{i + 1}</td>
                  <td className="py-2">{item.adminName}</td>
                  <td className="py-2">{item.type}</td>
                  <td className="py-2">{item.message}</td>
                  <td className="py-2">{new Date(item.createdAt).toLocaleString()}</td>
                </tr>
              ))}
              {reports.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center py-4 text-gray-500">
                    No reports found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      <div className="flex justify-center gap-4">
        <button
          disabled={pagination.page === 1}
          onClick={() => setPagination(p => ({ ...p, page: p.page - 1 }))}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          Prev
        </button>
        <span className="self-center">
          Page {pagination.page} of {pagination.totalPages}
        </span>
        <button
          disabled={pagination.page >= pagination.totalPages}
          onClick={() => setPagination(p => ({ ...p, page: p.page + 1 }))}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}