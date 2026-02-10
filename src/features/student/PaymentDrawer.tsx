import { useState, useEffect } from 'react';
import { Drawer } from 'vaul';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CreditCard, Loader2, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import confetti from 'canvas-confetti';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui';
import { type Bill } from '../../data/mockData';
import { formatRupiah, generateOrderId, isMobile } from '../../lib/utils';
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

            // Call backend to create transaction and get Snap token
            const response = await fetch('http://localhost:3001/api/payment/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    orderId,
                    amount: bill.amount,
                    name: bill.title,
                    billTitle: bill.title,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Gagal membuat transaksi');
            }

            const { token } = await response.json();

            // Ensure Snap is loaded
            await loadSnapScript();

            if (!window.snap) {
                throw new Error('Snap tidak tersedia');
            }

            setIsProcessing(false);

            // Open MidTrans Snap payment popup
            window.snap.pay(token, {
                onSuccess: (result: MidtransResult) => {
                    handlePaymentSuccess(result);
                },
                onPending: (result: MidtransResult) => {
                    toast.info('Pembayaran Pending', {
                        description: `Selesaikan pembayaran Anda. Order ID: ${result.order_id}`,
                    });
                    onClose();
                },
                onError: (result: MidtransResult) => {
                    toast.error('Pembayaran Gagal', {
                        description: result.status_message || 'Terjadi kesalahan',
                    });
                },
                onClose: () => {
                    toast.info('Pembayaran dibatalkan', {
                        description: 'Anda menutup popup pembayaran',
                    });
                },
            });
        } catch (error) {
            console.error('Payment error:', error);
            toast.error('Pembayaran gagal', {
                description: error instanceof Error ? error.message : 'Terjadi kesalahan. Silakan coba lagi.',
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

    if (!bill) return null;

    const PaymentContent = () => (
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
                    className="flex flex-col h-full"
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
                    <div className="mb-6 flex-1 overflow-y-auto">
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

                    {/* Pay Button - sticky at bottom */}
                    <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
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
                        <div className="mt-3 text-center">
                            <p className="text-xs text-slate-400 dark:text-slate-500">
                                Powered by MidTrans • Merchant ID: {MIDTRANS_CONFIG.MERCHANT_ID}
                            </p>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );

    // Use Vaul drawer for mobile, modal for desktop
    if (isMobile()) {
        return (
            <Drawer.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
                <Drawer.Portal>
                    <Drawer.Overlay className="fixed inset-0 bg-black/50 z-50" />
                    <Drawer.Content className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-slate-900 rounded-t-3xl max-h-[85vh] flex flex-col">
                        {/* Drag handle */}
                        <div className="pt-4 pb-2 flex-shrink-0">
                            <div className="w-12 h-1.5 bg-slate-300 dark:bg-slate-600 rounded-full mx-auto" />
                        </div>
                        {/* Header */}
                        <div className="px-6 pb-4 flex items-center justify-between flex-shrink-0">
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
                        {/* Scrollable content */}
                        <div className="px-6 pb-6 overflow-y-auto flex-1" style={{ paddingBottom: 'env(safe-area-inset-bottom, 24px)' }}>
                            <PaymentContent />
                        </div>
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
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-h-[85vh] flex flex-col pointer-events-auto"
                        >
                            {/* Header */}
                            <div className="p-6 pb-4 flex items-center justify-between flex-shrink-0">
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
                            {/* Scrollable content */}
                            <div className="px-6 pb-6 overflow-y-auto flex-1">
                                <PaymentContent />
                            </div>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
}
