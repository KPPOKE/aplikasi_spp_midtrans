import { FileText, Download } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, Button } from '../../components/ui';
import { mockAdminStats } from '../../data/mockData';
import { formatRupiahString } from '../../lib/utils';

export function Reports() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white mb-1">
                    Laporan
                </h1>
                <p className="text-slate-600 dark:text-slate-400">
                    Generate dan unduh laporan pembayaran
                </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <FileText className="w-5 h-5 text-blue-500" />
                            Laporan Bulanan
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                            Ringkasan pembayaran bulan ini termasuk total pendapatan, jumlah transaksi, dan status pembayaran.
                        </p>
                        <div className="space-y-2 mb-4">
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-500 dark:text-slate-400">Total Pendapatan</span>
                                <span className="font-semibold text-slate-900 dark:text-white">
                                    {formatRupiahString(mockAdminStats.totalRevenue)}
                                </span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-500 dark:text-slate-400">Transaksi Berhasil</span>
                                <span className="font-semibold text-slate-900 dark:text-white">
                                    {mockAdminStats.totalPaid}
                                </span>
                            </div>
                        </div>
                        <Button variant="secondary" className="w-full">
                            <Download className="w-4 h-4" />
                            Download PDF
                        </Button>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <FileText className="w-5 h-5 text-green-500" />
                            Laporan Tahunan
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                            Laporan lengkap tahun ajaran berjalan dengan analisis tren pembayaran.
                        </p>
                        <div className="space-y-2 mb-4">
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-500 dark:text-slate-400">Periode</span>
                                <span className="font-semibold text-slate-900 dark:text-white">
                                    2025/2026
                                </span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-500 dark:text-slate-400">Total Siswa</span>
                                <span className="font-semibold text-slate-900 dark:text-white">
                                    {mockAdminStats.totalStudents}
                                </span>
                            </div>
                        </div>
                        <Button variant="secondary" className="w-full">
                            <Download className="w-4 h-4" />
                            Download Excel
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
