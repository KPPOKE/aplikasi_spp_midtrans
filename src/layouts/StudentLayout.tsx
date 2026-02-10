import { Outlet, Navigate, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { LogOut, Home, History, CreditCard } from 'lucide-react';
import { Logo } from '../components/Logo';
import { ThemeToggle } from '../components/ui';
import { useAuth } from '../context/AuthContext';

const navItems = [
    { path: '/student', icon: Home, label: 'Dashboard', exact: true },
    { path: '/student/bills', icon: CreditCard, label: 'Tagihan' },
    { path: '/student/history', icon: History, label: 'Riwayat' },
];

export function StudentLayout() {
    const { user, role, logout } = useAuth();
    const location = useLocation();

    // Redirect if not authenticated as student
    if (!user || role !== 'student') {
        return <Navigate to="/login/student" replace />;
    }

    return (
        <div className="min-h-screen mesh-bg">
            {/* Header */}
            <header className="sticky top-0 z-40 backdrop-blur-xl bg-white/80 dark:bg-slate-900/80 border-b border-slate-200/50 dark:border-slate-700/50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        {/* Logo */}
                        <Logo size="md" />

                        {/* Right Side */}
                        <div className="flex items-center gap-3">
                            <ThemeToggle />
                            <button
                                onClick={logout}
                                className="flex items-center gap-2 px-4 py-2 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                            >
                                <LogOut className="w-5 h-5" />
                                <span className="hidden sm:inline font-medium">Keluar</span>
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Mobile Nav */}
            <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-40 backdrop-blur-xl bg-white/90 dark:bg-slate-900/90 border-t border-slate-200/50 dark:border-slate-700/50">
                <div className="flex items-center justify-around py-2">
                    {navItems.map((item) => {
                        const isActive = item.exact
                            ? location.pathname === item.path
                            : location.pathname.startsWith(item.path);

                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-colors ${isActive
                                        ? 'text-blue-600 dark:text-blue-400'
                                        : 'text-slate-500 dark:text-slate-400'
                                    }`}
                            >
                                <item.icon className="w-5 h-5" />
                                <span className="text-xs font-medium">{item.label}</span>
                            </Link>
                        );
                    })}
                </div>
            </nav>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24 sm:pb-6">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={location.pathname}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                    >
                        <Outlet />
                    </motion.div>
                </AnimatePresence>
            </main>
        </div>
    );
}
