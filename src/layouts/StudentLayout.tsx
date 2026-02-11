import { Outlet, Navigate, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { LogOut, Home, History, CreditCard, PanelLeftClose } from 'lucide-react';
import { useState, useEffect } from 'react';
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
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [isDesktop, setIsDesktop] = useState(() =>
        typeof window !== 'undefined' ? window.innerWidth >= 640 : false
    );

    // Listen for window resize to toggle desktop/mobile
    useEffect(() => {
        const handleResize = () => setIsDesktop(window.innerWidth >= 640);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Redirect if not authenticated as student
    if (!user || role !== 'student') {
        return <Navigate to="/login/student" replace />;
    }

    return (
        <div className="min-h-screen mesh-bg">
            {/* ===== Desktop Sidebar (hidden on mobile) ===== */}
            <motion.aside
                initial={false}
                animate={{ width: sidebarCollapsed ? '4.5rem' : '15rem' }}
                transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                className="hidden sm:flex fixed top-0 left-0 h-screen z-40 flex-col
                    bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl
                    border-r border-slate-200/50 dark:border-slate-700/50"
            >
                {/* Sidebar Header - Logo + Collapse Toggle */}
                <div className="h-16 flex items-center justify-between px-4 border-b border-slate-200/50 dark:border-slate-700/50">
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
                                <Logo size="md" />
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
                        const isActive = item.exact
                            ? location.pathname === item.path
                            : location.pathname.startsWith(item.path);

                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`group relative flex items-center gap-3 rounded-xl transition-all duration-200 ${isActive
                                    ? 'bg-blue-500/10 dark:bg-blue-500/15 text-blue-600 dark:text-blue-400'
                                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-white'
                                    } ${sidebarCollapsed ? 'mx-auto w-10 h-10 justify-center' : 'px-3 py-2.5'}`}
                            >
                                <item.icon className={`w-5 h-5 flex-shrink-0 transition-colors ${isActive ? 'text-blue-500' : ''}`} />

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
                            text-slate-600 dark:text-slate-400 hover:bg-red-50 dark:hover:bg-red-900/20
                            hover:text-red-600 dark:hover:text-red-400 transition-all duration-200
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
                                    className="font-medium text-sm"
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

            {/* ===== Desktop Top Bar - Theme Toggle (hidden on mobile) ===== */}
            <div
                className="hidden sm:block fixed top-0 right-0 z-30 p-4"
            >
                <ThemeToggle />
            </div>

            {/* ===== Mobile Header (hidden on desktop) ===== */}
            <header className="sm:hidden sticky top-0 z-40 backdrop-blur-xl bg-white/80 dark:bg-slate-900/80 border-b border-slate-200/50 dark:border-slate-700/50">
                <div className="px-4">
                    <div className="flex items-center justify-between h-14">
                        <Logo size="sm" />
                        <div className="flex items-center gap-2">
                            <ThemeToggle />
                            <button
                                onClick={logout}
                                className="flex items-center gap-2 px-3 py-2 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                            >
                                <LogOut className="w-4 h-4" />
                                <span className="text-sm font-medium">Keluar</span>
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* ===== Mobile Bottom Nav ===== */}
            <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-40 backdrop-blur-xl bg-white/90 dark:bg-slate-900/90 border-t border-slate-200/50 dark:border-slate-700/50 safe-area-bottom">
                <div className="flex items-center py-2">
                    {navItems.map((item) => {
                        const isActive = item.exact
                            ? location.pathname === item.path
                            : location.pathname.startsWith(item.path);

                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex-1 flex flex-col items-center justify-center gap-1 py-2 transition-colors ${isActive
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

            {/* ===== Main Content ===== */}
            <main
                className="min-h-screen transition-[margin-left] duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]"
                style={{
                    marginLeft: isDesktop ? (sidebarCollapsed ? '4.5rem' : '15rem') : 0,
                }}
            >
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24 sm:pb-6">
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
