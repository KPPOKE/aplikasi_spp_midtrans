import { useState, useEffect } from 'react';
import { Drawer } from 'vaul';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CreditCard, Loader2, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import confetti from 'canvas-confetti';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui';
import { type Bill } from '../../data/mockData';
import { formatRupiah, generateOrderId, isMobile, delay } from '../../lib/utils';
import { loadSnapScript, MIDTRANS_CONFIG, type MidtransResult } from '../../lib/midtrans';

interface PaymentDrawerProps {
    bill: Bill | null;
    isOpen: boolean;
    onClose: () => void;
}

const paymentMethods = [
    { id: 'bca_va', name: 'BCA Virtual Account', icon: '🏦' },
    { id: 'bni_va', name: 'BNI Virtual Account', icon: '🏦' },
    { id: 'mandiri_va', name: 'Mandiri Virtual Account', icon: '🏦' },
    { id: 'gopay', name: 'GoPay', icon: '💳' },
    { id: 'qris', name: 'QRIS', icon: '📱' },
];

export function PaymentDrawer({ bill, isOpen, onClose }: PaymentDrawerProps) {
    const navigate = useNavigate();
    const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [snapLoaded, setSnapLoaded] = useState(false);

    // Load Snap script when drawer opens
    useEffect(() => {
        if (isOpen && !snapLoaded) {
            loadSnapScript()
                .then(() => setSnapLoaded(true))
                .catch(() => {
                    toast.error('Gagal memuat sistem pembayaran');
                });
        }
    }, [isOpen, snapLoaded]);

    // Reset state when drawer closes
    useEffect(() => {
        if (!isOpen) {
            setTimeout(() => {
                setSelectedMethod(null);
                setIsProcessing(false);
                setIsSuccess(false);
            }, 300);
        }
    }, [isOpen]);

    const handlePayment = async () => {
        if (!bill || !selectedMethod) return;

        setIsProcessing(true);

        try {
            // Generate order ID
            const orderId = generateOrderId();

            // Simulate payment processing (in production, this calls your backend)
            await delay(1500);

            // Option 1: Use MidTrans Snap popup (if token is real)
            // For demo, we'll simulate success

            // Simulating MidTrans response
            const mockResult: MidtransResult = {
                status_code: '200',
                status_message: 'Success, transaction is found',
                transaction_id: `MT-${orderId}`,
                order_id: orderId,
                gross_amount: bill.amount.toString(),
                payment_type: selectedMethod,
                transaction_time: new Date().toISOString(),
                transaction_status: 'settlement',
            };

            // Success!
            handlePaymentSuccess(mockResult);
        } catch (error) {
            toast.error('Pembayaran gagal', {
                description: 'Terjadi kesalahan. Silakan coba lagi.',
            });
            setIsProcessing(false);
        }
    };

    const handlePaymentSuccess = (result: MidtransResult) => {
        setIsProcessing(false);
        setIsSuccess(true);

        // Trigger confetti
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#3b82f6', '#06b6d4', '#10b981'],
        });

        // Show toast
        toast.success('Pembayaran Berhasil!', {
            description: `Transaksi ${result.order_id} telah diproses`,
        });

        // Navigate to history after delay
        setTimeout(() => {
            onClose();
            navigate('/student/history');
        }, 2000);
    };

    const handleMidtransPayment = async () => {
        if (!bill) return;

        setIsProcessing(true);

        try {
            const orderId = generateOrderId();

            // In production, call your backend to get the transaction token
            // const response = await fetch('/api/payment/create', { ... });
            // const { token } = await response.json();

            // For demo: attempt to open Snap with client key
            // This will show the MidTrans payment popup
            if (window.snap) {
                // This would normally use a real token from your backend
                // For demo purposes, we'll show a simulated success
                await delay(1000);

                // Simulate MidTrans callback
                const mockResult: MidtransResult = {
                    status_code: '200',
                    status_message: 'Success',
                    transaction_id: `MT-${orderId}`,
                    order_id: orderId,
                    gross_amount: bill.amount.toString(),
                    payment_type: 'bank_transfer',
                    transaction_time: new Date().toISOString(),
                    transaction_status: 'settlement',
                };

                handlePaymentSuccess(mockResult);
            } else {
                throw new Error('Snap not loaded');
            }
        } catch (error) {
            toast.error('Pembayaran gagal');
            setIsProcessing(false);
        }
    };

    if (!bill) return null;

    const DrawerContent = (
        <div className="p-6 pb-8">
            {/* Handle bar for mobile */}
            {isMobile() && (
                <div className="w-12 h-1.5 bg-slate-300 dark:bg-slate-600 rounded-full mx-auto mb-6" />
            )}

            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                    Pembayaran
                </h2>
                <button
                    onClick={onClose}
                    className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                >
                    <X className="w-5 h-5 text-slate-500" />
                </button>
            </div>

            <AnimatePresence mode="wait">
                {isSuccess ? (
                    <motion.div
                        key="success"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center py-8"
                    >
                        <div className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-4">
                            <CheckCircle className="w-10 h-10 text-green-500" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                            Pembayaran Berhasil!
                        </h3>
                        <p className="text-slate-500 dark:text-slate-400">
                            Mengalihkan ke riwayat pembayaran...
                        </p>
                    </motion.div>
                ) : (
                    <motion.div
                        key="form"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        {/* Bill Summary */}
                        <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 mb-6">
                            <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">
                                {bill.title}
                            </p>
                            <div className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                                <span className="text-lg font-medium text-slate-500 dark:text-slate-400">
                                    {formatRupiah(bill.amount).prefix}
                                </span>{' '}
                                {formatRupiah(bill.amount).value}
                            </div>
                        </div>

                        {/* Payment Methods */}
                        <div className="mb-6">
                            <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
                                Pilih Metode Pembayaran
                            </p>
                            <div className="space-y-2">
                                {paymentMethods.map((method) => (
                                    <button
                                        key={method.id}
                                        onClick={() => setSelectedMethod(method.id)}
                                        disabled={isProcessing}
                                        className={`w-full flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${selectedMethod === method.id
                                                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                                                : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                                            }`}
                                    >
                                        <span className="text-2xl">{method.icon}</span>
                                        <span className="font-medium text-slate-900 dark:text-white">
                                            {method.name}
                                        </span>
                                        {selectedMethod === method.id && (
                                            <CheckCircle className="w-5 h-5 text-blue-500 ml-auto" />
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Pay Button */}
                        <Button
                            onClick={handlePayment}
                            isLoading={isProcessing}
                            disabled={!selectedMethod || isProcessing}
                            className="w-full"
                            size="lg"
                        >
                            {isProcessing ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Memproses...
                                </>
                            ) : (
                                <>
                                    <CreditCard className="w-5 h-5" />
                                    Konfirmasi Pembayaran
                                </>
                            )}
                        </Button>

                        {/* MidTrans Badge */}
                        <div className="mt-4 text-center">
                            <p className="text-xs text-slate-400 dark:text-slate-500">
                                Powered by MidTrans • Merchant ID: {MIDTRANS_CONFIG.MERCHANT_ID}
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );

    // Use Vaul drawer for mobile, modal for desktop
    if (isMobile()) {
        return (
            <Drawer.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
                <Drawer.Portal>
                    <Drawer.Overlay className="fixed inset-0 bg-black/50 z-50" />
                    <Drawer.Content className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-slate-900 rounded-t-3xl max-h-[90vh] overflow-auto">
                        {DrawerContent}
                    </Drawer.Content>
                </Drawer.Portal>
            </Drawer.Root>
        );
    }

    // Desktop modal
    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 z-50"
                        onClick={onClose}
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl overflow-hidden"
                    >
                        {DrawerContent}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
