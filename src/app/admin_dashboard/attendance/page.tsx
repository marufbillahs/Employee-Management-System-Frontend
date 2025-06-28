'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Toaster, toast } from 'react-hot-toast';

interface Attendance {
  id: number;
  employeeId: number;
  employeeName: string;
  position: string;
  date: string;
  checkIn: string;
  checkOut: string;
  isLate: boolean;
  isAbsent: boolean;
}

export default function AttendancePage() {
  const [attendanceData, setAttendanceData] = useState<Attendance[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = document.cookie.split('; ').find(c => c.startsWith('token='))?.split('=')[1];
    const role = localStorage.getItem('role');

    if (!token || role !== 'admin') {
      router.push('/auth/login');
      return;
    }

    const fetchAttendance = async () => {
      try {
        const res = await fetch('http://localhost:4000/attendance', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error('Failed to fetch attendance');

        const data = await res.json();
        setAttendanceData(data);
      } catch (err: any) {
        toast.error(err.message || 'Error fetching data');
      } finally {
        setLoading(false);
      }
    };

    fetchAttendance();
  }, [router]);

  return (
    <div className="p-6">
      <Toaster />
      <div className="bg-white shadow-xl rounded-2xl p-6">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Employee Attendance</h1>

        {loading ? (
          <p className="text-gray-600">Loading...</p>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-100 text-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left font-semibold">Employee</th>
                  <th className="px-6 py-3 text-left font-semibold">Position</th>
                  <th className="px-6 py-3 text-left font-semibold">Date</th>
                  <th className="px-6 py-3 text-left font-semibold">Check In</th>
                  <th className="px-6 py-3 text-left font-semibold">Check Out</th>
                  <th className="px-6 py-3 text-left font-semibold">Late?</th>
                  <th className="px-6 py-3 text-left font-semibold">Absent?</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {attendanceData.map((entry, index) => (
                  <tr
                    key={entry.id}
                    className={index % 2 === 0 ? 'bg-white hover:bg-gray-50' : 'bg-gray-50 hover:bg-gray-100'}
                  >
                    <td className="px-6 py-3">{entry.employeeName || `#${entry.employeeId}`}</td>
                    <td className="px-6 py-3 text-gray-700">{entry.position || 'N/A'}</td>
                    <td className="px-6 py-3 text-gray-600">{entry.date}</td>
                    <td className="px-6 py-3 text-green-600 font-medium">{entry.checkIn || '-'}</td>
                    <td className="px-6 py-3 text-indigo-600 font-medium">{entry.checkOut || '-'}</td>
                    <td className="px-6 py-3">
                      {entry.isLate ? (
                        <span className="text-yellow-500 font-semibold">Yes</span>
                      ) : (
                        <span className="text-gray-500">No</span>
                      )}
                    </td>
                    <td className="px-6 py-3">
                      {entry.isAbsent ? (
                        <span className="text-red-500 font-semibold">Yes</span>
                      ) : (
                        <span className="text-gray-500">No</span>
                      )}
                    </td>
                  </tr>
                ))}
                {attendanceData.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                      No attendance records found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
