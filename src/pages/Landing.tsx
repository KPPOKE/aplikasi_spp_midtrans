import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { GraduationCap, Shield, ArrowRight } from 'lucide-react';
import { Logo } from '../components/Logo';
import { ThemeToggle } from '../components/ui';

export function Landing() {
    return (
        <div className="min-h-screen mesh-bg flex flex-col">
            {/* Header */}
            <header className="w-full p-4 md:p-4     flex items-center justify-between">
                <Logo size="lg" />
                <ThemeToggle />
            </header>

            {/* Main Content */}
            <main className="flex-1 flex flex-col items-center justify-center px-4 py-12">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-12"
                >
                    <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-4">
                        Selamat Datang di{' '}
                        <span className="text-gradient animate-gradient">EduPay</span>
                    </h1>
                    <p className="text-lg text-slate-600 dark:text-slate-400 max-w-md mx-auto">
                        Sistem pembayaran sekolah modern yang mudah dan aman
                    </p>
                </motion.div>

                {/* Choice Cards */}
                <div className="grid md:grid-cols-2 gap-6 w-full max-w-3xl">
                    {/* Student Card */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        <Link to="/login/student" className="block group">
                            <div className="relative p-[2px] rounded-2xl bg-gradient-to-r from-blue-500 via-cyan-400 to-blue-600 transition-all duration-300 group-hover:scale-105 group-hover:shadow-2xl group-hover:shadow-blue-500/25">
                                <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 h-full">
                                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center mb-6 shadow-lg shadow-blue-500/30">
                                        <GraduationCap className="w-7 h-7 text-white" />
                                    </div>
                                    <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white mb-2">
                                        Siswa
                                    </h2>
                                    <p className="text-slate-600 dark:text-slate-400 mb-6">
                                        Masuk untuk melihat tagihan dan melakukan pembayaran SPP
                                    </p>
                                    <div className="flex items-center text-blue-600 dark:text-blue-400 font-semibold group-hover:gap-3 transition-all duration-300">
                                        <span>Masuk sebagai Siswa</span>
                                        <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </div>
                            </div>
                        </Link>
                    </motion.div>

                    {/* Admin Card */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                    >
                        <Link to="/login/admin" className="block group">
                            <div className="relative p-[2px] rounded-2xl bg-gradient-to-r from-slate-400 via-slate-500 to-slate-600 transition-all duration-300 group-hover:scale-105 group-hover:shadow-2xl group-hover:shadow-slate-500/25">
                                <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 h-full">
                                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center mb-6 shadow-lg shadow-slate-500/30">
                                        <Shield className="w-7 h-7 text-white" />
                                    </div>
                                    <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white mb-2">
                                        Admin
                                    </h2>
                                    <p className="text-slate-600 dark:text-slate-400 mb-6">
                                        Kelola data siswa, tagihan, dan laporan pembayaran
                                    </p>
                                    <div className="flex items-center text-slate-700 dark:text-slate-300 font-semibold group-hover:gap-3 transition-all duration-300">
                                        <span>Masuk sebagai Admin</span>
                                        <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </div>
                            </div>
                        </Link>
                    </motion.div>
                </div>
            </main>

            {/* Footer */}
            <footer className="p-4 text-center text-sm text-slate-500 dark:text-slate-400">
                © 2026 EduPay. Built with ❤️ for better education
            </footer>
        </div>
    );
}
