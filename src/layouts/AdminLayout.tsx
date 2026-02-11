import { Outlet, Navigate, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LogOut,
    LayoutDashboard,
    Users,
    CreditCard,
    FileText,
    PanelLeftClose,
    Menu,
    X,
} from 'lucide-react';
import { useState, useEffect } from 'react';
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
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [isDesktop, setIsDesktop] = useState(() =>
        typeof window !== 'undefined' ? window.innerWidth >= 1024 : false
    );

    // Listen for window resize
    useEffect(() => {
        const handleResize = () => setIsDesktop(window.innerWidth >= 1024);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

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

            {/* ===== Desktop Sidebar ===== */}
            <motion.aside
                initial={false}
                animate={{ width: sidebarCollapsed ? 72 : 256 }}
                transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                className="hidden lg:flex fixed top-0 left-0 h-screen z-30 flex-col
                    bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-700"
            >
                {/* Sidebar Header - Logo + Collapse Toggle */}
                <div className="h-16 flex items-center justify-between px-4 border-b border-slate-200 dark:border-slate-700">
                    <AnimatePresence mode="wait">
                        {sidebarCollapsed ? (
                            <motion.button
                                key="collapsed-logo"
                                onClick={() => setSidebarCollapsed(false)}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                transition={{ duration: 0.15 }}
                                className="text-xl font-extrabold tracking-tight text-blue-600 dark:text-blue-400 mx-auto hover:scale-110 transition-transform cursor-pointer"
                                title="Buka Sidebar"
                            >
                                E
                            </motion.button>
                        ) : (
                            <motion.div
                                key="expanded-logo"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.15 }}
                                className="flex items-center justify-between w-full"
                            >
                                <Logo size="lg" />
                                <button
                                    onClick={() => setSidebarCollapsed(true)}
                                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-all"
                                    title="Tutup Sidebar"
                                >
                                    <PanelLeftClose className="w-4 h-4" />
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Nav Items */}
                <nav className="flex-1 px-3 py-4 space-y-1">
                    {navItems.map((item) => {
                        const isActive = isActiveRoute(item.path, item.exact);
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`group relative flex items-center gap-3 rounded-xl transition-all duration-200 ${isActive
                                    ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900'
                                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                                    } ${sidebarCollapsed ? 'mx-auto w-10 h-10 justify-center' : 'px-3 py-2.5'}`}
                            >
                                <item.icon className="w-5 h-5 flex-shrink-0" />

                                <AnimatePresence>
                                    {!sidebarCollapsed && (
                                        <motion.span
                                            initial={{ opacity: 0, x: -8 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -8 }}
                                            transition={{ duration: 0.15 }}
                                            className="font-medium text-sm whitespace-nowrap"
                                        >
                                            {item.label}
                                        </motion.span>
                                    )}
                                </AnimatePresence>

                                {/* Tooltip when collapsed */}
                                {sidebarCollapsed && (
                                    <div className="absolute left-full ml-2 px-2.5 py-1.5 bg-slate-900 dark:bg-slate-700 text-white text-xs font-medium rounded-lg
                                        opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 pointer-events-none whitespace-nowrap z-50 shadow-lg">
                                        {item.label}
                                        <div className="absolute top-1/2 -left-1 -translate-y-1/2 w-2 h-2 bg-slate-900 dark:bg-slate-700 rotate-45" />
                                    </div>
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* Sidebar Footer - Only Logout */}
                <div className={`px-3 py-4 ${sidebarCollapsed ? '' : 'border-t border-slate-200/50 dark:border-slate-700/50'}`}>
                    <button
                        onClick={logout}
                        className={`group relative flex items-center gap-3 rounded-xl
                            text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20
                            font-medium transition-all duration-200
                            ${sidebarCollapsed ? 'mx-auto w-10 h-10 justify-center' : 'w-full px-3 py-2.5'}`}
                    >
                        <LogOut className="w-5 h-5 flex-shrink-0" />
                        <AnimatePresence>
                            {!sidebarCollapsed && (
                                <motion.span
                                    initial={{ opacity: 0, x: -8 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -8 }}
                                    transition={{ duration: 0.15 }}
                                    className="text-sm"
                                >
                                    Keluar
                                </motion.span>
                            )}
                        </AnimatePresence>

                        {/* Tooltip when collapsed */}
                        {sidebarCollapsed && (
                            <div className="absolute left-full ml-2 px-2.5 py-1.5 bg-slate-900 dark:bg-slate-700 text-white text-xs font-medium rounded-lg
                                opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 pointer-events-none whitespace-nowrap z-50 shadow-lg">
                                Keluar
                                <div className="absolute top-1/2 -left-1 -translate-y-1/2 w-2 h-2 bg-slate-900 dark:bg-slate-700 rotate-45" />
                            </div>
                        )}
                    </button>
                </div>
            </motion.aside>

            {/* Desktop Theme Toggle - Top Right */}
            <div className="hidden lg:block fixed top-0 right-0 z-30 p-4">
                <ThemeToggle />
            </div>

            {/* Main Content */}
            <main
                className="min-h-screen transition-[margin-left] duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]"
                style={{
                    marginLeft: isDesktop ? (sidebarCollapsed ? 72 : 256) : 0,
                }}
            >
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
