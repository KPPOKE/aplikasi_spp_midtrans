import { Outlet, Navigate, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LogOut,
    LayoutDashboard,
    Users,
    CreditCard,
    FileText,
    Settings,
    Menu,
    X,
} from 'lucide-react';
import { useState } from 'react';
import { Logo } from '../components/Logo';
import { ThemeToggle } from '../components/ui';
import { useAuth } from '../context/AuthContext';

const navItems = [
    { path: '/admin', icon: LayoutDashboard, label: 'Dashboard', exact: true },
    { path: '/admin/students', icon: Users, label: 'Siswa' },
    { path: '/admin/payments', icon: CreditCard, label: 'Pembayaran' },
    { path: '/admin/reports', icon: FileText, label: 'Laporan' },
];

export function AdminLayout() {
    const { user, role, logout } = useAuth();
    const location = useLocation();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // Redirect if not authenticated as admin
    if (!user || role !== 'admin') {
        return <Navigate to="/login/admin" replace />;
    }

    const isActiveRoute = (path: string, exact?: boolean) => {
        return exact ? location.pathname === path : location.pathname.startsWith(path);
    };

    return (
        <div className="min-h-screen grid-bg">
            {/* Mobile Header */}
            <header className="lg:hidden sticky top-0 z-40 backdrop-blur-xl bg-white/90 dark:bg-slate-900/90 border-b border-slate-200/50 dark:border-slate-700/50">
                <div className="flex items-center justify-between px-4 h-16">
                    <button
                        onClick={() => setIsSidebarOpen(true)}
                        className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                    >
                        <Menu className="w-6 h-6 text-slate-600 dark:text-slate-400" />
                    </button>
                    <Logo size="md" />
                    <ThemeToggle />
                </div>
            </header>

            {/* Mobile Sidebar Overlay */}
            <AnimatePresence>
                {isSidebarOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="lg:hidden fixed inset-0 bg-black/50 z-40"
                            onClick={() => setIsSidebarOpen(false)}
                        />
                        <motion.aside
                            initial={{ x: -280 }}
                            animate={{ x: 0 }}
                            exit={{ x: -280 }}
                            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                            className="lg:hidden fixed left-0 top-0 bottom-0 w-72 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-700 z-50 flex flex-col"
                        >
                            <div className="p-4 flex items-center justify-between border-b border-slate-200 dark:border-slate-700">
                                <Logo size="lg" />
                                <button
                                    onClick={() => setIsSidebarOpen(false)}
                                    className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                                >
                                    <X className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                                </button>
                            </div>
                            <nav className="flex-1 p-4 space-y-1">
                                {navItems.map((item) => {
                                    const isActive = isActiveRoute(item.path, item.exact);
                                    return (
                                        <Link
                                            key={item.path}
                                            to={item.path}
                                            onClick={() => setIsSidebarOpen(false)}
                                            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${isActive
                                                    ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900'
                                                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                                                }`}
                                        >
                                            <item.icon className="w-5 h-5" />
                                            {item.label}
                                        </Link>
                                    );
                                })}
                            </nav>
                            <div className="p-4 border-t border-slate-200 dark:border-slate-700">
                                <button
                                    onClick={logout}
                                    className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 font-medium transition-colors"
                                >
                                    <LogOut className="w-5 h-5" />
                                    Keluar
                                </button>
                            </div>
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>

            {/* Desktop Sidebar */}
            <aside className="hidden lg:flex lg:fixed lg:left-0 lg:top-0 lg:h-screen lg:w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-700 flex-col z-30">
                <div className="p-6 border-b border-slate-200 dark:border-slate-700">
                    <Logo size="lg" />
                </div>
                <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                    {navItems.map((item) => {
                        const isActive = isActiveRoute(item.path, item.exact);
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${isActive
                                        ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900'
                                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                                    }`}
                            >
                                <item.icon className="w-5 h-5" />
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>
                <div className="p-4 border-t border-slate-200 dark:border-slate-700 space-y-2">
                    <div className="flex items-center gap-3 px-4 py-2">
                        <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
                            <Settings className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="font-medium text-slate-900 dark:text-white truncate">
                                {user.admin?.name}
                            </p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                Administrator
                            </p>
                        </div>
                        <ThemeToggle />
                    </div>
                    <button
                        onClick={logout}
                        className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 font-medium transition-colors"
                    >
                        <LogOut className="w-5 h-5" />
                        Keluar
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="lg:ml-64 min-h-screen">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
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
                </div>
            </main>
        </div>
    );
}
