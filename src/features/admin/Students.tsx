import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, MoreHorizontal, User } from 'lucide-react';
import { Card, CardContent, SkeletonTable, EmptyState } from '../../components/ui';
import { mockStudents, type Student } from '../../data/mockData';

export function Students() {
    const [students, setStudents] = useState<Student[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const timer = setTimeout(() => {
            setStudents(mockStudents);
            setIsLoading(false);
        }, 800);

        return () => clearTimeout(timer);
    }, []);

    const filteredStudents = students.filter(
        (s) =>
            s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            s.nisn.includes(searchQuery) ||
            s.className.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white mb-1">
                    Data Siswa
                </h1>
                <p className="text-slate-600 dark:text-slate-400">
                    Kelola data siswa dan informasi pembayaran
                </p>
            </div>

            {/* Search & Filters */}
            <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Cari nama, NISN, atau kelas..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="input pl-10"
                    />
                </div>
                <button className="btn-secondary">
                    <Filter className="w-4 h-4" />
                    Filter
                </button>
            </div>

            {/* Table */}
            <Card>
                <CardContent className="p-0 overflow-x-auto">
                    {isLoading ? (
                        <div className="p-6">
                            <SkeletonTable rows={5} />
                        </div>
                    ) : filteredStudents.length === 0 ? (
                        <EmptyState
                            icon={<User className="w-8 h-8 text-slate-400" />}
                            title="Tidak ada siswa"
                            description={
                                searchQuery
                                    ? 'Tidak ada siswa yang cocok dengan pencarian Anda.'
                                    : 'Belum ada data siswa yang terdaftar.'
                            }
                        />
                    ) : (
                        <table className="w-full table-zebra">
                            <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700">
                                <tr>
                                    <th className="text-left px-6 py-4 text-sm font-semibold text-slate-700 dark:text-slate-300">
                                        Siswa
                                    </th>
                                    <th className="text-left px-6 py-4 text-sm font-semibold text-slate-700 dark:text-slate-300 hidden sm:table-cell">
                                        NISN
                                    </th>
                                    <th className="text-left px-6 py-4 text-sm font-semibold text-slate-700 dark:text-slate-300 hidden md:table-cell">
                                        Kelas
                                    </th>
                                    <th className="text-left px-6 py-4 text-sm font-semibold text-slate-700 dark:text-slate-300 hidden lg:table-cell">
                                        Email
                                    </th>
                                    <th className="text-right px-6 py-4 text-sm font-semibold text-slate-700 dark:text-slate-300">
                                        Aksi
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredStudents.map((student, index) => (
                                    <motion.tr
                                        key={student.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        className="border-b border-slate-100 dark:border-slate-700/50 last:border-0"
                                    >
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <img
                                                    src={student.avatar}
                                                    alt={student.name}
                                                    className="w-10 h-10 rounded-full"
                                                />
                                                <div>
                                                    <p className="font-medium text-slate-900 dark:text-white">
                                                        {student.name}
                                                    </p>
                                                    <p className="text-sm text-slate-500 dark:text-slate-400 sm:hidden">
                                                        {student.nisn}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 hidden sm:table-cell">
                                            <span className="font-mono text-slate-600 dark:text-slate-400">
                                                {student.nisn}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 hidden md:table-cell">
                                            <span className="px-2 py-1 rounded-lg text-sm bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                                                {student.className}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 hidden lg:table-cell">
                                            <span className="text-slate-600 dark:text-slate-400">
                                                {student.email}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                                                <MoreHorizontal className="w-5 h-5 text-slate-500" />
                                            </button>
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
