'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

type Employee = {
  id?: number;
  name: string;
  email: string;
  department?: string;
  position?: string;
};

const getCookie = (name: string): string | null => {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.split('; ').find(c => c.startsWith(name + '='));
  return match ? decodeURIComponent(match.split('=')[1]) : null;
};

export default function EmployeePage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [form, setForm] = useState<Employee>({
    name: '',
    email: '',
    department: '',
    position: '',
  });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [viewing, setViewing] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(false);

  const token = getCookie('token');

  const fetchEmployees = async () => {
    try {
      const res = await axios.get('http://localhost:4000/employee/all', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEmployees(res.data);
    } catch {
      toast.error('Failed to fetch employees');
    }
  };

  useEffect(() => {
    fetchEmployees();
    // eslint-disable-next-line
  }, []);

  const validate = (): boolean => {
    if (!form.name.trim()) {
      toast.error('Name is required');
      return false;
    }
    if (!form.email.trim()) {
      toast.error('Email is required');
      return false;
    }
    const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;
    if (!emailRegex.test(form.email)) {
      toast.error('Invalid email address');
      return false;
    }
    if (!editingId) {
      if (!form.department?.trim()) {
        toast.error('Department is required');
        return false;
      }
      if (!form.position?.trim()) {
        toast.error('Position is required');
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!validate()) return;
    setLoading(true);

    try {
      if (editingId) {
        await axios.patch(
          `http://localhost:4000/employee/update/${editingId}`,
          { name: form.name, email: form.email },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success('Employee updated');
      } else {
        await axios.post(
          'http://localhost:4000/employee/create',
          form,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );
        toast.success('Employee created');
      }
      setForm({ name: '', email: '', department: '', position: '' });
      setEditingId(null);
      fetchEmployees();
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message ||
        'Request failed'
      );
    }
    setLoading(false);
  };

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`http://localhost:4000/employee/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success('Employee deleted');
      fetchEmployees();
    } catch {
      toast.error('Failed to delete');
    }
  };

  const startEdit = (emp: Employee) => {
    setForm({
      name: emp.name,
      email: emp.email,
    });
    setEditingId(emp.id!);
  };

  return (
    <motion.div
      className="space-y-8"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, type: 'spring' }}
    >
      <Toaster position="top-center" />

      <motion.h1
        className="text-2xl font-bold text-[#44475a] tracking-tight"
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        Employee Management
      </motion.h1>

      {/* Form Section */}
      <motion.form
        onSubmit={handleSubmit}
        className="bg-white shadow-xl p-6 rounded-2xl max-w-xl mx-auto border-t-4 border-emerald-400"
        initial={{ opacity: 0, scale: 0.96, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.35, type: 'spring' }}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="#10b981" strokeWidth="2">
              <circle cx="12" cy="8" r="4" />
              <path d="M4 20c0-3.3137 3.134-6 7-6s7 2.6863 7 6" />
            </svg>
            {editingId ? 'Edit Employee' : 'Add New Employee'}
          </h2>
          {editingId && (
            <button
              type="button"
              onClick={() => {
                setEditingId(null);
                setForm({ name: '', email: '', department: '', position: '' });
              }}
              className="text-gray-400 font-bold hover:text-gray-600 text-xl"
              aria-label="Cancel edit"
            >
              ×
            </button>
          )}
        </div>
        <div className="space-y-3">
          <motion.input
            type="text"
            placeholder="Name"
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
            className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-emerald-300 transition"
            whileFocus={{ scale: 1.03, borderColor: '#10b981' }}
            disabled={loading}
          />
          <motion.input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })}
            className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-emerald-300 transition"
            whileFocus={{ scale: 1.03, borderColor: '#10b981' }}
            disabled={loading}
          />
          {!editingId && (
            <>
              <motion.input
                type="text"
                placeholder="Department"
                value={form.department}
                onChange={e => setForm({ ...form, department: e.target.value })}
                className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-emerald-300 transition"
                whileFocus={{ scale: 1.03, borderColor: '#10b981' }}
                disabled={loading}
              />
              <motion.input
                type="text"
                placeholder="Position"
                value={form.position}
                onChange={e => setForm({ ...form, position: e.target.value })}
                className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-emerald-300 transition"
                whileFocus={{ scale: 1.03, borderColor: '#10b981' }}
                disabled={loading}
              />
            </>
          )}
          <div className="flex gap-4 mt-3">
            <motion.button
              type="submit"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              disabled={loading}
              className="bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white px-4 py-2 rounded-lg font-semibold shadow disabled:opacity-60"
            >
              {loading ? 'Saving...' : editingId ? 'Update' : 'Create'}
            </motion.button>
            {editingId && (
              <motion.button
                type="button"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => {
                  setEditingId(null);
                  setForm({ name: '', email: '', department: '', position: '' });
                }}
                className="text-gray-600 hover:text-gray-900 px-4 py-2"
                disabled={loading}
              >
                Cancel
              </motion.button>
            )}
          </div>
        </div>
      </motion.form>

      {/* Table Section */}
      <motion.div
        className="bg-white shadow-xl p-6 rounded-2xl"
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, type: 'spring', delay: 0.15 }}
      >
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="#6366f1" strokeWidth="2">
            <rect x="3" y="7" width="18" height="13" rx="2" />
            <path d="M16 3v4M8 3v4" />
          </svg>
          Employee List
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full border text-sm">
            <thead className="bg-gray-50 text-left">
              <tr>
                <th className="p-2 border">ID</th>
                <th className="p-2 border">Name</th>
                <th className="p-2 border">Email</th>
                <th className="p-2 border">Department</th>
                <th className="p-2 border">Position</th>
                <th className="p-2 border text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {employees.map((emp) => (
                  <motion.tr
                    key={emp.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <td className="p-2 border">{emp.id}</td>
                    <td className="p-2 border">{emp.name}</td>
                    <td className="p-2 border">{emp.email}</td>
                    <td className="p-2 border">{emp.department || '-'}</td>
                    <td className="p-2 border">{emp.position || '-'}</td>
                    <td className="p-2 border flex space-x-2 justify-center">
                      <motion.button
                        whileHover={{ scale: 1.13, color: '#2563eb' }}
                        onClick={() => setViewing(emp)}
                        className="text-blue-500 font-semibold"
                      >
                        View
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.13, color: '#f59e42' }}
                        onClick={() => startEdit(emp)}
                        className="text-yellow-500 font-semibold"
                      >
                        Edit
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.13, color: '#ef4444' }}
                        onClick={() => handleDelete(emp.id!)}
                        className="text-red-500 font-semibold"
                      >
                        Delete
                      </motion.button>
                    </td>
                  </motion.tr>
                ))}
                {employees.length === 0 && (
                  <motion.tr
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <td colSpan={6} className="text-center py-4 text-gray-500">
                      No employees found.
                    </td>
                  </motion.tr>
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Modal View */}
      <AnimatePresence>
        {viewing && (
          <motion.div
            className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white p-6 rounded-xl shadow-xl w-96 relative"
              initial={{ scale: 0.86, opacity: 0, y: 60 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.92, opacity: 0, y: 60 }}
              transition={{ type: 'spring', duration: 0.35 }}
            >
              <h2 className="text-lg font-bold mb-2 flex items-center gap-2">
                <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="#10b981" strokeWidth="2">
                  <circle cx="12" cy="8" r="4" />
                  <path d="M4 20c0-3.3137 3.134-6 7-6s7 2.6863 7 6" />
                </svg>
                Employee Details
              </h2>
              <div className="space-y-1 text-gray-700">
                <p><strong>ID:</strong> {viewing.id}</p>
                <p><strong>Name:</strong> {viewing.name}</p>
                <p><strong>Email:</strong> {viewing.email}</p>
                <p><strong>Department:</strong> {viewing.department || '-'}</p>
                <p><strong>Position:</strong> {viewing.position || '-'}</p>
              </div>
              <motion.button
                onClick={() => setViewing(null)}
                className="absolute top-2 right-3 text-gray-400 hover:text-gray-700 text-xl font-bold"
                whileHover={{ rotate: 90, scale: 1.18 }}
                aria-label="Close"
              >
                ✕
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}