import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, CheckCircle, Clock, XCircle, CreditCard } from 'lucide-react';
import { Card, CardContent, SkeletonTable, EmptyState } from '../../components/ui';
import { mockPayments, type Payment } from '../../data/mockData';
import { formatRupiahString, formatDateTime } from '../../lib/utils';

const statusConfig = {
    success: {
        label: 'Berhasil',
        icon: CheckCircle,
        className: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400',
    },
    pending: {
        label: 'Menunggu',
        icon: Clock,
        className: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400',
    },
    failed: {
        label: 'Gagal',
        icon: XCircle,
        className: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400',
    },
};

export function Payments() {
    const [payments, setPayments] = useState<Payment[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');

    useEffect(() => {
        const timer = setTimeout(() => {
            setPayments(mockPayments);
            setIsLoading(false);
        }, 800);

        return () => clearTimeout(timer);
    }, []);

    const filteredPayments = payments.filter((p) => {
        const matchesSearch =
            p.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.transactionId.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white mb-1">
                    Riwayat Pembayaran
                </h1>
                <p className="text-slate-600 dark:text-slate-400">
                    Lihat dan kelola semua transaksi pembayaran
                </p>
            </div>

            {/* Search & Filters */}
            <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Cari nama atau ID transaksi..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="input pl-10"
                    />
                </div>
                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="input w-full sm:w-40"
                >
                    <option value="all">Semua Status</option>
                    <option value="success">Berhasil</option>
                    <option value="pending">Menunggu</option>
                    <option value="failed">Gagal</option>
                </select>
            </div>

            {/* Table */}
            <Card>
                <CardContent className="p-0 overflow-x-auto">
                    {isLoading ? (
                        <div className="p-6">
                            <SkeletonTable rows={5} />
                        </div>
                    ) : filteredPayments.length === 0 ? (
                        <EmptyState
                            icon={<CreditCard className="w-8 h-8 text-slate-400" />}
                            title="Tidak ada pembayaran"
                            description={
                                searchQuery || statusFilter !== 'all'
                                    ? 'Tidak ada pembayaran yang cocok dengan filter Anda.'
                                    : 'Belum ada data pembayaran.'
                            }
                        />
                    ) : (
                        <table className="w-full table-zebra">
                            <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700">
                                <tr>
                                    <th className="text-left px-6 py-4 text-sm font-semibold text-slate-700 dark:text-slate-300">
                                        ID Transaksi
                                    </th>
                                    <th className="text-left px-6 py-4 text-sm font-semibold text-slate-700 dark:text-slate-300 hidden sm:table-cell">
                                        Siswa
                                    </th>
                                    <th className="text-left px-6 py-4 text-sm font-semibold text-slate-700 dark:text-slate-300 hidden md:table-cell">
                                        Metode
                                    </th>
                                    <th className="text-right px-6 py-4 text-sm font-semibold text-slate-700 dark:text-slate-300">
                                        Jumlah
                                    </th>
                                    <th className="text-center px-6 py-4 text-sm font-semibold text-slate-700 dark:text-slate-300">
                                        Status
                                    </th>
                                    <th className="text-left px-6 py-4 text-sm font-semibold text-slate-700 dark:text-slate-300 hidden lg:table-cell">
                                        Tanggal
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredPayments.map((payment, index) => {
                                    const status = statusConfig[payment.status];
                                    const StatusIcon = status.icon;

                                    return (
                                        <motion.tr
                                            key={payment.id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.05 }}
                                            className="border-b border-slate-100 dark:border-slate-700/50 last:border-0"
                                        >
                                            <td className="px-6 py-4">
                                                <span className="font-mono text-sm text-slate-900 dark:text-white">
                                                    {payment.transactionId}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 hidden sm:table-cell">
                                                <span className="text-slate-700 dark:text-slate-300">
                                                    {payment.studentName}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 hidden md:table-cell">
                                                <span className="text-slate-600 dark:text-slate-400">
                                                    {payment.method}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <span className="font-semibold text-slate-900 dark:text-white">
                                                    {formatRupiahString(payment.amount)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${status.className}`}>
                                                    <StatusIcon className="w-3 h-3" />
                                                    {status.label}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 hidden lg:table-cell">
                                                <span className="text-sm text-slate-600 dark:text-slate-400">
                                                    {formatDateTime(payment.createdAt)}
                                                </span>
                                            </td>
                                        </motion.tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
