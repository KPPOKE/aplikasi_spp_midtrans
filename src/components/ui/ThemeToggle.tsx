import { Sun, Moon } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import { cn } from '../../lib/utils';

interface ThemeToggleProps {
    className?: string;
}

export function ThemeToggle({ className }: ThemeToggleProps) {
    const { theme, toggleTheme } = useTheme();

    return (
        <button
            onClick={toggleTheme}
            className={cn(
                'relative p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors duration-200',
                className
            )}
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
            <div className="relative w-5 h-5">
                <motion.div
                    initial={false}
                    animate={{
                        scale: theme === 'light' ? 1 : 0,
                        rotate: theme === 'light' ? 0 : 180,
                        opacity: theme === 'light' ? 1 : 0,
                    }}
                    transition={{ duration: 0.2 }}
                    className="absolute inset-0"
                >
                    <Sun className="w-5 h-5 text-amber-500" />
                </motion.div>
                <motion.div
                    initial={false}
                    animate={{
                        scale: theme === 'dark' ? 1 : 0,
                        rotate: theme === 'dark' ? 0 : -180,
                        opacity: theme === 'dark' ? 1 : 0,
                    }}
                    transition={{ duration: 0.2 }}
                    className="absolute inset-0"
                >
                    <Moon className="w-5 h-5 text-blue-400" />
                </motion.div>
            </div>
        </button>
    );
}
