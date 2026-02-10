import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, History, AlertCircle, CheckCircle } from 'lucide-react';
import { Card, CardContent, SkeletonCard } from '../../components/ui';
import { useAuth } from '../../context/AuthContext';
import { getBillsByStudentId, type Bill } from '../../data/mockData';
import { formatRupiah } from '../../lib/utils';
import { BillCard } from './BillCard';
import { PaymentDrawer } from './PaymentDrawer';

export function StudentDashboard() {
    const { user } = useAuth();
    const student = user?.student;

    const [bills, setBills] = useState<Bill[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedBill, setSelectedBill] = useState<Bill | null>(null);
    const [isPaymentOpen, setIsPaymentOpen] = useState(false);

    useEffect(() => {
        // Simulate loading
        const timer = setTimeout(() => {
            if (student) {
                setBills(getBillsByStudentId(student.id));
            }
            setIsLoading(false);
        }, 800);

        return () => clearTimeout(timer);
    }, [student]);

    const unpaidBills = bills.filter((b) => b.status === 'UNPAID' || b.status === 'EXPIRED');
    const paidBills = bills.filter((b) => b.status === 'PAID');
    const totalUnpaid = unpaidBills.reduce((sum, b) => sum + b.amount, 0);

    const handlePayClick = (bill: Bill) => {
        setSelectedBill(bill);
        setIsPaymentOpen(true);
    };

    return (
        <div className="space-y-6">
            {/* Greeting */}
            <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                    Halo, {student?.name.split(' ')[0]}!{' '}
                    <motion.span
                        className="inline-block origin-bottom-right"
                        animate={{ rotate: [0, 20, 0, -10, 0] }}
                        transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            repeatDelay: 2,
                        }}
                    >
                        👋
                    </motion.span>
                </h1>
            </div>

            <p className="text-slate-600 dark:text-slate-400">
                Selamat datang kembali! Berikut ringkasan pembayaran kamu.
            </p>

            {/* Stats Bento Grid */}
            {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <SkeletonCard />
                    <SkeletonCard />
                    <SkeletonCard />
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {/* Tagihan Aktif */}
                    <Card className="relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 dark:from-blue-500/5 dark:to-cyan-500/5" />
                        <CardContent className="relative">
                            <div className="flex items-center justify-between mb-4">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-blue-500/25">
                                    <CreditCard className="w-6 h-6 text-white" />
                                </div>
                                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400">
                                    {unpaidBills.length} Tagihan
                                </span>
                            </div>
                            <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">
                                Total Tagihan Aktif
                            </p>
                            <div className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                                <span className="text-lg font-medium text-slate-500 dark:text-slate-400">
                                    {formatRupiah(totalUnpaid).prefix}
                                </span>{' '}
                                {formatRupiah(totalUnpaid).value}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Lunas */}
                    <Card className="relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-emerald-500/10 dark:from-green-500/5 dark:to-emerald-500/5" />
                        <CardContent className="relative">
                            <div className="flex items-center justify-between mb-4">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-400 flex items-center justify-center shadow-lg shadow-green-500/25">
                                    <CheckCircle className="w-6 h-6 text-white" />
                                </div>
                                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400">
                                    Lunas
                                </span>
                            </div>
                            <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">
                                Riwayat Pembayaran
                            </p>
                            <div className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                                {paidBills.length} Transaksi
                            </div>
                        </CardContent>
                    </Card>

                    {/* Student Info */}
                    <Card className="sm:col-span-2 lg:col-span-1">
                        <CardContent>
                            <div className="flex items-center gap-4">
                                <img
                                    src={student?.avatar}
                                    alt={student?.name}
                                    className="w-14 h-14 rounded-xl"
                                />
                                <div>
                                    <p className="font-semibold text-slate-900 dark:text-white">
                                        {student?.name}
                                    </p>
                                    <p className="text-sm text-slate-500 dark:text-slate-400">
                                        NISN: {student?.nisn}
                                    </p>
                                    <p className="text-sm text-slate-500 dark:text-slate-400">
                                        {student?.className}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* Unpaid Bills */}
            <div>
                <h2 className="text-lg font-semibold tracking-tight text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-amber-500" />
                    Tagihan Belum Dibayar
                </h2>

                {isLoading ? (
                    <div className="space-y-4">
                        <SkeletonCard />
                        <SkeletonCard />
                    </div>
                ) : unpaidBills.length === 0 ? (
                    <Card>
                        <CardContent className="text-center py-8">
                            <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
                            <p className="font-medium text-slate-900 dark:text-white">
                                Semua tagihan sudah lunas!
                            </p>
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                                Tidak ada tagihan yang perlu dibayar saat ini.
                            </p>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="space-y-4">
                        {unpaidBills.map((bill, index) => (
                            <motion.div
                                key={bill.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <BillCard bill={bill} onPayClick={() => handlePayClick(bill)} />
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>

            {/* Payment Drawer */}
            <PaymentDrawer
                bill={selectedBill}
                isOpen={isPaymentOpen}
                onClose={() => {
                    setIsPaymentOpen(false);
                    setSelectedBill(null);
                }}
            />
        </div>
    );
}
