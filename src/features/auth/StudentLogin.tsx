import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, User } from 'lucide-react';
import { toast } from 'sonner';
import { Logo } from '../../components/Logo';
import { Button, Input, ThemeToggle } from '../../components/ui';
import { useAuth } from '../../context/AuthContext';
import { studentLoginSchema, type StudentLoginInput } from '../../lib/schemas';
import { sanitize } from '../../lib/utils';

export function StudentLogin() {
    const navigate = useNavigate();
    const { login } = useAuth();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<StudentLoginInput>({
        resolver: zodResolver(studentLoginSchema),
    });

    const onSubmit = async (data: StudentLoginInput) => {
        // Sanitize input
        const sanitizedNisn = sanitize(data.nisn);

        const success = await login('student', { nisn: sanitizedNisn });

        if (success) {
            toast.success('Login berhasil!', {
                description: 'Selamat datang kembali',
            });
            navigate('/student');
        } else {
            toast.error('Login gagal', {
                description: 'NISN tidak ditemukan. Silakan coba lagi.',
            });
        }
    };

    return (
        <div className="min-h-screen mesh-bg flex flex-col">
            {/* Header */}
            <header className="w-full p-4 md:p-6 flex items-center justify-between">
                <Link
                    to="/"
                    className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                    <span className="font-medium">Kembali</span>
                </Link>
                <ThemeToggle />
            </header>

            {/* Main Content */}
            <main className="flex-1 flex items-start justify-center px-4 pt-8 md:pt-16 pb-12">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="w-full max-w-md"
                >
                    <div className="glass-card p-8">
                        {/* Logo & Title */}
                        <div className="text-center mb-8">
                            <Logo size="xl" className="mb-4 inline-block" />
                            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white mb-2">
                                Login Siswa
                            </h1>
                            <p className="text-slate-600 dark:text-slate-400">
                                Masukkan NISN untuk melanjutkan
                            </p>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                            <Input
                                {...register('nisn')}
                                label="NISN (Nomor Induk Siswa Nasional)"
                                placeholder="Contoh: 0012345678"
                                error={errors.nisn?.message}
                                autoComplete="off"
                                className="text-lg py-4"
                            />

                            <Button
                                type="submit"
                                isLoading={isSubmitting}
                                className="w-full"
                                size="lg"
                            >
                                <User className="w-5 h-5" />
                                Masuk
                            </Button>
                        </form>

                        {/* Demo Hint */}
                        <div className="mt-6 p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800">
                            <p className="text-sm text-blue-700 dark:text-blue-300">
                                <strong>Demo:</strong> Gunakan NISN{' '}
                                <code className="px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-800 font-mono">
                                    0012345678
                                </code>
                            </p>
                        </div>
                    </div>
                </motion.div>
            </main>
        </div>
    );
}
