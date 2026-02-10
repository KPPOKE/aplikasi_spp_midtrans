import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Users,
    CreditCard,
    TrendingUp,
    AlertCircle,
    ArrowUpRight,
    ArrowDownRight,
} from 'lucide-react';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, SkeletonStats, Skeleton } from '../../components/ui';
import { mockAdminStats, mockPayments, type Payment } from '../../data/mockData';
import { formatRupiahString, formatDateTime } from '../../lib/utils';

export function AdminDashboard() {
    const [stats, setStats] = useState(mockAdminStats);
    const [recentPayments, setRecentPayments] = useState<Payment[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setRecentPayments(mockPayments.slice(0, 5));
            setIsLoading(false);
        }, 800);

        return () => clearTimeout(timer);
    }, []);

    const statCards = [
        {
            title: 'Total Siswa',
            value: stats.totalStudents.toString(),
            icon: Users,
            color: 'from-blue-500 to-blue-600',
            shadowColor: 'shadow-blue-500/25',
            change: '+12',
            changeType: 'up' as const,
        },
        {
            title: 'Total Tagihan',
            value: stats.totalBills.toString(),
            icon: CreditCard,
            color: 'from-purple-500 to-purple-600',
            shadowColor: 'shadow-purple-500/25',
            change: '+24',
            changeType: 'up' as const,
        },
        {
            title: 'Sudah Dibayar',
            value: stats.totalPaid.toString(),
            icon: TrendingUp,
            color: 'from-green-500 to-green-600',
            shadowColor: 'shadow-green-500/25',
            change: '+8',
            changeType: 'up' as const,
        },
        {
            title: 'Belum Dibayar',
            value: stats.totalUnpaid.toString(),
            icon: AlertCircle,
            color: 'from-amber-500 to-amber-600',
            shadowColor: 'shadow-amber-500/25',
            change: '-3',
            changeType: 'down' as const,
        },
    ];

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white mb-1">
                    Dashboard Admin
                </h1>
                <p className="text-slate-600 dark:text-slate-400">
                    Selamat datang kembali! Berikut ringkasan data hari ini.
                </p>
            </div>

            {/* Stats Grid */}
            {isLoading ? (
                <SkeletonStats />
            ) : (
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {statCards.map((stat, index) => (
                        <motion.div
                            key={stat.title}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <Card>
                                <CardContent>
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <p className="text-sm text-slate-500 dark:text-slate-400">
                                                {stat.title}
                                            </p>
                                            <p className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white mt-1">
                                                {stat.value}
                                            </p>
                                            <div className={`flex items-center gap-1 mt-2 text-xs font-medium ${stat.changeType === 'up' ? 'text-green-600' : 'text-red-600'
                                                }`}>
                                                {stat.changeType === 'up' ? (
                                                    <ArrowUpRight className="w-3 h-3" />
                                                ) : (
                                                    <ArrowDownRight className="w-3 h-3" />
                                                )}
                                                {stat.change} bulan ini
                                            </div>
                                        </div>
                                        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg ${stat.shadowColor}`}>
                                            <stat.icon className="w-5 h-5 text-white" />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Chart & Recent Payments */}
            <div className="grid lg:grid-cols-3 gap-6">
                {/* Revenue Chart */}
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle>Pendapatan Bulanan</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {isLoading ? (
                            <Skeleton className="h-64 w-full" />
                        ) : (
                            <div className="h-64">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={stats.monthlyRevenue}>
                                        <defs>
                                            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                                        <XAxis
                                            dataKey="month"
                                            stroke="#94a3b8"
                                            fontSize={12}
                                            tickLine={false}
                                            axisLine={false}
                                        />
                                        <YAxis
                                            stroke="#94a3b8"
                                            fontSize={12}
                                            tickLine={false}
                                            axisLine={false}
                                            tickFormatter={(value) => `${value / 1000000}jt`}
                                        />
                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor: 'white',
                                                border: '1px solid #e2e8f0',
                                                borderRadius: '8px',
                                                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                                            }}
                                            formatter={(value: number) => [formatRupiahString(value), 'Pendapatan']}
                                        />
                                        <Area
                                            type="monotone"
                                            dataKey="revenue"
                                            stroke="#3b82f6"
                                            strokeWidth={2}
                                            fillOpacity={1}
                                            fill="url(#colorRevenue)"
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Recent Payments */}
                <Card>
                    <CardHeader>
                        <CardTitle>Pembayaran Terbaru</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {isLoading ? (
                            <div className="space-y-4">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="flex items-center gap-3">
                                        <Skeleton className="w-10 h-10 rounded-full" />
                                        <div className="flex-1">
                                            <Skeleton className="h-4 w-24 mb-1" />
                                            <Skeleton className="h-3 w-16" />
                                        </div>
                                        <Skeleton className="h-4 w-20" />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {recentPayments.map((payment) => (
                                    <div key={payment.id} className="flex items-center gap-3">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${payment.status === 'success'
                                                ? 'bg-green-100 dark:bg-green-900/30'
                                                : payment.status === 'pending'
                                                    ? 'bg-amber-100 dark:bg-amber-900/30'
                                                    : 'bg-red-100 dark:bg-red-900/30'
                                            }`}>
                                            <CreditCard className={`w-5 h-5 ${payment.status === 'success'
                                                    ? 'text-green-600'
                                                    : payment.status === 'pending'
                                                        ? 'text-amber-600'
                                                        : 'text-red-600'
                                                }`} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium text-slate-900 dark:text-white truncate">
                                                {payment.studentName}
                                            </p>
                                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                                {payment.method}
                                            </p>
                                        </div>
                                        <p className="font-semibold text-slate-900 dark:text-white">
                                            {formatRupiahString(payment.amount)}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Total Revenue */}
            <Card className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-500" />
                <CardContent className="relative text-white py-8">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <p className="text-blue-100 mb-1">Total Pendapatan</p>
                            <p className="text-4xl font-bold tracking-tight">
                                {formatRupiahString(stats.totalRevenue)}
                            </p>
                        </div>
                        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm">
                            <TrendingUp className="w-5 h-5" />
                            <span className="font-semibold">+15.3% dari bulan lalu</span>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
