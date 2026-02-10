// Student type
export interface Student {
    id: string;
    nisn: string;
    name: string;
    className: string;
    avatar: string;
    email: string;
    phone: string;
}

// Bill status
export type BillStatus = 'UNPAID' | 'PAID' | 'EXPIRED' | 'PENDING';

// Bill type
export interface Bill {
    id: string;
    studentId: string;
    title: string;
    description: string;
    amount: number;
    dueDate: string;
    status: BillStatus;
    paidAt?: string;
    paymentMethod?: string;
    transactionId?: string;
}

// Payment type
export interface Payment {
    id: string;
    billId: string;
    studentId: string;
    studentName: string;
    amount: number;
    status: 'success' | 'pending' | 'failed';
    method: string;
    transactionId: string;
    createdAt: string;
}

// Admin stats
export interface AdminStats {
    totalStudents: number;
    totalBills: number;
    totalPaid: number;
    totalUnpaid: number;
    totalRevenue: number;
    monthlyRevenue: { month: string; revenue: number }[];
}

// Mock Students
export const mockStudents: Student[] = [
    {
        id: '1',
        nisn: '0012345678',
        name: 'Ahmad Rizky Pratama',
        className: 'XII IPA 1',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ahmad',
        email: 'ahmad.rizky@student.edu',
        phone: '081234567890',
    },
    {
        id: '2',
        nisn: '0012345679',
        name: 'Siti Nurhaliza',
        className: 'XII IPA 2',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Siti',
        email: 'siti.nur@student.edu',
        phone: '081234567891',
    },
    {
        id: '3',
        nisn: '0012345680',
        name: 'Muhammad Farhan',
        className: 'XI IPS 1',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Farhan',
        email: 'farhan.m@student.edu',
        phone: '081234567892',
    },
    {
        id: '4',
        nisn: '0012345681',
        name: 'Dewi Anggraini',
        className: 'XI IPA 3',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Dewi',
        email: 'dewi.a@student.edu',
        phone: '081234567893',
    },
    {
        id: '5',
        nisn: '0012345682',
        name: 'Budi Santoso',
        className: 'X IPA 1',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Budi',
        email: 'budi.s@student.edu',
        phone: '081234567894',
    },
];

// Mock Bills
export const mockBills: Bill[] = [
    {
        id: 'bill-001',
        studentId: '1',
        title: 'SPP Bulan Februari 2026',
        description: 'Pembayaran SPP bulanan',
        amount: 500000,
        dueDate: '2026-02-28',
        status: 'UNPAID',
    },
    {
        id: 'bill-002',
        studentId: '1',
        title: 'SPP Bulan Januari 2026',
        description: 'Pembayaran SPP bulanan',
        amount: 500000,
        dueDate: '2026-01-31',
        status: 'PAID',
        paidAt: '2026-01-15T10:30:00',
        paymentMethod: 'BCA Virtual Account',
        transactionId: 'TXN-001-2026',
    },
    {
        id: 'bill-003',
        studentId: '1',
        title: 'Uang Praktikum Semester 2',
        description: 'Biaya praktikum laboratorium',
        amount: 750000,
        dueDate: '2026-03-15',
        status: 'UNPAID',
    },
    {
        id: 'bill-004',
        studentId: '1',
        title: 'SPP Bulan Desember 2025',
        description: 'Pembayaran SPP bulanan',
        amount: 500000,
        dueDate: '2025-12-31',
        status: 'EXPIRED',
    },
    {
        id: 'bill-005',
        studentId: '2',
        title: 'SPP Bulan Februari 2026',
        description: 'Pembayaran SPP bulanan',
        amount: 500000,
        dueDate: '2026-02-28',
        status: 'PENDING',
        transactionId: 'TXN-PENDING-001',
    },
];

// Mock Payments
export const mockPayments: Payment[] = [
    {
        id: 'pay-001',
        billId: 'bill-002',
        studentId: '1',
        studentName: 'Ahmad Rizky Pratama',
        amount: 500000,
        status: 'success',
        method: 'BCA Virtual Account',
        transactionId: 'TXN-001-2026',
        createdAt: '2026-01-15T10:30:00',
    },
    {
        id: 'pay-002',
        billId: 'bill-010',
        studentId: '2',
        studentName: 'Siti Nurhaliza',
        amount: 500000,
        status: 'success',
        method: 'Mandiri Virtual Account',
        transactionId: 'TXN-002-2026',
        createdAt: '2026-01-18T14:20:00',
    },
    {
        id: 'pay-003',
        billId: 'bill-011',
        studentId: '3',
        studentName: 'Muhammad Farhan',
        amount: 750000,
        status: 'success',
        method: 'QRIS',
        transactionId: 'TXN-003-2026',
        createdAt: '2026-01-20T09:15:00',
    },
    {
        id: 'pay-004',
        billId: 'bill-005',
        studentId: '2',
        studentName: 'Siti Nurhaliza',
        amount: 500000,
        status: 'pending',
        method: 'BNI Virtual Account',
        transactionId: 'TXN-PENDING-001',
        createdAt: '2026-02-09T08:00:00',
    },
];

// Mock Admin Stats
export const mockAdminStats: AdminStats = {
    totalStudents: 156,
    totalBills: 468,
    totalPaid: 312,
    totalUnpaid: 156,
    totalRevenue: 156000000,
    monthlyRevenue: [
        { month: 'Sep', revenue: 24000000 },
        { month: 'Okt', revenue: 28000000 },
        { month: 'Nov', revenue: 26000000 },
        { month: 'Des', revenue: 30000000 },
        { month: 'Jan', revenue: 32000000 },
        { month: 'Feb', revenue: 16000000 },
    ],
};

// Get student by NISN
export function getStudentByNISN(nisn: string): Student | undefined {
    return mockStudents.find((s) => s.nisn === nisn);
}

// Get bills by student ID
export function getBillsByStudentId(studentId: string): Bill[] {
    return mockBills.filter((b) => b.studentId === studentId);
}

// Get unpaid bills by student ID
export function getUnpaidBillsByStudentId(studentId: string): Bill[] {
    return mockBills.filter(
        (b) => b.studentId === studentId && (b.status === 'UNPAID' || b.status === 'EXPIRED')
    );
}

// Get paid bills by student ID
export function getPaidBillsByStudentId(studentId: string): Bill[] {
    return mockBills.filter((b) => b.studentId === studentId && b.status === 'PAID');
}
