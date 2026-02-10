import { cn } from '../lib/utils';

interface LogoProps {
    className?: string;
    size?: 'sm' | 'md' | 'lg' | 'xl';
}

const sizes = {
    sm: 'text-xl',
    md: 'text-2xl',
    lg: 'text-3xl',
    xl: 'text-4xl',
};

export function Logo({ className, size = 'md' }: LogoProps) {
    return (
        <span
            className={cn(
                'font-extrabold tracking-tight select-none',
                sizes[size],
                className
            )}
        >
            <span className="text-slate-900 dark:text-white">Edu</span>
            <span className="relative">
                <span className="text-blue-600">P</span>
                <span
                    className="absolute -top-0.5 -right-1 w-1.5 h-1.5 bg-blue-500 rounded-full"
                    aria-hidden="true"
                />
            </span>
            <span className="text-blue-600">ay</span>
        </span>
    );
}
