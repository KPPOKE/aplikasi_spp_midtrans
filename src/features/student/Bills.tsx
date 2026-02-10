import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CreditCard } from 'lucide-react';
import { SkeletonCard, EmptyState } from '../../components/ui';
import { useAuth } from '../../context/AuthContext';
import { getBillsByStudentId, type Bill } from '../../data/mockData';
import { BillCard } from './BillCard';
import { PaymentDrawer } from './PaymentDrawer';

export function Bills() {
    const { user } = useAuth();
    const student = user?.student;

    const [bills, setBills] = useState<Bill[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedBill, setSelectedBill] = useState<Bill | null>(null);
    const [isPaymentOpen, setIsPaymentOpen] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (student) {
                setBills(getBillsByStudentId(student.id));
            }
            setIsLoading(false);
        }, 600);

        return () => clearTimeout(timer);
    }, [student]);

    const unpaidBills = bills.filter((b) => b.status === 'UNPAID' || b.status === 'EXPIRED' || b.status === 'PENDING');

    const handlePayClick = (bill: Bill) => {
        setSelectedBill(bill);
        setIsPaymentOpen(true);
    };

    return (
        <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white mb-6">
                Tagihan Saya
            </h1>

            {isLoading ? (
                <div className="space-y-4">
                    <SkeletonCard />
                    <SkeletonCard />
                    <SkeletonCard />
                </div>
            ) : unpaidBills.length === 0 ? (
                <EmptyState
                    icon={<CreditCard className="w-8 h-8 text-slate-400" />}
                    title="Tidak ada tagihan"
                    description="Semua tagihan Anda sudah dibayar. Anda akan melihat tagihan baru di sini."
                />
            ) : (
                <div className="space-y-4">
                    {unpaidBills.map((bill, index) => (
                        <motion.div
                            key={bill.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <BillCard
                                bill={bill}
                                onPayClick={() => bill.status !== 'PENDING' && handlePayClick(bill)}
                            />
                        </motion.div>
                    ))}
                </div>
            )}

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
