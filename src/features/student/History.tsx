import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { History as HistoryIcon, CheckCircle } from 'lucide-react';
import { Card, CardContent, SkeletonCard, EmptyState } from '../../components/ui';
import { useAuth } from '../../context/AuthContext';
import { getPaidBillsByStudentId, type Bill } from '../../data/mockData';
import { formatRupiah, formatDateTime } from '../../lib/utils';

export function History() {
    const { user } = useAuth();
    const student = user?.student;

    const [paidBills, setPaidBills] = useState<Bill[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (student) {
                setPaidBills(getPaidBillsByStudentId(student.id));
            }
            setIsLoading(false);
        }, 600);

        return () => clearTimeout(timer);
    }, [student]);

    return (
        <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white mb-6">
                Riwayat Pembayaran
            </h1>

            {isLoading ? (
                <div className="space-y-4">
                    <SkeletonCard />
                    <SkeletonCard />
                </div>
            ) : paidBills.length === 0 ? (
                <EmptyState
                    icon={<HistoryIcon className="w-8 h-8 text-slate-400" />}
                    title="Belum ada riwayat"
                    description="Riwayat pembayaran Anda akan muncul di sini setelah melakukan pembayaran."
                />
            ) : (
                <div className="space-y-4">
                    {paidBills.map((bill, index) => (
                        <motion.div
                            key={bill.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <Card>
                                <CardContent>
                                    <div className="flex items-start gap-4">
                                        {/* Icon */}
                                        <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0">
                                            <CheckCircle className="w-5 h-5 text-green-500" />
                                        </div>

                                        {/* Info */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between gap-2">
                                                <div>
                                                    <h3 className="font-semibold text-slate-900 dark:text-white">
                                                        {bill.title}
                                                    </h3>
                                                    <p className="text-sm text-slate-500 dark:text-slate-400">
                                                        {bill.paymentMethod}
                                                    </p>
                                                </div>
                                                <div className="text-right flex-shrink-0">
                                                    <p className="font-bold text-slate-900 dark:text-white">
                                                        <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
                                                            {formatRupiah(bill.amount).prefix}
                                                        </span>{' '}
                                                        {formatRupiah(bill.amount).value}
                                                    </p>
                                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400">
                                                        <CheckCircle className="w-3 h-3" />
                                                        Lunas
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Details */}
                                            <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-700/50 text-xs text-slate-500 dark:text-slate-400 space-y-1">
                                                <div className="flex items-center justify-between">
                                                    <span>ID Transaksi</span>
                                                    <span className="font-mono">{bill.transactionId}</span>
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <span>Tanggal Bayar</span>
                                                    <span>{bill.paidAt ? formatDateTime(bill.paidAt) : '-'}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
}
