import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Lock, User } from 'lucide-react';
import { toast } from 'sonner';
import { Logo } from '../../components/Logo';
import { Button, Input, ThemeToggle } from '../../components/ui';
import { useAuth } from '../../context/AuthContext';
import { adminLoginSchema, type AdminLoginInput } from '../../lib/schemas';
import { sanitize } from '../../lib/utils';

export function AdminLogin() {
    const navigate = useNavigate();
    const { login } = useAuth();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<AdminLoginInput>({
        resolver: zodResolver(adminLoginSchema),
    });

    const onSubmit = async (data: AdminLoginInput) => {
        // Sanitize inputs
        const sanitizedUsername = sanitize(data.username);
        const sanitizedPassword = sanitize(data.password);

        const success = await login('admin', {
            username: sanitizedUsername,
            password: sanitizedPassword,
        });

        if (success) {
            toast.success('Login berhasil!', {
                description: 'Selamat datang, Admin',
            });
            navigate('/admin');
        } else {
            toast.error('Login gagal', {
                description: 'Username atau password salah.',
            });
        }
    };

    return (
        <div className="min-h-screen bg-slate-900 flex flex-col">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-grid-pattern bg-grid opacity-30" />

            {/* Header */}
            <header className="relative z-10 w-full p-4 md:p-6 flex items-center justify-between">
                <Link
                    to="/"
                    className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                    <span className="font-medium">Kembali</span>
                </Link>
                <ThemeToggle />
            </header>

            {/* Main Content */}
            <main className="relative z-10 flex-1 flex items-center justify-center px-4 py-12">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4 }}
                    className="w-full max-w-md"
                >
                    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-8">
                        {/* Logo & Title */}
                        <div className="text-center mb-8">
                            <Logo size="xl" className="mb-4 inline-block" />
                            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white mb-2">
                                Login Admin
                            </h1>
                            <p className="text-slate-600 dark:text-slate-400">
                                Masukkan kredensial administrator
                            </p>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                            <Input
                                {...register('username')}
                                label="Username"
                                placeholder="Masukkan username"
                                error={errors.username?.message}
                                autoComplete="username"
                            />

                            <Input
                                {...register('password')}
                                type="password"
                                label="Password"
                                placeholder="Masukkan password"
                                error={errors.password?.message}
                                autoComplete="current-password"
                            />

                            <Button
                                type="submit"
                                isLoading={isSubmitting}
                                className="w-full"
                                size="lg"
                            >
                                <Lock className="w-5 h-5" />
                                Masuk
                            </Button>
                        </form>

                        {/* Demo Hint */}
                        <div className="mt-6 p-4 rounded-xl bg-slate-100 dark:bg-slate-700/50">
                            <p className="text-sm text-slate-600 dark:text-slate-300">
                                <strong>Demo:</strong> Username{' '}
                                <code className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-600 font-mono">
                                    admin
                                </code>{' '}
                                Password{' '}
                                <code className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-600 font-mono">
                                    admin123
                                </code>
                            </p>
                        </div>
                    </div>
                </motion.div>
            </main>
        </div>
    );
}
