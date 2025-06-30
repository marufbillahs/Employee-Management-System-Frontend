'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Toaster, toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

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
    <div className="relative min-h-[80vh] p-6 flex flex-col items-center justify-start bg-gradient-to-br from-emerald-50 via-white to-green-50">
      <Toaster position="top-center" />
      {/* Decorative bubbles */}
      <motion.div
        initial={{ opacity: 0, scale: 0.7, x: -80, y: -40 }}
        animate={{ opacity: 0.13, scale: 1, x: 0, y: 0 }}
        transition={{ duration: 1.1, type: 'spring' }}
        className="absolute top-[-100px] left-[-100px] w-[200px] h-[200px] rounded-full bg-gradient-to-tr from-green-400 to-emerald-300 blur-2xl z-0"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.7, x: 80, y: 40 }}
        animate={{ opacity: 0.13, scale: 1, x: 0, y: 0 }}
        transition={{ duration: 1.1, type: 'spring', delay: 0.4 }}
        className="absolute bottom-[-110px] right-[-90px] w-[180px] h-[180px] rounded-full bg-gradient-to-tr from-emerald-300 to-green-400 blur-2xl z-0"
      />

      <motion.div
        className="bg-white shadow-2xl rounded-2xl p-6 w-full max-w-6xl z-10"
        initial={{ opacity: 0, scale: 0.97, y: 25 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.7, type: 'spring' }}
      >
        <motion.h1
          className="text-3xl font-bold mb-8 text-emerald-700 tracking-tight"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Employee Attendance
        </motion.h1>
        {loading ? (
          <motion.p
            className="text-gray-600 text-center py-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            Loading...
          </motion.p>
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
                <AnimatePresence>
                  {attendanceData.map((entry, index) => (
                    <motion.tr
                      key={entry.id}
                      initial={{ opacity: 0, y: 18 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.97 }}
                      transition={{ duration: 0.33, delay: index * 0.04 }}
                      className={index % 2 === 0 ? 'bg-white hover:bg-gray-50' : 'bg-gray-50 hover:bg-gray-100'}
                    >
                      <td className="px-6 py-3">{entry.employeeName || `#${entry.employeeId}`}</td>
                      <td className="px-6 py-3 text-gray-700">{entry.position || 'N/A'}</td>
                      <td className="px-6 py-3 text-gray-600">{entry.date}</td>
                      <td className="px-6 py-3 text-green-600 font-medium">{entry.checkIn || '-'}</td>
                      <td className="px-6 py-3 text-indigo-600 font-medium">{entry.checkOut || '-'}</td>
                      <td className="px-6 py-3">
                        {entry.isLate ? (
                          <motion.span
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ type: 'spring', duration: 0.2, delay: index * 0.025 }}
                            className="text-yellow-500 font-semibold"
                          >
                            Yes
                          </motion.span>
                        ) : (
                          <span className="text-gray-500">No</span>
                        )}
                      </td>
                      <td className="px-6 py-3">
                        {entry.isAbsent ? (
                          <motion.span
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ type: 'spring', duration: 0.2, delay: index * 0.02 }}
                            className="text-red-500 font-semibold"
                          >
                            Yes
                          </motion.span>
                        ) : (
                          <span className="text-gray-500">No</span>
                        )}
                      </td>
                    </motion.tr>
                  ))}
                  {attendanceData.length === 0 && (
                    <motion.tr
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                        No attendance records found.
                      </td>
                    </motion.tr>
                  )}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        )}
      </motion.div>
    </div>
  );
}