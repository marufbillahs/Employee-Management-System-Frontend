'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

type Employee = {
  id?: number;
  name: string;
  email: string;
  department?: string;
  position?: string;
};

const getCookie = (name: string): string | null => {
  if (typeof document === 'undefined') return null; // fix for SSR
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
  const token = getCookie('token');

  const fetchEmployees = async () => {
    try {
      const res = await fetch('http://localhost:4000/employee/all', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setEmployees(data);
    } catch {
      toast.error('Failed to fetch employees');
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleSubmit = async () => {
    if (!form.name.trim() || !form.email.trim()) {
      toast.error('Name and Email are required');
      return;
    }

    let body: any;
    let endpoint: string;
    let method: string;

    if (editingId) {
      endpoint = `http://localhost:4000/employee/update/${editingId}`;
      method = 'PATCH';
      body = { name: form.name, email: form.email }; // Only these for update
    } else {
      if (!form.department?.trim() || !form.position?.trim()) {
        toast.error('Department and Position are required for creation');
        return;
      }
      endpoint = 'http://localhost:4000/employee/create';
      method = 'POST';
      body = form; // full form for create
    }

    try {
      const res = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) throw new Error();
      toast.success(editingId ? 'Employee updated' : 'Employee created');
      setForm({ name: '', email: '', department: '', position: '' });
      setEditingId(null);
      fetchEmployees();
    } catch {
      toast.error('Request failed');
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await fetch(`http://localhost:4000/employee/delete/${id}`, {
        method: 'DELETE',
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
    <div className="space-y-8">
      <h1 className="text-xl font-bold text-gray-800">Employee Management</h1>

      {/* Form Section */}
      <div className="bg-white shadow p-6 rounded-lg max-w-xl">
        <h2 className="text-lg font-semibold mb-4">
          {editingId ? 'Edit Employee' : 'Add New Employee'}
        </h2>
        <div className="space-y-3">
          <input
            type="text"
            placeholder="Name"
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
            className="w-full border px-3 py-2 rounded"
          />
          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })}
            className="w-full border px-3 py-2 rounded"
          />
          {!editingId && (
            <>
              <input
                type="text"
                placeholder="Department"
                value={form.department}
                onChange={e => setForm({ ...form, department: e.target.value })}
                className="w-full border px-3 py-2 rounded"
              />
              <input
                type="text"
                placeholder="Position"
                value={form.position}
                onChange={e => setForm({ ...form, position: e.target.value })}
                className="w-full border px-3 py-2 rounded"
              />
            </>
          )}
          <div className="flex gap-4 mt-3">
            <button
              onClick={handleSubmit}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
            >
              {editingId ? 'Update' : 'Create'}
            </button>
            {editingId && (
              <button
                onClick={() => {
                  setEditingId(null);
                  setForm({ name: '', email: '', department: '', position: '' });
                }}
                className="text-gray-600"
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white shadow p-6 rounded-lg">
        <h2 className="text-lg font-semibold mb-4">Employee List</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full border text-sm">
            <thead className="bg-gray-100 text-left">
              <tr>
                <th className="p-2 border">ID</th>
                <th className="p-2 border">Name</th>
                <th className="p-2 border">Email</th>
                <th className="p-2 border">Department</th>
                <th className="p-2 border">Position</th>
                <th className="p-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {employees.map(emp => (
                <tr key={emp.id}>
                  <td className="p-2 border">{emp.id}</td>
                  <td className="p-2 border">{emp.name}</td>
                  <td className="p-2 border">{emp.email}</td>
                  <td className="p-2 border">{emp.department || '-'}</td>
                  <td className="p-2 border">{emp.position || '-'}</td>
                  <td className="p-2 border space-x-2">
                    <button
                      onClick={() => setViewing(emp)}
                      className="text-blue-500 hover:underline"
                    >
                      View
                    </button>
                    <button
                      onClick={() => startEdit(emp)}
                      className="text-yellow-500 hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(emp.id!)}
                      className="text-red-500 hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {employees.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-4 text-gray-500">
                    No employees found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal View */}
      {viewing && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow w-96 relative">
            <h2 className="text-lg font-semibold mb-2">Employee Details</h2>
            <p><strong>ID:</strong> {viewing.id}</p>
            <p><strong>Name:</strong> {viewing.name}</p>
            <p><strong>Email:</strong> {viewing.email}</p>
            <p><strong>Department:</strong> {viewing.department}</p>
            <p><strong>Position:</strong> {viewing.position}</p>
            <button
              onClick={() => setViewing(null)}
              className="absolute top-2 right-3 text-gray-500"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
