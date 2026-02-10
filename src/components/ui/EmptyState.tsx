import { type ReactNode } from 'react';
import { cn } from '../../lib/utils';
import { PackageOpen } from 'lucide-react';

interface EmptyStateProps {
    title?: string;
    description?: string;
    icon?: ReactNode;
    action?: ReactNode;
    className?: string;
}

export function EmptyState({
    title = 'Tidak ada data',
    description = 'Belum ada data yang tersedia saat ini.',
    icon,
    action,
    className,
}: EmptyStateProps) {
    return (
        <div className={cn('flex flex-col items-center justify-center py-12 px-4 text-center', className)}>
            <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4">
                {icon || <PackageOpen className="w-8 h-8 text-slate-400" />}
            </div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-1">
                {title}
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm">
                {description}
            </p>
            {action && <div className="mt-4">{action}</div>}
        </div>
    );
}
