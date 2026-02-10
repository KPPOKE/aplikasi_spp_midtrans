import { Calendar, AlertTriangle } from 'lucide-react';
import { Card, CardContent, Button } from '../../components/ui';
import { type Bill } from '../../data/mockData';
import { formatRupiah, formatDate } from '../../lib/utils';

interface BillCardProps {
    bill: Bill;
    onPayClick: () => void;
}

const statusConfig = {
    UNPAID: {
        label: 'Belum Dibayar',
        className: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400',
    },
    PAID: {
        label: 'Lunas',
        className: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400',
    },
    EXPIRED: {
        label: 'Terlambat',
        className: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400',
    },
    PENDING: {
        label: 'Menunggu',
        className: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400',
    },
};

export function BillCard({ bill, onPayClick }: BillCardProps) {
    const status = statusConfig[bill.status];
    const isExpired = bill.status === 'EXPIRED';
    const canPay = bill.status === 'UNPAID' || bill.status === 'EXPIRED';

    return (
        <Card className={isExpired ? 'border-red-200 dark:border-red-800/50' : ''}>
            <CardContent>
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    {/* Info */}
                    <div className="flex-1">
                        <div className="flex items-start gap-2 mb-2">
                            <h3 className="font-semibold text-slate-900 dark:text-white">
                                {bill.title}
                            </h3>
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${status.className}`}>
                                {status.label}
                            </span>
                        </div>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">
                            {bill.description}
                        </p>
                        <div className="flex items-center gap-4 text-sm">
                            <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                                <Calendar className="w-4 h-4" />
                                <span>Jatuh tempo: {formatDate(bill.dueDate)}</span>
                            </div>
                            {isExpired && (
                                <div className="flex items-center gap-1.5 text-red-500">
                                    <AlertTriangle className="w-4 h-4" />
                                    <span className="font-medium">Lewat jatuh tempo</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Amount & Action */}
                    <div className="flex items-center justify-between sm:flex-col sm:items-end gap-3">
                        <div className="text-right">
                            <p className="text-sm text-slate-500 dark:text-slate-400">Total</p>
                            <p className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                                <span className="text-base font-medium text-slate-500 dark:text-slate-400">
                                    {formatRupiah(bill.amount).prefix}
                                </span>{' '}
                                {formatRupiah(bill.amount).value}
                            </p>
                        </div>
                        {canPay && (
                            <Button onClick={onPayClick} size="sm">
                                Bayar
                            </Button>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
