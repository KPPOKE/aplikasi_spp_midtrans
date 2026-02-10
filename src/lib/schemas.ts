import { z } from 'zod';

// Student login schema
export const studentLoginSchema = z.object({
    nisn: z
        .string()
        .min(1, 'NISN wajib diisi')
        .regex(/^\d{10}$/, 'NISN harus 10 digit angka'),
});

export type StudentLoginInput = z.infer<typeof studentLoginSchema>;

// Admin login schema
export const adminLoginSchema = z.object({
    username: z
        .string()
        .min(1, 'Username wajib diisi')
        .min(3, 'Username minimal 3 karakter'),
    password: z
        .string()
        .min(1, 'Password wajib diisi')
        .min(6, 'Password minimal 6 karakter'),
});

export type AdminLoginInput = z.infer<typeof adminLoginSchema>;

// Payment schema
export const paymentSchema = z.object({
    billId: z.string().min(1, 'Bill ID wajib diisi'),
    paymentMethod: z.string().min(1, 'Metode pembayaran wajib dipilih'),
});

export type PaymentInput = z.infer<typeof paymentSchema>;
